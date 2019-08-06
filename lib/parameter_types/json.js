const { defineParameterType } = require('cucumber'),
      jsonpath = require('jsonpath');

defineParameterType({
  name: 'json',
  regexp: /\[.*\]|\{.*\}/,
  transformer: json => JSON.parse(json)
});

defineParameterType({
  name: 'jsonpath',
  regexp: /\$[\.\[].+/,
  transformer: function(query) { return jsonpath.value(this, query); }
});

defineParameterType({
  name: 'jsonpath_array',
  regexp: /\[(\$[\.\[].+)\]/,
  transformer: function(query) { return jsonpath.query(this, query); }
});