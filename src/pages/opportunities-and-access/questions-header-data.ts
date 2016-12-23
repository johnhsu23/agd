import * as Promise from 'bluebird';

import loadData from 'api';
import {ContextualVariable} from 'data/contextual-variables';
import context from 'models/context';

import {Params, Data} from 'api/tuda-acrossyear';

export {Data};

function makeParams(variable: ContextualVariable): Params {
  return {
    type: 'tuda-acrossyear',
    subject: context.subject,
    subscale: (context.subject === 'music') ? 'MUSRP' : 'VISRP',
    grade: 8,
    variable: variable.id,
    categoryindex: variable.selected,
    targetyears: ['2016R3'],
    focalyear: '2016R3',
    stattype: 'RP',
    jurisdiction: 'NT',
  };
}

export function load(variable: ContextualVariable): Promise<Data[]> {
  const params = makeParams(variable);

  return loadData<Params, Data>(params);
}
