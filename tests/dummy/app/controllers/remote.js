import Ember from 'ember';

export default Ember.Controller.extend({
  modelName: 'dummy',
  columns: new Ember.A([{
    contentPath: 'id',
    columnTitle: 'ID',
    isSortable: false,
    isSearchable: false,
  }, {
    contentPath: 'nome',
    columnTitle: 'Name'
  },
  {
    contentPath: 'template',
    columnTitle: 'Template',
    template: 'custom/button'
  }
]),
  sort: new Ember.A(['name:desc']),
});
