import * as Promise from 'bluebird';

import context from 'models/context';
import loadData from 'api';

import {Params, Data} from 'api/tuda-acrossyear';
export {Data};

export function load(variable: string, focal: number, target: number): Promise<Data[]> {
  // use SCHTYP2 if Private is a category
  if (variable === 'SCHTYPE' && (focal === 1 || target === 1)) {
    variable = 'SCHTYP2';
  }
  return loadData<Params, Data>({
    type: 'tuda-acrossyear',

    subject: context.subject,
    subscale: context.subject === 'visual arts' ? 'VISRP' : 'MUSRP',
    grade: 8,

    // Since there are only two assessment years, we can load just the 2008R3 record and use it.
    // This isn't always ideal, but since we're only using this data point for its significance test, this simplifies
    // a few things.
    focalyear: '2016R3',
    targetyears: ['2008R3'],

    variable,
    categoryindex: [focal, target],

    jurisdiction: 'NT',
    stattype: 'MN',
  });
}
