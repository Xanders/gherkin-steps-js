const { Parser } = require('gherkin');
const { defineStep } = require('cucumber');

const runner = require('./test_case_runner_patch');

const ParseError = require('./parser/parse_error');
const RuntimeError = require('./parser/runtime_error');

const parseStepText = require('./parser/step_texts');
const parseStepName = require('./parser/step_names');

module.exports = {
  parse: function(gherkinSyntax, filename = null) {
    let gherkinDocument = new Parser().parse(gherkinSyntax);

    if(gherkinDocument.feature === undefined) {
      throw new ParseError('no Feature keyword found');
    };

    let definitions = gherkinDocument.feature.children;

    if(definitions.length === 0) {
      throw new ParseError('no definitions under Feature found');
    };

    for(let scenario of definitions) {
      if(scenario.type !== 'Scenario') {
        throw new ParseError(`definition with type ${scenario.type} found, only Scenario allowed`);
      }

      let parts = scenario.name.split(' ');
      let keyword = parts.shift();
      let stepName = parts.join(' ');

      if(keyword !== 'Given' && keyword !== 'When' && keyword !== 'Then') {
        throw new ParseError(`scenario at line ${scenario.location.line} starts with "${keyword}", but should start with "Given", "When" or "Then"`);
      }

      let callback = async function(...params) {
        for(let step of scenario.steps) {
          let parsedStepText = await parseStepText(step.text, params, this);

          let { status, exception } = await runner.runStep({
            text: parsedStepText,
            arguments: step.argument === undefined ? [] : [step.argument],
            locations: [step.location]
          });

          if(status === 'ambiguous') exception = { name: `${status} step`, message: `\n\n${exception}\n\n` };

          if(status !== 'passed') throw new RuntimeError({ status, exception, step, parsedStepText, scenario, filename });
        };
      };

      let { pattern, length } = parseStepName(stepName);

      callback.__defineGetter__('length', () => length)

      defineStep(pattern, callback);
    };
  },

  ParseError,
  RuntimeError
};