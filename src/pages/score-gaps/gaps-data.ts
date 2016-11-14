import * as Promise from 'bluebird';

import context from 'models/context';

import loadData from 'api';

import * as gap from 'api/tuda-gap';

export function load(subject: string, variable: string, focal: number, target: number): Promise<gap.Data[]> {
  if (focal > target) {
    [focal, target] = [target, focal];
  }

  return loadData<gap.Params, gap.Data>({
    type: 'tuda-gap',

    subject: context.subject,
    grade: 8,
    subscale: context.subject === 'visual arts' ? 'VISRP' : 'MUSRP',

    variable,
    categoryindex: focal,
    categoryindexb: target,

    jurisdiction: 'NT',
    stattype: 'MN',

    year: [2008, 2016],
  });
}

export default load;
