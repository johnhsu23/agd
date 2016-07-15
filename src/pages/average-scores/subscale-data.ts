import * as Promise from 'bluebird';

import Model from 'pages/average-scores/subscale-model';

import {Params, Data} from 'api/tuda-acrossyear';
import loadData from 'api';

export {
  Data,
};

const subscales = [
  'SRPS1',
  'SRPS2',
  'SRPS3',
];

export default function load(subject: string, grade: number, years: string[]): Promise<Model[]> {
  function paramsForSubscale(subscale: string): Params {
    return {
      type: 'tuda-acrossyear',
      subscale,

      subject,
      grade,

      variable: 'TOTAL',
      categoryindex: 0,

      targetyears: years,
      focalyear: '2015R3',

      stattype: 'MN',
      jurisdiction: 'NT',
    };
  }

  const requests = subscales
    .map(subscale => paramsForSubscale(subscale))
    .map<Promise<Data[]>>(loadData);

  return Promise.all(requests)
    .then<Data[]>(rows => [].concat.apply([], rows))
    .then(groupData);
}

function groupData(rows: Data[]): Model[] {
  const dict: {[year: number]: Model} = Object.create(null);

  for (const row of rows) {
    const year = row.targetyear;
    if (!dict[year]) {
      dict[year] = new Model({
        year,
        SRPS1: null,
        SRPS2: null,
        SRPS3: null,
        [row.subScale]: row,
      });
    } else {
      (dict[year] as {} as {[key: string]: Data})[row.subScale] = row;
    }
  }

  return Object.keys(dict)
    .map(Number)
    .map(year => dict[year]);
}
