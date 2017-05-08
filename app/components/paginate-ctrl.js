import Ember from 'ember';

export default Ember.Component.extend({
  previousDisabled: Ember.computed('since', function() {
    return this.get('since') <= 0;
  }),

  actions: {
    nextClicked() {
      const updateSince = this.get('updateSince');
      const since = this.get('since');

      updateSince(since + 30);
    },

    previousClicked() {
      const updateSince = this.get('updateSince');
      const since = this.get('since');

      updateSince(since - 30);
    }
  }
});
