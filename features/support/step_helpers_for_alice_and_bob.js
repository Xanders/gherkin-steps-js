// This is example from README.md
// I just want to be sure my example works properly

const { defineHelper, callHelper } = require('../../lib');

defineHelper('value from {element}', async function(element) {
  // Get value logic should be here, for example:
  //   return element.value();
  return await callHelper('last phone number', this);
});

// Helper below will be defined automaticly when `Sequences` will be introduced
defineHelper('next/last phone number', () => '+1-234-567-89-01');