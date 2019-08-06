const { Then } = require('cucumber');
const util = require('util');

Then('{structured_type} should be equal to {structured_type}', function(a, b, pass) {
  if(JSON.stringify(a) === JSON.stringify(b)) {
    pass();
  } else {
    pass(`given objects should be equal, but they are not,\n\nfirst object:\n\n${util.inspect(a, {depth: null})}\n\n, second object:\n\n${util.inspect(b, {depth: null})}\n\n`);
  };
});

Then('{structured_type} should not be equal to {structured_type}', function(a, b, pass) {
  if(JSON.stringify(a) !== JSON.stringify(b)) {
    pass();
  } else {
    pass(`given objects should not be equal, but they are:\n\n${util.inspect(a, {depth: null})}\n\n`);
  };
});

Then('{jsonpath} should exists', function(object, pass) {
  if(object !== undefined) {
    pass();
  } else {
    pass(`given object should exists, but it's not`);
  };
});

Then('{jsonpath} should not exists', function(object, pass) {
  if(object === undefined) {
    pass();
  } else {
    pass(`given object should not exists, but it is:\n\n${util.inspect(object, {depth: null})}\n\n`);
  };
});

Then('{jsonpath_array} should be empty', function(array, pass) {
  if(array.length === 0) {
    pass();
  } else {
    pass(`given array should be empty, but it's not:\n\n${util.inspect(a, {depth: null})}\n\n`);
  };
});

Then('{jsonpath_array} should not be empty', function(array, pass) {
  if(array.length > 0) {
    pass();
  } else {
    pass(`given array should not be empty, but it is`);
  };
});