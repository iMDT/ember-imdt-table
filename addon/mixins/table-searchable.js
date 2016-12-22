import Ember from 'ember';
import removeDiacritics from '../utils/remove-diacritics';

const {
  A,
  set,
  get,
  getProperties,
  computed,
  observer,
  on,
} = Ember;

const DEFAULT_MESSAGES = {
  label: 'Busca: ',
};

export default Ember.Mixin.create({
  setup: on('init', function() {
    this._super.call(this);
    this.notifyPropertyChange('searchTerm');
  }),

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
   * Determines if filtering should ignore diacritics
   * @type {boolean}
   */
  searchIgnoreDiacritics: true,

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

  reload: 0,

  contentObserverToClearCache: Ember.observer('content.[]', function(){
    this.set('cachedContent', new A([]));
    // this.incrementProperty('reload');  LOOP INFINITO NA REMOTE
  }),

  filteredContent: computed('searchTerm', 'content.[]', 'reload', function() {
    const {
      processedColumns,
      content,
      cachedContent,
      searchIgnoreCase,
      searchIgnoreDiacritics,
    } = getProperties(this, 'processedColumns', 'content', 'cachedContent', 'searchIgnoreCase', 'searchIgnoreDiacritics');

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

          if (searchIgnoreDiacritics) {
            cellValue = removeDiacritics(cellValue);
            searchTerm = removeDiacritics(searchTerm);
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
    this.sendAction('searchTermChangeAction', this.get('processedContent'), this.get('searchTerm'));
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
