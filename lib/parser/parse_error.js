class ParseError extends Error {
  constructor(...params) {
    super(...params);
    this.name = 'GherkinStepsParseError';
  }
};

module.exports = ParseError;