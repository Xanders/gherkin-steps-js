const { Given, When, Then } = require('cucumber');

const { parse } = require('../../lib');

Given('incorrect step definition:', function(definition) {
  try {
    parse(definition);
  } catch(error) {
    this.lastError = error;
  };
});

Then('error named {word} should be throwed', function(errorName, pass) {
  if(this.lastError) {
    if(this.lastError.name === errorName) {
      pass();
    } else {
      pass(`expect ${errorName} to be throwed, but in fact there was ${this.lastError.name}`);
    };
  } else {
    pass(`expect ${errorName} to be throwed, but there was no error at all`);
  };
});