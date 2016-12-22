import Ember from 'ember';

export default Ember.Controller.extend({
  modelName: 'feriado',
  sort: new Ember.A(['dtFeriado:asc']),
  columns: new Ember.A([{
    contentPath: 'nome',
    columnTitle: 'Nome do Feriado'
  }, {
    contentPath: 'dtFeriadoFormatted',
    columnTitle: 'Data',
    sortPath: 'dtFeriado',
  }, {
    contentPath: 'todoAnoFormatted',
    columnTitle: 'Repete na mesma data todo ano?',
    sortPath: 'todoAno',
  }, {
    contentPath: 'modificacaoFormatted',
    columnTitle: 'Data do Cadastro',
    sortPath: 'modificacao',
  }, {
    contentPath: 'usuario',
    columnTitle: 'Cadastrado por'
  },])
});
