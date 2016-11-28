import * as Promise from 'bluebird';
import {descending} from 'd3-array';

import loadData from 'api';

import {Params, Data} from 'api/tuda-acrossyear';

// re-export Data type from API module
export {Data};

function makeParams(): Params {
  return {
    type: 'tuda-acrossyear',

    subject: 'visual arts',
    grade: 8,
    subscale: 'VISRP',
    variable: 'TOTAL',
    categoryindex: 0,

    targetyears: ['2008R3', '2016R3'],
    focalyear: '2016R3',

    stattype: 'RP',
    jurisdiction: 'NT',
  };
}

export function load(): Promise<Data[]> {
  const params = makeParams();

  return loadData<Params, Data>(params)
    .then(rows => rows.sort((a, b) => descending(a.targetyear, b.targetyear)));
}
