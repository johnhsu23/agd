import * as Promise from 'bluebird';
import {ascending, range} from 'd3-array';

import loadData from 'api';
import {Params, Data} from 'api/tuda-acrossyear';
import {Params as GapParams, Data as GapData} from 'api/tuda-gap';

import context from 'models/context';
import {Variable} from 'data/variables';

export {Data, GapData};
export interface Grouped {
  mean: Data;
  percent: Data;
}

function compare(a: Data, b: typeof a): number {
  return ascending(a.categoryindex, b.categoryindex)
      || ascending(a.stattype, b.stattype);
}

function group(data: Data[]): Grouped[] {
  const results: Grouped[] = [],
        length = data.length;

  results.length = data.length / 2;

  for (let i = 0; i < length; i += 2) {
    results[i / 2] = {
      mean: data[i],
      percent: data[i + 1],
    };
  }

  return results;
}

export function load(variable: Variable): Promise<Grouped[]> {
  const {id, categories} = variable;

  return loadData<Params, Data>({
    type: 'tuda-acrossyear',

    focalyear: '2016R3',
    targetyears: ['2016R3'],

    grade: 8,
    subject: context.subject,
    subscale: context.subject === 'visual arts' ? 'VISRP' : 'MUSRP',

    variable: id,
    categoryindex: range(categories.length),

    jurisdiction: 'NT',
    stattype: ['MN', 'RP'],
  })
  .then(rows => rows.sort(compare))
  .then(group);
}

export function loadGaps(variable: Variable, focalCategory: number): Promise<GapData[]> {
  const {id, categories} = variable;

  return loadData<GapParams, GapData>({
    type: 'tuda-gap',

    subscale: context.subject === 'visual arts' ? 'VISRP' : 'MUSRP',
    subject: context.subject,
    grade: 8,

    variable: id,
    categoryindex: focalCategory,
    categoryindexb: range(categories.length),

    stattype: 'MN',

    jurisdiction: 'NT',
    year: [2016],
  });
}
