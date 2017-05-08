import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('application.index', {path: '/'});
  this.route('github-users');
  this.route('github-repos');
});

export default Router;
