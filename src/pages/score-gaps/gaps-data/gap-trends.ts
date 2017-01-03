import * as Promise from 'bluebird';

import loadData from 'api';
import {Params, Data} from 'api/tuda-gaponvar-acrossyear';

import context from 'models/context';

export {Data};

export default load;
export function load(variable: string, focal: number, target: number): Promise<Data> {
  // use SCHTYP2 if Private is a category
  if (variable === 'SCHTYPE' && (focal === 1 || target === 1)) {
    variable = 'SCHTYP2';
  }
  return loadData<Params, Data>({
    type: 'tuda-gaponvar-acrossyear',

    subject: context.subject,
    subscale: context.subject === 'visual arts' ? 'VISRP' : 'MUSRP',
    grade: 8,

    variable,
    categoryindex: Math.min(focal, target),
    categoryindexb: Math.max(focal, target),

    focalyear: '2016R3',
    targetyears: ['2008R3'],

    jurisdiction: 'NT',
    stattype: 'MN',
  })
  .then(rows => rows[0]);
}
