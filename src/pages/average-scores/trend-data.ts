import * as Promise from 'bluebird';

import {Params, Data} from 'api/tuda-acrossyear';
import loadData from 'api';

function makeParams(subject: string, grade: number, years: string[]): Params {
  return {
    type: 'tuda-acrossyear',
    subscale: 'SRPUV',

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

export default function load(subject: string, grade: number, years: string[]): Promise<Data[]> {
  return loadData<Params, Data>(makeParams(subject, grade, years))
    .then(rows => rows.sort((a, b) => d3.ascending(a.targetyear, b.targetyear)));
}
