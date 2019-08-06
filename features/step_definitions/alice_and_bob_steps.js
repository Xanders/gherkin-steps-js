// This is example from README.md
// I just want to be sure my example works properly

const { Given, When, Then } = require('cucumber');

When('I send request {word} {}', function(verb, url) {
  // Request logic should be here, for example:
  //   this.currect_page = engine.send(verb, url);
  this.current_url = url;
});

When('(I )click on {string} button', function(label) {
  // Click logic should be here, for example:
  //   engine.find('button', label).click();
});

When('(I )enter {string} into {element}', function(value, element) {
  // Value enter logic should be here, for example:
  //    element.setValue(value);
});