// This is example from README.md
// I just want to be sure my example works properly

const { defineParameterType } = require('cucumber');

defineParameterType({
  name: 'element',
  regexp: /input\[name="\w+"\]/, // for example: engine.PATH_REGEXP
  transformer: path => path // for example: path => engine.find(path)
});