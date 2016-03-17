import DS from 'ember-data';
import ENV from '../config/environment';

export default DS.JSONAPIAdapter.extend({
  host: ENV.API.baseURL,
  namespace: ENV.API.namespace
});
