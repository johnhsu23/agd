import * as Bluebird from 'bluebird';
import {range} from 'underscore';
import loadData from 'api';
import {nest} from 'd3-collection';
import {ascending} from 'd3-array';

import context from 'models/context';
import {Params, Data} from 'api/tuda-data';
import {Variable, SCHTYPE, SCHTYP2} from 'data/variables';
import {ContextualVariable} from 'data/contextual-variables';
import * as schtype from 'util/schtype';

export {Data};

export interface Result {
  key: string;
  values: Data[];
}

function loadOne(variable: Variable, contextualVariable: ContextualVariable, categories: number[]): Bluebird<Result[]> {
  return loadData<Params, Data>({
    type: 'tuda-data',

    subject: context.subject,
    subscale: context.subject === 'visual arts' ? 'VISRP' : 'MUSRP',
    grade: 8,

    variable: `${variable.id}+${contextualVariable.id}`,
    categoryindex: categories,

    year: '2016',

    jurisdiction: 'NT',
    stattype: 'RP',
  })
  .then(rows => groupData(rows, variable, contextualVariable));
}

function groupData(rows: Data[], variable: Variable, contextualVariable: ContextualVariable): Result[] {
  return nest<Data>()
    .key(d => '' + variable.categories[Math.floor(d.categoryindex / contextualVariable.categories.length)])
    .sortValues((a, b) => ascending(a.categoryindex, b.categoryindex))
    .entries(rows);
}

export async function load(variable: Variable, contextualVariable: ContextualVariable): Bluebird<Result[]> {
  // If we've requested variables that need combination, handle that here
  if (schtype.shouldCombine(variable)) {
    const schtypeData = loadOne(SCHTYPE, contextualVariable,
        schtype.combinedCategories(SCHTYPE, contextualVariable)),
          schtyp2Data = loadOne(SCHTYP2, contextualVariable,
            schtype.combinedCategories(SCHTYP2, contextualVariable));

    return [
      ...await schtypeData,
      ...await schtyp2Data,
    ];
  }

  const categories = range(variable.categories.length * contextualVariable.categories.length);
  return loadOne(variable, contextualVariable, categories);
}
