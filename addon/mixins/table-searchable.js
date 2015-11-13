import Ember from 'ember';

const {
  A,
  set,
  get,
  getProperties,
  computed,
  observer
} = Ember;

const DEFAULT_MESSAGES = {
  label: 'Search: ',
};

export default Ember.Mixin.create({
  searchable: true,

  /**
   * @type {string}
   */
  searchTerm: '',

  /**
   * Determines if filtering should ignore case
   * @type {boolean}
   */
  searchIgnoreCase: true,

  /**
   * Template with the search field
   * @type {string}
   */
  searchTemplate: 'components/imdt-table/search',

  /**
   * Search term length for the back search
   * @type {integer}
   */

  /**
   * @type {Ember.Object[]}
   */

  cachedContent: new A([]),

  contentObserverToClearCache: Ember.observer('content.[]', function(){
    this.set('cachedContent', new A([]));
  }),

  filteredContent: computed('searchTerm', 'content.[]', function() {
    const {
      processedColumns,
      content,
      cachedContent,
      searchIgnoreCase
    } = getProperties(this, 'processedColumns', 'content', 'cachedContent', 'searchIgnoreCase');

    let searchTerm = get(this, 'searchTerm');

    // If the search field is empty, return the original arrangedContent
    if(!get(searchTerm, 'length')) {
      return content;
    }

    // If the searched is already cached, return the corresponding array
    if(cachedContent[searchTerm]){
      return cachedContent[searchTerm];
    }

    // Sets where to search if the search field is not empty
    let contentToSearch = content;
    if (get(searchTerm, 'length') > 1) {
      let slice = searchTerm.slice(0, searchTerm.length-1);
        if (slice.length && cachedContent[slice]){
          contentToSearch = cachedContent[slice];
        }
    }

    // Search
    let filteredContent = new A(contentToSearch.filter(function (row) {
      return processedColumns.length ? processedColumns
      //.filter(x => x.get('isSearchable'))
      .any(c => {
        const contentPath = get(c, 'contentPath');

        if (contentPath) {
          let cellValue = '' + get(row, contentPath);
          if (searchIgnoreCase) {
            cellValue = cellValue.toLowerCase();
            searchTerm = searchTerm.toLowerCase();
          }
          return -1 !== cellValue.indexOf(searchTerm);
        }

        return false;
      }) : true;
    }));

    // Cache the content
    cachedContent[searchTerm] = filteredContent;

    return filteredContent;
  }),

  /**
   * Open first page if user has changed term
   * @method pageSizeDidChange
   */
  searchTermDidChange: observer('searchTerm', function() {
    set(this, 'currentPageNumber', 1);
  }),

  /**
   * Append the default messages used by the mixin
   * @type {boolean}
   */
   _setupMessages() {
     set(this, 'messages.search', DEFAULT_MESSAGES);
     this._super.call(this);
   },
});