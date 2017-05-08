import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('paginate-ctrl', 'Integration | Component | paginate ctrl', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{paginate-ctrl}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#paginate-ctrl}}
      template block text
    {{/paginate-ctrl}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
