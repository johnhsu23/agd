import * as Promise from 'bluebird';

import loadData from 'api';
import {ContextualVariable} from 'data/contextual-variables';
import {nest} from 'd3-collection';
import {ascending} from 'd3-array';
import context from 'models/context';
import {range} from 'underscore';

import {Params, Data} from 'api/tuda-acrossyear';

export {Data};

export interface StackedDatum {
  [k: string]: number;
}

export interface Grouped {
  yearData: { [year: string]: Data[]; };
  stackData: StackedDatum[];
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

function groupData(rows: Data[]): Grouped {
  const yearData = nest<Data>()
    .key(d => '' + d.targetyear)
    .sortValues((a, b) => ascending(a.categoryindex, b.categoryindex))
    .object(rows);

  const stackData: StackedDatum[] = [];

  Object.keys(yearData).forEach(year => {
    const yearDataObject: StackedDatum = {
      year: +year,
    };

    yearData[year].forEach((datum: Data) => {
      yearDataObject[datum.category] = datum.targetvalue;
    });

    stackData.push(yearDataObject);
  });

  return {
    yearData: yearData,
    stackData: stackData,
  };
}

export function load(variable: ContextualVariable): Promise<Grouped> {
  const params = makeParams(variable);

  return loadData<Params, Data>(params)
    .then(groupData);
}
