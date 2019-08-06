const { defineParameterType } = require('cucumber'),
      number = require('./number');

defineParameterType({
  name: 'array',
  regexp: /[^,]+(?: and [^,]+|(?:, [^,]+)+(?:,? and [^,]+)?)/,
  transformer: string =>
    string
      .split(/,? and |, /)
      .map(element =>
        element.match(number.regexp) ? number.transformer(element) : element
      )
});