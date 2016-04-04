import Ember from 'ember';
import DS from 'ember-data';
import ImdtTableComponent from './imdt-table';

const {
  set,
  on,
  getProperties,
  computed,
  observer,
  inject,
  A
} = Ember;

export default ImdtTableComponent.extend({
  store: inject.service(),

  modelName: '',
  queryParams: {},
  meta: {},

  processedContent: new A([]),

  content: computed('queryParams.page.limit', 'queryParams.page.offset', 'queryParams.sort', function() {
    const {
      store,
      modelName,
      queryParams
    } = getProperties(this, 'store', 'modelName', 'queryParams');

    return DS.PromiseArray.create({
      promise: store.query(modelName, queryParams)
        .then((result) => {
          this.set('meta', result.get('meta'));
          this.set('processedContent', result);
          return result;
        })
        .catch((reason) => {

          throw reason;
        })
    });
  }),

  /**
   * Component init
   * Setup query params for each table type
   * @method setup
   * @override
   */
  setup: on('init', function() {
    this._super.call(this);

    const {
      paginable,
      sortable,
      searchable
    } = getProperties(this, 'paginable', 'sortable', 'searchable');

    if(paginable) {
      this._setupPaginationQueryParams();
    }
  }),

  /*
   * PAGINATION
   * ========================
   */

  paginationDidChange: observer('pageSize', 'currentPageNumber', function() {
    this._setupPaginationQueryParams();
  }),

  currentLength: computed('meta.count', function() {
    return this.get('meta.count') || 0;
  }),

  /**
   * Setup query params for the pagination
   * @method _setupPaginationQueryParams
   * @private
   */
  _setupPaginationQueryParams() {
    const {
      pageSize,
      currentPageNumber
    } = getProperties(this, 'modelName', 'pageSize', 'currentPageNumber');

    const startIndex = pageSize * (currentPageNumber - 1);

    this.set('queryParams.page', {
      offset: startIndex,
      limit: pageSize
    });
  },

  /**
   *
   * SORTING
   * ===============================
   */
  sortingDidChange: observer('sortProperties', function() {
    this.set('queryParams.sort', this._parseSortProps(this.get('modelName'), this.get('sortProperties')))
  }),

  _parseSortProps(modelName, query) {
    const adapter = Ember.getOwner(this).lookup('adapter:application');
    const pathForType = adapter.pathForType(modelName);
    const serializer = Ember.getOwner(this).lookup('serializer:application');

    let sortProps = {
      sortOptions: {}
    };
    sortProps.sortOptions[pathForType] = [];

    let property, direction;
    let sortOptions = [];
    if(typeof query === 'string') {
      if(query.indexOf(':') !== -1) {
        [property, direction] = query.split(':');
        sortOptions.push({
          property: property,
          direction: direction
        });
      } else {
        sortOptions.push({
          property: query,
          direction: 'asc'
        });
      }
    }
    else {
      query.forEach((prop, i) => {
        [property, direction] = prop.split(':');
        sortOptions.push({
          property: property,
          direction: direction,
          index: i
        });
      });
    }

    sortOptions.forEach((sort, i) => {
      set(sortProps.sortOptions[pathForType], i.toString(), {});
      if(sort.property.indexOf('.') !== -1) {
        sort.property.split('.').reduce((o, s) => {
          if(!o[s]){
            o[s] = {};
          }

          return o[s];
        }, sortProps.sortOptions[pathForType][i]);
      }

      set(sortProps.sortOptions[pathForType][i], serializer.keyForAttribute(sort.property.toString()), sort.direction);
    });

    return sortProps.sortOptions;
  }
});
