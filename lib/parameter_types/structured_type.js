const { defineParameterType } = require('cucumber'),
      { CucumberExpression } = require('cucumber-expressions'),
      parameterTypeRegistry = require('cucumber/lib/support_code_library_builder').default.options.parameterTypeRegistry,

      structuredTypes = ['jsonpath_array', 'jsonpath', 'json', 'string', 'number', 'array'], // `jsonpath_array` should be before `json` since `json` regexp overlaps `jsonpath_array` regexp

      structuredExpressions = structuredTypes.map(name => new CucumberExpression(`{${name}}`, parameterTypeRegistry));

defineParameterType({
  name: 'structured_type',
  regexp: /[🐛]{0}.+/, // sorry for the bug, but it is a way to avoid catching this regexp in Cucumber Regular Expressions; I'll make PR to Cucumber JS with special option for this case in a free time
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