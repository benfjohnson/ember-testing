# Useful tests in Ember.js

When writing a complex web app, it's crucial that a developer writes tests which fully exercise the application business logic. JavaScript is a dynamic, flexible language, and while that can mean speedy development and a small learning curve, it also means that its interpreter is perfectly happy to run broken or flawed code that will break at runtime.

In Ember, the two most useful kinds of tests are Unit tests, which can be used to exercise nearly any unit of application logic (routes, controllers, models, mixins, etc.), and Integration tests, which we'll primarily use to exercise our Component logic. Ember also supports Acceptance tests, which test your clientside application end-to-end by building your entire application and running it in PhantomJS, but these are problematic for a number of reasons -- often require extensive mocking, run the slowest, can pass/fail inconsistently, etc. -- and should be used sparingly.

This repo contains a very small Ember application. The key structure is as follows:

* The `application` route, and its `application.index` child route render our universal header/footer and a simple welcome message, respectively, and contain no application logic. These don't need to be tested beyond doing a simple assertion that elements rendered in our primary acceptance test.

* The `github-users` route is where something interesting is going on. In addition to its route file which creates the page model, it also has a controller file which is creating some query parameters for searching and pagination. We're also using two components in this route -- `paginate-ctrl` and `user-search`.

* We have a number of test files that have been created and stubbed out for us as the `ember-cli` was used to generate our routes, controllers and components. We have the following integration test files:

  * user-search-box-test.js
  * paginate-ctrl-test.js

And the following unit test files:

  * github-users-test.js (route)
  * github-users-test.js (controller)

