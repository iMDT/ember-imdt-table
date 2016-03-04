import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('imdt-table-remote', 'Integration | Component | imdt table remote', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{imdt-table-remote}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#imdt-table-remote}}
      template block text
    {{/imdt-table-remote}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
