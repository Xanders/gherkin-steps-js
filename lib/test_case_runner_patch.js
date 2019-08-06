const testCaseRunner = require('cucumber/lib/runtime/test_case_runner');

class PatchedTestCaseRunner extends testCaseRunner.default {
  constructor(...params) {
    super(...params);
    exports.runStep = this.runStep.bind(this);
  };
};

testCaseRunner.default = PatchedTestCaseRunner;