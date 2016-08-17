import * as Promise from 'bluebird';
import {ascending} from 'd3-array';

import {Params, Data} from 'api/tuda-acrossyear';
import loadData from 'api';

import {targetYearsForGrade} from 'data/assessment-years';

function makeParams(grade: number): Params {
  const years = targetYearsForGrade(grade);

  return {
    type: 'tuda-acrossyear',
    subscale: 'SRPUV',

    subject: 'science',
    grade,

    variable: 'TOTAL',
    categoryindex: 0,

    targetyears: years,
    focalyear: '2015R3',

    stattype: 'MN',
    jurisdiction: 'NT',
  };
}

export default function load(grade: number): Promise<Data[]> {
  return loadData<Params, Data>(makeParams(grade))
    .then(rows => rows.sort((a, b) => ascending(a.targetyear, b.targetyear)));
}
