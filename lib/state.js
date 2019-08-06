const { Then } = require('cucumber');
const jsonpath = require('jsonpath');
const { defineHelper } = require('./step_helpers');

defineHelper('state {jsonpath_array}', value => value);

defineHelper('state {jsonpath}', value => value);

Then('{structured_type} should be stored as {}', function(value, query) {
  jsonpath.value(this, query, value);
});