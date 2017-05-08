import Ember from 'ember';

export default Ember.Component.extend({
  PAGE_SIZE: 30,
  
  previousDisabled: Ember.computed('since', function() {
    return this.get('since') <= 0;
  }),

  actions: {
    nextClicked() {
      const updateSince = this.get('updateSince');
      const since = this.get('since');

      updateSince(since + this.get('PAGE_SIZE'));
    },

    previousClicked() {
      const updateSince = this.get('updateSince');
      const since = this.get('since');

      updateSince(since - this.get('PAGE_SIZE'));
    }
  }
});
