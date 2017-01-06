import * as Promise from 'bluebird';

import loadData from 'api';
import {Variable, SCHTYPE, SCHTYP2} from 'data/variables';
import {ContextualVariable} from 'data/contextual-variables';
import {nest} from 'd3-collection';
import {ascending} from 'd3-array';
import context from 'models/context';
import {range} from 'underscore';
import {Params, Data} from 'api/tuda-data';
import * as schtype from 'util/schtype';

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
    variable: variable.id + '+' + contextualVariable.id,
    categoryindex: range(variable.categories.length * contextualVariable.categories.length),
    year: '2016',
    stattype: 'RP',
    jurisdiction: 'NT',
  };
}

function groupData(rows: Data[], variable: Variable, contextualVariable: ContextualVariable): Result[] {
  return nest<Data>()
    .key(d => '' + variable.categories[Math.floor(d.categoryindex / contextualVariable.categories.length)])
    .sortValues((a, b) => ascending(a.categoryindex, b.categoryindex))
    .entries(rows);
}

export function load(variable: Variable, contextualVariable: ContextualVariable): Promise<Result[]> {
  const params = makeParams(variable, contextualVariable);

 function combineSchTypes(): any[] {
    const schtypeD = makeParams(SCHTYPE, contextualVariable),
          schtyp2D = makeParams(SCHTYP2, contextualVariable);

    if (schtype.shouldCombine(variable)) {
      const schtypeData = loadData<Params, Data>(schtypeD),
            schtyp2Data = loadData<Params, Data>(schtyp2D);

      return [
        schtypeData,
        schtyp2Data,
      ];
    }
  }

  combineSchTypes();

  return loadData<Params, Data>(params)
    .then(data => groupData(data, variable, contextualVariable));
}
