import {Variable, SCHTYP1, SCHTYP2, SCHTYPE} from 'data/variables';

export function shouldCombine(variable: Variable): boolean {
  return variable.id === SCHTYP1.id
      || variable.id === SCHTYP2.id
      || variable.id === SCHTYPE.id;
}

export function categories(variable: Variable): number[] {
  if (variable.id === SCHTYP2.id) {
    // Use SCHTYP2 for Private (1) category
    return [1];
  } else {
    return [0, 2];
  }
}
