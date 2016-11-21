import * as Promise from 'bluebird';
import {descending} from 'd3-array';
import {nest} from 'd3-collection';

import loadData from 'api';

import {Params, Data} from 'api/tuda-acrossyear';

// re-export Data type from API module
export {Data};

export interface Grouped {
  0: Data;
  1: Data;
}

function makeParams(subject: string, years: string[]): Params {
  return {
    type: 'tuda-acrossyear',

    subject,
    grade: 8,
    subscale: (subject === 'music') ? 'MUSRP' : 'VISRP',
    variable: 'TOTAL',
    categoryindex: 0,

    targetyears: years,
    focalyear: '2016R3',

    stattype: 'RP',
    jurisdiction: 'NT',
  };
}

function sortData(rows: Data[]): Data[] {
  nest<Data>()
    .sortValues((a, b) => descending(a.targetyear, b.targetyear))
    .map(rows);

  return rows;
}

export function load(subject: string, years: string[]): Promise<Data[]> {
  const params = makeParams(subject, years);

  return loadData<Params, Data>(params)
    .then(sortData);
}
