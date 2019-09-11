const { defineParameterType } = require('cucumber'),
      { CucumberExpression } = require('cucumber-expressions'),
      parameterTypeRegistry = require('cucumber/lib/support_code_library_builder').default.options.parameterTypeRegistry,

      structuredTypes = ['jsonpath_array', 'jsonpath', 'json', 'string', 'number', 'array'], // `jsonpath_array` should be before `json` since `json` regexp overlaps `jsonpath_array` regexp

      structuredExpressions = structuredTypes.map(name => new CucumberExpression(`{${name}}`, parameterTypeRegistry));

defineParameterType({
  name: 'structured_type',
  regexp: /.+/,
  transformer: async function(string) {
    let match;
    structuredExpressions.find(expression => match = expression.match(string));

    if(match) {
      return await match[0].getValue(this);
    } else {
      throw new Error(`given object cannot be parsed as any of structured types:\n\n${string}\n\n`);
    }
  }
});