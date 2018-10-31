import React from 'react';

export function formatFormula(formula) {
  let i = 0;
  const segments = [{type: 'char', value: ''}];

  while (i < formula.length) {
    const segment = segments[segments.length -1];
    let c = formula[i];
    let type = Number.isFinite(Number.parseInt(c)) ? 'digit' : 'char';
    if (type === segment.type) {
      segment.value += c;
    } else {
      segments.push({type, value: c});
    }
    i += 1;
  }
  const formatted = (
    <span>
      {segments.map((seg, i) => seg.type === 'char' ? <span key={i}>{seg.value}</span> : <sub key={i}>{seg.value}</sub>)}
    </span>
  )
  return formatted;
}
