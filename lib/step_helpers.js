const { CucumberExpression, RegularExpression } = require('cucumber-expressions');
const supportCodeLibraryBuilder = require('cucumber/lib/support_code_library_builder').default;

const stepHelperRegistry = [];

class HelperError extends Error {
  constructor(...params) {
    super(...params);
    this.name = 'GherkinStepsHelperError';
  }
};

module.exports = {
  defineHelper(pattern, callback) {
    let Expression = typeof pattern === 'string' ? CucumberExpression : RegularExpression;
    let expression = new Expression(pattern, supportCodeLibraryBuilder.options.parameterTypeRegistry);

    let duplicates = stepHelperRegistry.filter(helper => helper.expression.regexp === expression.regexp);
    if(duplicates.length > 0) {
      throw new HelperError(`there already exists helper definition with regexp ${expression.regexp}`);
    }

    stepHelperRegistry.push({expression, callback});
  },

  async callHelper(text, world) {
    let results = stepHelperRegistry
      .map(helper => ({ helper, match: helper.expression.match(text) }))
      .filter(result => result.match);
    if(results.length === 0) {
      throw new HelperError(`no helper definition found for "${text}", possible patterns:\n${stepHelperRegistry.map(helper => helper.expression.regexp).join("\n")}`);
    }
    if(results.length > 1) {
      throw new HelperError(`several helper definitions match text "${text}", patterns are:\n${results.map(result => result.helper.expression.regexp).join("\n")}`);
    }

    let {helper: {callback}, match} = results[0];
    let arguments = await Promise.all(match.map(argument => argument.getValue(world)));

    return await callback.apply(world, arguments);
  },

  HelperError
};