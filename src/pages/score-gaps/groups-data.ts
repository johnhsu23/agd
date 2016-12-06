import * as Promise from 'bluebird';
import {range} from 'd3-array';

import loadData from 'api';
import context from 'models/context';
import {Params, Data} from 'api/tuda-acrossyear';

import {Variable} from 'data/variables';

export {Data};

export function load(variable: Variable): Promise<Data[]> {
  const categories = variable.categories.length;

  return loadData<Params, Data>({
    type: 'tuda-acrossyear',

    subject: context.subject,
    subscale: context.subject === 'visual arts' ? 'VISRP' : 'MUSRP',
    grade: 8,

    variable: variable.id,
    categoryindex: range(categories),

    focalyear: '2016R3',
    targetyears: ['2008R3', '2016R3'],

    jurisdiction: 'NT',
    stattype: ['MN', 'RP'],
  });
}
