const { defineParameterType } = require('cucumber'),

      map = {
        no: 0,
        zero: 0,
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10
      },

      keys = Object.keys(map).concat(
        Object.keys(map).map(key => key.replace(/^./, (letter) => letter.toUpperCase()))
      ),

      regexp = new RegExp(`-?\\d+|-?\\d*\\.\\d+|${keys.join('|')}`),

      transformer = (string) =>
        map.hasOwnProperty(string.toLowerCase()) ? map[string.toLowerCase()] : Number(string);

defineParameterType({
  name: 'number',
  regexp,
  transformer
});

module.exports = { regexp, transformer };