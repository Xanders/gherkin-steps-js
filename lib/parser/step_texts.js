const { callHelper, HelperError } = require('../step_helpers');

const stepHelperRegexp = /(?<!\\+)~(.+?)(?<!\\)~/g;
const escapedTildeRegexp = /\\~/g;
const paramWithIndexRegexp = /^param (\d+)$/;

const toCucumberStringOrToString = async object =>
  await typeof object.toCucumberString === 'function'
    ? object.toCucumberString()
    : object.toString();

module.exports = async (stepText, params, world) => {
  let length = params.length - 1;

  let promises = [];

  stepText.replace(stepHelperRegexp, (_, unescapedHelperText) => {
    let helperText = unescapedHelperText.replace(escapedTildeRegexp, '~');

    if(helperText === 'param') {
      switch(length) {
        case 0: throw new HelperError('there is no arguments in the step, but ~param~ helper used');
        case 1: return promises.push(toCucumberStringOrToString(params[0]));
        default: throw new HelperError('there is several arguments in the step, but ~param~ helper used, please use ~param 1~ instead');
      };
    };

    let match = helperText.match(paramWithIndexRegexp);
    if(match) {
      let index = Number(match[1]) - 1;
      switch(length) {
        case 0: throw new HelperError(`there is no arguments in the step, but ~${helperText}~ helper used`);
        case 1: throw new HelperError(`there is one argument in the step, but ~${helperText}~ helper used${index === 0 ? ', please use ~param~ instead' : ''}`);
        default: return promises.push(toCucumberStringOrToString(params[index]));
      };
    };

    promises.push(callHelper(helperText, world));
  });

  let results = await Promise.all(promises);

  return stepText.replace(stepHelperRegexp, () => results.shift()).replace(escapedTildeRegexp, '~');
};