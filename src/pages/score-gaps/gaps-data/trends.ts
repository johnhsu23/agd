import * as Promise from 'bluebird';

import context from 'models/context';
import loadData from 'api';

import {Params, Data} from 'api/tuda-acrossyear';
export {Data};

export function load(variable: string, focal: number, target: number): Promise<Data[]> {
  return loadData<Params, Data>({
    type: 'tuda-acrossyear',

    subject: context.subject,
    subscale: context.subject === 'visual arts' ? 'VISRP' : 'MUSRP',
    grade: 8,

    focalyear: '2016R3',
    targetyears: ['2008R3', '2016R3'],

    variable,
    categoryindex: [focal, target],

    jurisdiction: 'NT',
    stattype: 'MN',
  });
}
