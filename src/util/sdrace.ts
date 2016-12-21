import {range} from 'd3-array';

import {Variable, SDRACE, SRACE10} from 'data/variables';

/**
 * A fake variable representing the combination of SDRACE and SRACE10.
 */
export const combined: Variable = {
  id: '',
  name: 'Race/ethnicity',
  title: 'race/ethnicity',
  categories: [
    'White',
    'Black',
    'Hispanic',
    'Asian/Pacific Islander',
    'Asian',
    'Native Hawaiian/Other Pacific Islander',
    'American Indian/Alaska Native',
    'Two or More Races',
  ],
};

/**
 * Is this variable one of the two race/ethnicity variables that we need to combine?
 */
export function shouldCombine(variable: Variable): boolean {
  return variable.id === SDRACE.id
      || variable.id === SRACE10.id;
}

/**
 * Returns the category indices for the variable for the NDE API. If the variable is SRACE10, only those rows that are
 * not part of SDRACE are requested.
 */
export function categories(variable: Variable): number[] {
  if (variable.id === SRACE10.id) {
    return [3, 5];
  }

  return range(variable.categories.length);
}

export type BaseData = {
  variable: string;
  categoryindex: number;
};

function sdraceAdjust<Data extends BaseData>(row: Data): Data {
  switch (row.categoryindex) {
    case 4:
    case 5:
      row.categoryindex += 2;
  }

  return row;
}

function srace10Adjust<Data extends BaseData>(row: Data): Data {
  switch (row.categoryindex) {
    case 3:
      row.categoryindex = 4;
      break;

    case 5:
      break;

    default:
      throw new Error(`Failed to adjust category ${row.categoryindex}`);
  }

  return row;
}

/**
 * Given a typical row from the NDE API, re-number the categories of SDRACE and SRACE10 variables to match the fake
 * combined variable.
 */
export function adjust<Data extends BaseData>(row: Data): Data {
  switch (row.variable) {
    case SDRACE.id:
      return sdraceAdjust(row);

    case SRACE10.id:
      return srace10Adjust(row);

    default:
      return row;
  }
}
