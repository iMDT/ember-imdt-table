'use strict';

module.exports = {
  normalizeEntityName: function() {},
  afterInstall: function() {
    return this.addPackagesToProject([{
      name: 'ember-truth-helpers',
      target: 'latest'
    }]);
  }
};
