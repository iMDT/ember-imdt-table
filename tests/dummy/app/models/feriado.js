import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
	nome: DS.attr('string'),
  usuario: DS.attr('string'),
  dtFeriado: DS.attr('date'),
	todoAno: DS.attr('boolean'),

  dtFeriadoFormatted: Ember.computed('dtFeriado', function() {
    return moment(this.get('dtFeriado')).format('L');
  }),

	todoAnoFormatted: Ember.computed('todoAno', function() {
    return this.get('todoAno') ? 'Sim' : 'Não';
  }),
});
