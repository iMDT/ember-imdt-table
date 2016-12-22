import Ember from 'ember';

const {
  keys,
  get,
  set,
  computed,
  observer,
  isNone,
  A,
  on,
} = Ember;

export default Ember.Mixin.create({
  setup: on('init', function() {
    this._super.call(this);
    this.notifyPropertyChange('sortProperties');
  }),
  
  sortable: true,

  /**
   * @type {string[]}
   */
  sortProperties: new A([]),

  /**
   * @type {Ember.Object[]}
   */
  arrangedContent: computed.sort('filteredContent', 'sortProperties'),

  sortPropertiesDidChange: observer('sortProperties', function() {
    const processedColumns = get(this, 'processedColumns');

    /* TODO: Resetting the direction
        everytime doenst seems to be a good ideia */
    processedColumns.setEach('sortDirection', 'none');

    get(this, 'sortProperties').forEach(propertyName => {
      let [column, direction] = propertyName.split(':');

      let c = processedColumns.findBy('sortPath', column);

      if (isNone(c)) {
        return;
      }

      set(c, 'sortDirection', direction || 'asc');
    });
  }),

  _setupColumns() {
    this.notifyPropertyChange('sortProperties');
    this._super.call(this);
  },

  actions: {
    /**
     * @param {column} column
     */
    sort(column, e) {
      if (!get(this, 'sortable') || !get(column, 'isSortable')) {
        return false;
      }

      const sortMap = {
        none: 'asc',
        asc: 'desc',
        desc: 'none'
      };

      const sortProperties = get(this, 'sortProperties');
      const sortBy = get(column, 'sortPath');
      const currentSorting = get(column, 'sortDirection');
      const newSorting = sortMap[currentSorting];

      if (column.customSort) {
        const newSort = column.customSort(sortProperties, column);
        if (!Ember.isArray(newSort)) {
          console.error('For a custom sort you MUST return an array of sort proerties')
          return;
        }
        set(this, 'sortProperties', newSort);
        return;
      }

      let newSortProperties = new A([]);

      if (e.ctrlKey) {
        let sortPropertiesMap = sortProperties.reduce((newSort, propertyName) => {
          let [column, direction] = propertyName.split(':');
          newSort[column] = direction;
          return newSort;
        }, {});

        sortPropertiesMap[sortBy] = newSorting;

        newSortProperties = keys(sortPropertiesMap)
          .filter(x => sortPropertiesMap[x] !== 'none')
          .map(x => `${x}:${sortPropertiesMap[x]}`);
      } else {
        if ('none' !== newSorting) {
          newSortProperties.pushObject(`${sortBy}:${newSorting}`);
        }
      }

      set(this, 'sortProperties', newSortProperties);
    },
  }
});
