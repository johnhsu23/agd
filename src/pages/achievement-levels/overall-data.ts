import * as Promise from 'bluebird';

import loadData from 'api';
import {Params, Data} from 'api/tuda-acrossyear';
import {targetYearsForGrade} from 'data/assessment-years';

export {Data};

function makeParams(grade: number): Params {
  return {
    type: 'tuda-acrossyear',

    subject: 'science',
    grade,

    variable: 'TOTAL',
    categoryindex: 0,

    targetyears: targetYearsForGrade(grade),
    focalyear: '2015R3',

    stattype: ['AD', 'PR', 'BA', 'BB', 'AP', 'AB', 'MN'],
    jurisdiction: 'NT',
  };
}

export function load(grade: number): Promise<Data[]> {
  return loadData<Params, Data>(makeParams(grade));
}
