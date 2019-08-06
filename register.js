const fs = require('fs');
const { parse } = require('./lib');

class LoadError extends Error {
  constructor(...params) {
    super(...params);
    this.name = 'GherkinStepsLoadError';
  }
};

require.extensions['.steps'] = function(_, filename) {
  let fileContent = fs.readFileSync(filename, 'utf8');

  try {
    parse(fileContent, filename);
  } catch(error) {
    throw new LoadError(`${error.name} in '${filename}': ${error.message}`);
  }
};