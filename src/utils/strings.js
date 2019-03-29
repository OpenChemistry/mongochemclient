export function isUpperCase(c) {
  return c === c.toUpperCase();
}

export function isLowerCase(c) {
  return c === c.toLowerCase();
}

export function capitalizeFirst(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function toUpperCase(s) {
  return String.prototype.toUpperCase.call(s);
}

export function toLowerCase(s) {
  return String.prototype.toLowerCase.call(s);
}

export function camelToSpace(s) {
  if (s.length < 2) {
    return s;
  }

  let wordsIdx = [0];

  for (let i = 1; i < s.length - 1; ++i) {
    if (isUpperCase(s.charAt(i)) && (isLowerCase(s.charAt(i - 1)) || isLowerCase(s.charAt(i + 1)))) {
      wordsIdx.push(i);
    }
  }

  let words = [];
  for (let i = 0; i < wordsIdx.length - 1; ++i) {
    words.push(s.slice(wordsIdx[i], wordsIdx[i + 1]));
  }
  words.push(s.slice(wordsIdx[wordsIdx.length - 1]));

  words = words.map(w => capitalizeFirst(w));

  return words.join(' ');
}
