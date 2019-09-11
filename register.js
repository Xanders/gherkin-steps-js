const fs = require('fs');
const { parse } = require('./lib/parser');

class LoadError extends Error {
  constructor(message, { cause }) {
    super(message);
    this.name = 'GherkinStepsLoadError';
    if(cause) {
      if(this.message) this.message += ', see cause below';
      this.stack += `\nCaused by: ${cause.stack}`;
    }
  }
};

require.extensions['.steps'] = function(_, filename) {
  let fileContent = fs.readFileSync(filename, 'utf8');

  try {
    parse(fileContent, filename);
  } catch(error) {
    throw new LoadError(`error loading file '${filename}'`, { cause: error });
  }
};