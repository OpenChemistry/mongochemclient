import React from 'react';

export function formatFormula(formula) {
  const segments = [{type: 'char', value: ''}];

  for (let c of formula) {
    const segment = segments[segments.length -1];
    let type = Number.isFinite(Number.parseInt(c)) ? 'digit' : 'char';
    if (type === segment.type) {
      segment.value += c;
    } else {
      segments.push({type, value: c});
    }
  }

  const formatted = (
    <span>
      {segments.map((seg, i) => seg.type === 'char' ? <span key={i}>{seg.value}</span> : <sub key={i}>{seg.value}</sub>)}
    </span>
  )
  return formatted;
}
