const explicitParamsRegexp = / \((?:(no) params|(1) param|([2-9]|\d{2,}) params)\)$/,
      implititRegexpParamsRegexp = /(?<!\\)\((?!\?:)/g,
      implititCucexpParamsRegexp = /(?<!\\){/g;

module.exports = stepName => {
  let pattern = stepName;
  let length, explicitParamsMatch, implicitParamsMatch;

  explicitParamsMatch = pattern.match(explicitParamsRegexp);
  if(explicitParamsMatch) {
    pattern = pattern.replace(explicitParamsRegexp, '');
    length = explicitParamsMatch[1] ? 0 : Number(explicitParamsMatch[2] || explicitParamsMatch[3]);
  };

  if(pattern.startsWith('/') && pattern.endsWith('/')) {
    if(!explicitParamsMatch) implicitParamsMatch = pattern.match(implititRegexpParamsRegexp);
    pattern = new RegExp(pattern.slice(1, pattern.length - 1));
  } else {
    if(!explicitParamsMatch) implicitParamsMatch = pattern.match(implititCucexpParamsRegexp);
  }

  if(length === undefined) length = implicitParamsMatch ? implicitParamsMatch.length : 0;

  return { pattern, length };
};