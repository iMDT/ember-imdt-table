import Ember from 'ember';

const {
  get,
  set,
  getProperties,
  computed,
  observer,
  A,
  on,
} = Ember;

const DEFAULT_MESSAGES = {
  prev: '&lsaquo;',
  next: '&rsaquo;',
  first: '&laquo;',
  last: '&raquo;',
};

export default Ember.Mixin.create({
  setup: on('init', function() {
    this._super.call(this);
    this.notifyPropertyChange('currentPageNumber');
  }),

  /**
   * Defines if the table should use pagination
   * @type {number}
   */
  paginable: true,

  /**
   * Define if the pagination template is simple or numeric
   * @type {number}
   */
  useSimplePagination: true,

  /**
   * List of possible <code>pageSize</code> values
   * Used to change size of <code>visibleContent</code>
   * @type {number[]}
   */
  pageSizeValues: new A([10, 25, 50]),

  /**
   * Number of records shown on one table-page (size of the <code>visibleContent</code>)
   * Should be a pageSizeValues element
   * @type {number}
   */
  pageSize: computed('pageSizeValues.[]', function() {
    return get(this, 'pageSizeValues').get('firstObject');
  }),

  /**
   * @type {number}
   */
  currentPageNumber: 1,

  /**
   * @type {number}
   */
  currentLength: computed('arrangedContent.[]', function() {
    return get(this, 'arrangedContent.length');
  }),

  /**
   * Pagination template
   * @type {string}
   */
  paginationTemplate: 'components/imdt-table/pagination',

  /**
   * Template with First|Prev|Next|Last buttons
   * @type {string}
   */
  simplePaginationTemplate: 'components/imdt-table/pagination/simple',

  /**
   * Template with nav buttons
   * @type {string}
   */
  numericPaginationTemplate: 'components/imdt-table/pagination/numeric',

  shouldDisplayPagination: computed('currentLength', 'pageSize', function(){
    return get(this, 'currentLength') > get(this, 'pageSize');
  }),

  /**
   * Content of the current table page
   * @type {Ember.Object[]}
   */
  visibleContent: computed('currentLength', 'pageSize', 'currentPageNumber', function() {
    const {
      arrangedContent,
      pageSize,
      currentPageNumber
    } = getProperties(this, 'arrangedContent', 'pageSize', 'currentPageNumber');
    const startIndex = pageSize * (currentPageNumber - 1);
    if (get(arrangedContent, 'length') < pageSize) {
      return arrangedContent;
    }
    return new A(arrangedContent.slice(startIndex, startIndex + pageSize));
  }),

  /**
   * Number of pages
   * @type {number}
   */
  pagesCount: computed('currentLength', 'pageSize', function() {
    const pagesCount = get(this, 'currentLength') / get(this, 'pageSize');
    return (0 === pagesCount % 1) ? pagesCount : (Math.floor(pagesCount) + 1);
  }),

  /**
   * List of links to the page
   * Used if <code>useNumericPagination</code> is true
   * @type {{isLink: boolean, label: string, isActive: boolean}[]}
   */
  visiblePageNumbers: computed('currentLength', 'pagesCount', 'currentPageNumber', function() {
    const {
      pagesCount,
      currentPageNumber
    } = getProperties(this, 'pagesCount', 'currentPageNumber');

    const pageRange = 3;

    let pagesToDisplay = {
      prevPages: new A([]),
      nextPages: new A([]),
    };

    for(let i = 1; i <= pageRange; i++) {
      let prevPage = currentPageNumber - i;
      let nextPage = currentPageNumber + i;

      if(prevPage > 0) {
        pagesToDisplay.prevPages.unshift(prevPage);
      }

      if(nextPage < pagesCount) {
        pagesToDisplay.nextPages.push(nextPage);
      }
    }

    return pagesToDisplay;
  }),

  isLastPage: computed('pageSize', 'currentPageNumber', 'currentLength', function(){
    const pageSize = get(this, 'pageSize');
    const currentPageNumber = get(this, 'currentPageNumber');
    const arrangedContentLength = get(this, 'currentLength');
    if(pageSize * currentPageNumber >= arrangedContentLength){
      return true;
    }
    return false;
  }),

  /**
   * Real table summary
   * @use summaryTemplate
   * @type {string}
   */
  summary: computed('pageSize', 'currentPageNumber', 'currentLength', function () {
    const {
      currentPageNumber,
      pageSize
    } = getProperties(this, 'currentPageNumber', 'pageSize');
    const arrangedContentLength = get(this, 'currentLength');
    const isLastPage = get(this, 'isLastPage');
    const firstIndex = 0 === arrangedContentLength ? 0 : pageSize * (currentPageNumber - 1) + 1;
    const lastIndex = isLastPage ? arrangedContentLength : currentPageNumber * pageSize;
    return `${firstIndex} - ${lastIndex} ~ ${arrangedContentLength}`;
  }),

  /**
   * Open first page if user has changed pageSize
   * @method pageSizeDidChange
   */
  pageSizeDidChange: observer('pageSize', function() {
    set(this, 'currentPageNumber', 1);
    this.sendAction('pageSizeChangeAction', this.get('processedContent'));
  }),

  /**
   * Send action if the current page change
   * @method currentPageDidChange
   */
  currentPageDidChange: observer('currentPageNumber', function() {
    this.sendAction('currentPageChangeAction', this.get('processedContent'), this.get('currentPageNumber'));
  }),

  /**
   * Are buttons "Back" and "First" enabled
   * @type {boolean}
   */
  gotoBackEnabled: computed.gt('currentPageNumber', 1),

  /**
   * Are buttons "Next" and "Last" enabled
   * @type {boolean}
   */
  gotoForwardEnabled: computed('currentPageNumber', 'pagesCount', function () {
    return get(this, 'currentPageNumber') < get(this, 'pagesCount');
  }),

  /**
   * Append the default messages used by the mixin
   * @type {boolean}
   */
   _setupMessages () {
     set(this, 'messages.pagination', DEFAULT_MESSAGES);
     this._super.call(this);
   },

  actions: {
    gotoFirstPage() {
      if (!get(this, 'gotoBackEnabled')) {
        return;
      }

      set(this, 'currentPageNumber', 1);
    },

    gotoPrevPage() {
      if (!get(this, 'gotoBackEnabled')) {
        return;
      }

      if (get(this, 'currentPageNumber') > 1) {
        this.decrementProperty('currentPageNumber');
      }
    },

    gotoNextPage() {
      if (!get(this, 'gotoForwardEnabled')) {
        return;
      }

      var currentPageNumber = get(this, 'currentPageNumber');
      var pageSize = get(this, 'pageSize');
      var arrangedContentLength = get(this, 'currentLength');
      if (arrangedContentLength > pageSize * (currentPageNumber - 1)) {
        this.incrementProperty('currentPageNumber');
      }
    },

    gotoLastPage() {
      if (!get(this, 'gotoForwardEnabled')) {
        return;
      }

      set(this, 'currentPageNumber', get(this, 'pagesCount'));
    },

    gotoPage(pageNumber) {
      set(this, 'currentPageNumber', pageNumber);
    },

    change() {
      let changeAction = this.get('action');
      let selectedEl = this.$('select')[0];
      let selectedIndex = selectedEl.selectedIndex;
      let content = this.get('content');
      let selectedValue = content[selectedIndex];

      this.set('pageSize', selectedValue);
      // changeAction(selectedValue);
    }
  }
});
