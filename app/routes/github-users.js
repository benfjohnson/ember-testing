import Ember from 'ember';

/* global $ */

export default Ember.Route.extend({
  queryParams: {
    since: {refreshModel: true},
  },

  model(params) {
    return $.get(`https://api.github.com/users?since=${params.since}`);
  },
});
