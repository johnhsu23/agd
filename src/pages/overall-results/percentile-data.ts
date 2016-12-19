import {extent, ascending} from 'd3-array';
import {nest} from 'd3-collection';
import * as Promise from 'bluebird';

import loadData from 'api';

import {Params, Data} from 'api/tuda-acrossyear';

import context from 'models/context';

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

export function group(rows: Data[]): Grouped {
  const grouped = nest<Data>()
    .key(d => d.stattype)
    .sortValues((a, b) => ascending(a.targetyear, b.targetyear))
    .object(rows) as Grouped;

  grouped.extent = extent(rows, row => row.targetvalue);

  return grouped;
}

export function load(): Promise<Data[]> {
  return loadData<Params, Data>({
    type: 'tuda-acrossyear',

    subject: context.subject,
    subscale: (context.subject === 'music') ? 'MUSRP' : 'VISRP',
    grade: 8,
    variable: 'TOTAL',
    categoryindex: 0,

    targetyears: ['2008R3', '2016R3'],
    focalyear: '2016R3',

    stattype: ['P1', 'P2', 'P3', 'P5', 'P7', 'P9'],
    jurisdiction: 'NT',
  });
}
