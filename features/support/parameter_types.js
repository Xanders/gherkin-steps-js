const { defineParameterType } = require('cucumber');

defineParameterType({
  name: 'heavy_object',
  regexp: /heavy object (\d+)/,
  transformer: id => ({ id: Number(id), toCucumberString: () => `heavy object ${id}` })
});