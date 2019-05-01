import { has } from 'lodash-es';
import { toUpperCase, capitalizeFirst } from './strings';

export const KNOWN_IMAGES = {
  'openchemistry/psi4': {
    display: 'Psi4'
  },
  'openchemistry/nwchem': {
    display: 'NWChem'
  },
  'openchemistry/chemml': {
    display: 'ChemML'
  },
  'openchemistry/torchani': {
    display: 'TorchANI'
  }
}

export const KNOWN_BASIS = {

}

export const KNOWN_THEORIES = {
  'dft': {
    display: 'DFT'
  },
  'hf': {
    display: 'HF'
  }
}

export const KNOWN_FUNCTIONALS = {

}

export const getCalculationProperties = (calculation) => {
  const properties = [];
  if (has(calculation, 'image.repository')) {
    properties.push({label: 'Code', value: formatCode(calculation.image.repository)});
  }
  if (has(calculation, 'input.parameters.task')) {
    properties.push({label: 'Type', value: formatTask(calculation.input.parameters.task)});
  }
  if (has(calculation, 'input.parameters.theory')) {
    properties.push({label: 'Theory', value: formatTheory(calculation.input.parameters.theory, calculation.input.parameters.functional)});
  }
  if (has(calculation, 'input.parameters.basis')) {
    properties.push({label: 'Basis', value: formatBasis(calculation.input.parameters.basis)});
  }
  return properties;
}

export const formatFunctional = (functional) => {
  return knownOrUpperCase(functional, KNOWN_FUNCTIONALS);
}

export const formatTheory = (theory, functional) => {
  theory = knownOrUpperCase(theory, KNOWN_IMAGES);
  if (theory === KNOWN_THEORIES['dft'].display && functional) {
    return `${theory} (${formatFunctional(functional)})`
  } else {
    return theory;
  }
}

export const formatBasis = (basis) => {
  return knownOrUpperCase(basis, KNOWN_BASIS);
}

export const formatCode = (image) => {
  return knownOr(image, KNOWN_IMAGES);
}

export const formatTask = (task) => {
  return knownOrCapitalizeFirst(task, KNOWN_IMAGES);
}

function identity(value) {
  return value;
}

function knownOr(value, known_values, transform = identity) {
  if (typeof value !== 'string') {
    value = '';
  }
  value = value.toLowerCase();
  if (value in known_values) {
    value = known_values[value].display;
  } else {
    value = transform(value);
  }
  return value;
}

function knownOrUpperCase(value, known_values) {
  return knownOr(value, known_values, toUpperCase);
}

function knownOrCapitalizeFirst(value, known_values) {
  return knownOr(value, known_values, capitalizeFirst);
}
