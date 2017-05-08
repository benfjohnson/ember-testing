import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['since'],

  since: 0,

  actions: {
    updateSince(newValue) {
      this.set('since', newValue);
    },
  }
});
