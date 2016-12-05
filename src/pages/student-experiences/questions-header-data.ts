import * as Promise from 'bluebird';

import loadData from 'api';
import {ContextualVariable} from 'data/contextual-variables';

import {Params, Data} from 'api/tuda-acrossyear';

export {Data};

function makeParams(subject: string, variable: ContextualVariable, categoryindex: number): Params {
  return {
    type: 'tuda-acrossyear',
    subject,
    subscale: (subject === 'music') ? 'MUSRP' : 'VISRP',
    grade: 8,
    variable: variable.id,
    categoryindex: categoryindex,
    targetyears: ['2016R3'],
    focalyear: '2016R3',
    stattype: 'RP',
    jurisdiction: 'NT',
  };
}

export function load(subject: string, variable: ContextualVariable, categoryindex: number): Promise<Data[]> {
  const params = makeParams(subject, variable, categoryindex);

  return loadData<Params, Data>(params);
}
