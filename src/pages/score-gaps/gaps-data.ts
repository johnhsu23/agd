import * as Promise from 'bluebird';

import loadData from 'api';

import * as gap from 'api/tuda-gap';

export function load(subject: string, variable: string, focal: number, target: number): Promise<gap.Data[]> {
  if (focal > target) {
    [focal, target] = [target, focal];
  }

  return loadData<gap.Params, gap.Data>({
    type: 'tuda-gap',

    subject,
    grade: 8,
    subscale: 'SRPUV',

    variable,
    categoryindex: focal,
    categoryindexb: target,

    jurisdiction: 'NT',
    stattype: 'MN',

    year: [2009, 2015],
  });
}

export default load;
