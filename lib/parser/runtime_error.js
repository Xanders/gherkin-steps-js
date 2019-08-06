class RuntimeError extends Error {
  constructor({ status, exception, step, parsedStepText, scenario, filename }) {
    let messageTitle = exception ? exception.name : `${status} step`;
    let messageLocation = `${filename}:${step.location.line}:${step.location.column}`;
    let messageException = exception ? `: ${exception.message}` : '';
    let messageDetails = `step: "${step.keyword + step.text}", parsed as: "${step.keyword + parsedStepText}", scenario: "${scenario.name}"`;
    let message = `${messageTitle} in '${messageLocation}'${messageException} (${messageDetails})`;
    super(message);

    this.name = 'GherkinStepsRuntimeError';
    this.status = status;
    this.exception = exception;
    this.step = step;
    this.parsedStepText = parsedStepText;
    this.scenario = scenario;
    this.filename = filename;
  }
};

module.exports = RuntimeError;