const { Given, When, Then } = require('cucumber');

When('I save {int} in the storage', function(value) {
  this.storedValue = value;
});

When('I add {int} to value in the storage', function(value) {
  this.storedValue += value;
});

Then('I should have {int} in the storage', function(expectedValue, pass) {
  if(this.storedValue !== undefined && this.storedValue === expectedValue) {
    pass();
  } else {
    pass(`expect to have ${expectedValue} in storage, but in fact there is ${this.storedValue}`);
  };
});

When('I save {heavy_object} in the storage', function(heavyObject) {
  this.storedValue = heavyObject.id;
});

Then('I should see {heavy_object} in the storage', function(heavyObject, pass) {
  if(this.storedValue !== undefined && this.storedValue === heavyObject.id) {
    pass();
  } else {
    pass(`expect to have ${heavyObject.id} in storage, but in fact there is ${this.storedValue}`);
  };
});