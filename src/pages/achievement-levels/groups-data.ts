import * as Promise from 'bluebird';
import {range} from 'd3';

import {Params, Data} from 'api/tuda-acrossyear';
import {Variable} from 'data/variables';
import {targetYearsForGrade} from 'data/assessment-years';

import loadData from 'api';

export {
  Data
}

function makeParams(grade: number, variable: Variable): Params {
  return {
    type: 'tuda-acrossyear',

    subject: 'science',
    grade,

    variable: variable.id,
    categoryindex: range(variable.categories.length),

    targetyears: targetYearsForGrade(grade),
    focalyear: '2015R3',

    stattype: ['AD', 'PR', 'BA', 'BB', 'AP', 'AB'],
    jurisdiction: 'NT',
  };
}

export function load(grade: number, variable: Variable): Promise<Data[]> {
  return loadData<Params, Data>(makeParams(grade, variable));
}
