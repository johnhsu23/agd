import {extent, ascending} from 'd3-array';
import {nest} from 'd3-collection';
import * as Promise from 'bluebird';

import loadData from 'api';

import {Params, Data} from 'api/tuda-acrossyear';

// re-export Data type from API module
export {Data};

export interface Grouped {
  P1: Data[];
  P2: Data[];
  P5: Data[];
  P7: Data[];
  P9: Data[];

  extent: [number, number];
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

    stattype: ['P1', 'P2', 'P3', 'P5', 'P7', 'P9'],
    jurisdiction: 'NT',
  };
}

function groupData(rows: Data[]): Grouped {
  const grouped = nest<Data>()
    .key(d => d.stattype)
    .sortValues((a, b) => ascending(a.targetyear, b.targetyear))
    .object(rows) as Grouped;

  grouped.extent = extent(rows, row => row.targetvalue);

  return grouped;
}

export function load(subject: string, years: string[]): Promise<Grouped> {
  const params = makeParams(subject, years);

  return loadData<Params, Data>(params)
    .then(groupData);
}
