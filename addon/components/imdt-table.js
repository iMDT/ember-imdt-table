import Ember from 'ember';
import ColumnDefinition from '../models/imdt-table-column';

import TablePaginableMixin from '../mixins/table-paginable';
import TableSearchableMixin from '../mixins/table-searchable';
import TableSortableMixin from '../mixins/table-sortable';

import layout from '../templates/components/imdt-table';

const {
  get,
  set,
  A,
  on,
  computed,
  getWithDefault,
  keys,
  isNone
} = Ember;

const DEFAULT_MESSAGES = {
  emptyTable: 'Nenhum registro'
};

export default Ember.Component.extend(TableSearchableMixin, TableSortableMixin, TablePaginableMixin, {
  classNames: ['imdt-table-area'],

  layout: layout,

  /**
   * @type {Object[]}
   */
  messages: {},

  /**
   * @type {string[]}
   */
  tableClassNames: ['imdt-table'],

  /**
   * All table records
   * @type {Ember.Object[]}
   */
  content: new A([]),

  /**
   * @type {Ember.Object[]}
   * content -> filteredContent   -> arrangedContent -> visibleContent
   * raw     -> search            -> sort            -> page
   */
  processedContent: computed('content.[]', 'filteredContent.[]', 'arrangedContent.[]', 'visibleContent.[]', function() {
    if(get(this, 'paginable')) {
      return get(this, 'visibleContent');
    }

    if(get(this, 'sortable')) {
      return get(this, 'arrangedContent');
    }

    if(get(this, 'searchable')) {
      return get(this, 'filteredContent');
    }
    return get(this, 'content');
  }),

  /**
   * @typedef {
   *  Object {
   *    columnTitle: string,
   *    contentPath: string,
   *    sortPath: string,
   *    template: string,
   *    isSortable: boolean,
   *    isVisible: boolean,
   *    className: string
   *  }
   * } column
   */
  /**
   * Table columns
   * @type {column[]}
   */
  columns: new A([]),

  /**
   * @type {ColumnDefinition[]}
   */
  processedColumns: Ember.computed('columns', function(){
    let processedColumns = new A(get(this, 'columns').map(column => {
      let c = ColumnDefinition.create(column);

      if(isNone(c.get('sortPath'))) {
        c.set('sortPath', c.get('contentPath'));
      }

      return c;
    }));
    return processedColumns;
  }),

  /**
   * Component init
   * Set visibility and filtering attributes for each column
   * Update messages used by table with user-provided messages (@see messages)
   * @method setup
   */
  setup: on('init', function() {
    this._setupColumns.call(this);
    this._setupMessages.call(this);
    this._super.call(this);
  }),

  /**
   * Create a ColumnDefinition object for each column
   * @method _setupColumns
   * @private
   */
  _setupColumns() {
    let processedColumns = new A(get(this, 'columns').map(column => {
      let c = ColumnDefinition.create(column);

      if(isNone(c.get('sortPath'))) {
        c.set('sortPath', c.get('contentPath'));
      }

      return c;
    }));

    set(this, 'processedColumns', processedColumns);

    this._super.call(this);
  },

  /**
   * Update messages used by widget with custom values provided by user in the <code>messages</code>
   * @method _setupMessages
   * @private
   */
  _setupMessages() {
    this._super.call(this);

    const customMessages = getWithDefault(this, 'messages', {});
    const newMessages = Ember.merge(DEFAULT_MESSAGES, customMessages);

    set(this, 'messages', Ember.Object.create(newMessages));
  },

  actions: {
    sendAction () {
      this.sendAction.apply(this, arguments);
    },
  }
});
