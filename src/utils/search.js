// It is important to put two character operators first
const operatorDict = {
  '!=': '~ne~',
  '>=': '~gte~',
  '<=': '~lte~',
  '>': '~gt~',
  '<': '~lt~',
  '==': '~eq~',
  ' and ': '~and~',
  ' or ': '~or~'
}

export function advancedSearchToMolQuery(search) {
  if (search === undefined)
    return search;

  let s = search;
  for (const key in operatorDict) {
    // Replace all case-insensitive
    const regExp = new RegExp(key, 'gi');
    s = s.replace(regExp, operatorDict[key]);
  }

  // Remove all spaces
  s = s.replace(/\s+/g, '');
  return s;
}
