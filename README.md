# Useful tests in Ember.js

When writing a complex web app, it's crucial that a developer writes tests which fully exercise the application business logic. JavaScript is a dynamic, flexible language, and while that can mean speedy development and a small learning curve, it also means that its interpreter is perfectly happy to run broken or flawed code that will break at runtime.

In Ember, the two most useful kinds of tests are Unit tests, which can be used to exercise nearly any unit of application logic (routes, controllers, models, mixins, etc.), and Integration tests, which we'll primarily use to exercise our Component logic. Ember also supports Acceptance tests, which test your clientside application end-to-end by building your entire application and running it in PhantomJS, but these are problematic for a number of reasons -- often require extensive mocking, run the slowest, can pass/fail inconsistently, etc. -- and should be used sparingly.

## Resources

Before running through this tutorial, you should complete a basic tutorial on Ember to better understand its architecture and common patterns:

https://guides.emberjs.com/v2.13.0/tutorial/ember-cli/

Next, you should read the short guide on testing:

https://guides.emberjs.com/v2.13.0/testing/

These two resources will give you everything you need to write useful tests for an Ember app.

## Application Structure

This repo contains a very small Ember application. The key structure is as follows:

* The `application` route, and its `application.index` child route render our universal header/footer and a simple welcome message, respectively, and contain no application logic. These don't need to be tested beyond doing a simple assertion that elements rendered in our primary acceptance test.

* The `github-users` route is where something interesting is going on. In addition to its route file which creates the page model, it also has a controller file which is creating some query parameters for pagination. It's also using a component -- `paginate-ctrl`.

* We have a number of test files that have been created and stubbed out for us as the `ember-cli` was used to generate our routes, controllers and components. We have the following integration test files:

  * paginate-ctrl-test.js

And the following unit test files: 

  * github-users-test.js (route)
  * github-users-test.js (controller)
  * application/index-test.js

## Test time

Before we write any tests, it's useful to see if there are any test files that we don't think we need, that we can rip out. Auto-generated test files have a habit of hanging around, even when we don't add any logic/tests to them, and can give a false sense of security that we're testing parts of our app when in reality we just have dummy assertions. _A useless test is much worse than having no test at all!_

Immediately, application/index-test.js jumps out. As mentioned above, that route is a simple welcome message. While we could write a test that asserts something about the text of that message, that wouldn't be very useful, as we aren't testing any _logic_ by doing that. Go ahead and delete that file.

Next, let's check out the routes/github-users-test.js Unit test file that's been created for us. If we look at the actual route it's been created for, we'll see that all it's doing is returning a model by hitting the github /users API endpoint. You could try mocking our AJAX call and then assert that our model contains the same list of users we mocked it with, but that seems like a lot of work for minimum payoff. Testing the list of users would be better left as part of an Acceptance test that navigated to the users page and asserted statements about its DOM. We'll remove this test as well.

Now, the github-users.js controller file actually has something useful for us to test. If we inspect it, there's a `since` property on the controller, and also an action `updateSince` which takes a new value and updates the internal `since` prop with it. That is a nice, easy unit test to write -- let's replace the generated controllers/github-users-test.js file with the following:

```javascript
test('updateSince action updates since property', function(assert) {
  let controller = this.subject();
  assert.ok(controller);

  assert.equal(controller.get('since'), 0, 'since param intialized to 0');

  controller.send('updateSince', 45);

  assert.equal(controller.get('since'), 45, 'Action updated since property');
});
```

Now we've tested all the logic of our page's controller. Neat! That was the last unit test file, so now let's look at our integration tests. As mentioned before, we just have a single component in this app -- `paginate-ctrl`. Components are typically a great place to store your application's business logic. In ember, our ideal architecture is as follows:

* Routes handle your asynchronous data retrieval, and set up your `model` for a specific page.

* Controllers are only sometimes necessary (like when using query-params), and are good for saving values that don't quite fit with your core route model. A good example would be something like a `buttonIsDisabled` property that we initially set to true, which we'd potentially pass down to a component that would send updates to that value based on user interaction.

* Components take values from our routes and route controllers, as well as actions they can call when they'd like the router or controller to change one or more of these values. They make these requests usually based on user interaction.

Because components are so easy to test, it's ideal to put most of our logic in them. Let's replace our generated 'it renders' test in the paginate-ctrl-test.js file with a better simple case:

```javascript
test('it renders', function(assert) {
  this.render(hbs`{{paginate-ctrl}}`);

  assert.equal(this.$('.paginate-ctrl button').length, 2, 'both buttons rendered');
});
```

While not a very exciting test, we at least know we've created two buttons that we'll be using to move between pages of data.

Now, let's write a couple more advanced tests that ensure we disable the "Previous" page button when we're on the first page of user data, but enable it if we're not:

```javascript
test('previous button disabled when since is 0', function(assert) {
  this.render(hbs`{{paginate-ctrl since=0 }}`);

  assert.ok(this.$('button:contains("Previous")').attr('disabled'), 'Previous btn disabled');
});

test('previous button enabled when positive since val', function(assert) {
  this.render(hbs`{{paginate-ctrl since=30 }}`);

  assert.notOk(this.$('button:contains("Previous")').attr('disabled'), 'Previous btn enabled');
});
```

The key thing to note is that these components are kind of like pure functions -- when we pass in different inputs (in this case, values for `since`), we can expect to get corresponding, consistent outputs (in this case, the disablement of the "Previous button").

So far we've just tested the disablement logic of the previous button, or the _data_ our component expects to receive from its parent route. Now let's test the _action_ it takes in, the `updateSince` function:

```javascript
test('Prev/next buttons call updateSince parameter with correct new val', function(assert) {
  this.set('updateSince', (newVal) => {
    assert.equal(newVal, 60, 'Next action when at since of 30 yields 60');
    this.set('since', newVal);
  });

  this.set('since', 30);

  assert.expect(2);
  
  this.render(hbs`{{paginate-ctrl since=since updateSince=updateSince }}`);

  // This should fire our updateSince action above
  this.$('button:contains("Next")').click();

  // Now set a new updateSince action for testing prev. button:
  this.set('updateSince', (newVal) => {
    assert.equal(newVal, 30, 'Prev. action when at since of 60 yields 30');
    this.set('since', newVal);
  });

  this.$('button:contains("Previous")').click();
});
```

There's a few things of note here:

1. Just like in the real application, we can use `this.set` to create a real function or value in the component's parent scope.

2. When we click the next and previous buttons, ember is firing off the `updateSince` action we passed in via the `this.render` call. That's a great place to assert that the data we pass into this outer function is correct.

3. You can set parent properties via `this.set` both before _and_ after the component is rendered, to simulate more complex series of user interactions.

With these 4 tests, I'd argue that we've fully exercised our component's logic. We'd next create an Acceptance test that visited the landing page of the application, navigated to the users route, and asserted various things about the generated html, but that's out of the scope of this exercise. Happy testing!