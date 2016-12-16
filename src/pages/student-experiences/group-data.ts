import * as Promise from 'bluebird';

import loadData from 'api';
import {Variable} from 'data/variables';
import {ContextualVariable} from 'data/contextual-variables';
import {nest} from 'd3-collection';
import {ascending} from 'd3-array';
import context from 'models/context';
import {range} from 'underscore';

import {Params, Data} from 'api/tuda-data';

export {Data};

export interface Result {
  key: string;
  values: Data[];
}

function makeParams(variable: Variable, contextualVariable: ContextualVariable): Params {
  return {
    type: 'tuda-data',
    subject: context.subject,
    subscale: (context.subject === 'music') ? 'MUSRP' : 'VISRP',
    grade: 8,
    variable: contextualVariable.id + '+' + variable.id,
    categoryindex: range(variable.categories.length * contextualVariable.categories.length),
    year: '2016',
    stattype: 'RP',
    jurisdiction: 'NT',
  };
}

function groupData(rows: Data[], variable: Variable): Result[] {
  return nest<Data>()
    .key(d => '' + variable.categories[d.categoryindex % variable.categories.length])
    .sortValues((a, b) => ascending(a.categoryindex, b.categoryindex))
    .entries(rows);
}

export function load(variable: Variable, contextualVariable: ContextualVariable): Promise<Result[]> {
  const params = makeParams(variable, contextualVariable);

  return loadData<Params, Data>(params)
    .then(data => groupData(data, variable));
}
