import * as Promise from 'bluebird';
import * as d3 from 'd3';

import {load as loadData} from 'data';

export interface Params {
  type: string;
  
  subject: string;
  grade: number;

  variable: string;
  categoryindex: number;

  targetyears: string[];
  focalyear: string;

  stattype: string | string[];
  jurisdiction: string;
}

export interface Data {
  focalyear: number;
  focalaccommodations: number;

  targetyear: number;
  targetaccommodations: number;

  stattype: string;
  subject: string;
  grade: number;

  jurisdiction: string;
  subScale: string;

  category: string;
  categoryindex: number;

  focalvalue: number;
  isFocalStatDisplayable: number;
  FocalErrorFlag: number;

  targetvalue: number;
  isTargetStatDisplayable: number;
  isSigDisplayable: number;

  gap: number;
  sig: string;
}

export interface Grouped {
  P1: Data[];
  P2: Data[];
  P5: Data[];
  P7: Data[];
  P9: Data[];

  extent: [number, number];
}

function makeParams(subject: string, grade: number, years: string[]): Params {
  return {
    type: 'tuda-acrossyear',

    subject,
    grade,

    variable: 'TOTAL',
    categoryindex: 0,

    targetyears: years,
    focalyear: '2015R3',

    stattype: ['P1', 'P2', 'P3', 'P5', 'P7', 'P9'],
    jurisdiction: 'NT',
  };
}

function groupData(rows: Data[]): Grouped {
  const grouped = d3.nest<Data>()
    .key(d => d.stattype)
    .sortValues((a, b) => d3.ascending(a.targetyear, b.targetyear))
    .map(rows) as Grouped;

  grouped.extent = d3.extent(rows, row => row.targetvalue);

  return grouped;
}

export function load(subject: string, grade: number, years: string[]): Promise<Grouped> {
  const params = makeParams(subject, grade, years);

  return loadData<Params, Data>(params)
    .then(groupData);
}