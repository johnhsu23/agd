import {range} from 'underscore';

import {Variable, SCHTYP1, SCHTYP2, SCHTYPE} from 'data/variables';
import {ContextualVariable} from 'data/contextual-variables';

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

export function combinedCategories(variable: Variable, contextualVariable: ContextualVariable): number[] {
  let categories: number[];
  if (variable.id === SCHTYP2.id) {
    // Use SCHTYP2 for Private (1) category
    categories = [1];
  } else {
    categories = [0, 2];
  }

  let contextualCategories: number[] = [];
  for (const category of categories) {
    const start = category * contextualVariable.categories.length;
    const end = start + contextualVariable.categories.length;
    // Not crazy about this, but it works.
    contextualCategories = contextualCategories.concat(range(start, end));
  }

  return contextualCategories;
}
