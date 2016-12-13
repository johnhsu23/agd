import * as Promise from 'bluebird';

import loadData from 'api';
import {ContextualVariable} from 'data/contextual-variables';
import {nest} from 'd3-collection';
import {ascending, descending} from 'd3-array';
import context from 'models/context';
import {range} from 'underscore';

import {Params, Data} from 'api/tuda-acrossyear';

export {Data};

export interface Result {
  key: string;
  values: Data[];
}

function makeParams(variable: ContextualVariable): Params {
  return {
    type: 'tuda-acrossyear',
    subject: context.subject,
    subscale: (context.subject === 'music') ? 'MUSRP' : 'VISRP',
    grade: 8,
    variable: variable.id,
    categoryindex: range(variable.categories.length),
    targetyears: ['2008R3', '2016R3'],
    focalyear: '2016R3',
    stattype: 'RP',
    jurisdiction: 'NT',
  };
}

function groupData(rows: Data[]): Result[] {
  return nest<Data>()
    .key(d => '' + d.targetyear)
    .sortValues((a, b) => ascending(a.categoryindex, b.categoryindex))
    .sortKeys(descending)
    .entries(rows);
}

export function load(variable: ContextualVariable): Promise<Result[]> {
  const params = makeParams(variable);

  return loadData<Params, Data>(params)
    .then(groupData);
}
