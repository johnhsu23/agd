import * as Promise from 'bluebird';
import {indexBy} from 'underscore';
import {descending} from 'd3';

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

    stattype: ['AD', 'PR', 'BA', 'BB', 'AP', 'AB'],
    jurisdiction: 'NT',
  };
}

export function load(grade: number): Promise<Data[]> {
  return loadData<Params, Data>(makeParams(grade));
}

export function group(data: Data[]): Data[][] {
  const dict: { [key: number]: Data[] } = Object.create(null);

  for (const row of data) {
    const year = row.targetyear;
    if (!dict[year]) {
      dict[year] = [];
    }

    dict[year].push(row);
  }

  const out: Data[][] = [];

  for (const key of Object.keys(dict).sort(descending)) {
    const {BB, BA, PR, AD} = indexBy(dict[+key], d => d.stattype);

    out.push([BB, BA, PR, AD]);
  }

  return out;
}
