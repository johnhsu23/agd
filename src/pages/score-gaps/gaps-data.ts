import * as Promise from 'bluebird';

import context from 'models/context';

import loadData from 'api';

import * as gap from 'api/tuda-gap';

function swap<T>(object: {[key: string]: T}, a: string, b: string): void {
  const temp = object[a];
  object[a] = object[b];
  object[b] = temp;
}

function swapCategories(rows: gap.Data[]): gap.Data[] {
  for (const row of rows as (gap.Data & {[key: string]: number | string})[]) {
    swap(row, 'category', 'categoryb');
    swap(row, 'categoryindex', 'categorybindex');
  }

  return rows;
}

function swapValues(rows: gap.Data[]): gap.Data[] {
  for (const row of rows as (gap.Data & {[key: string]: number | string})[]) {
    swap(row, 'focalValue', 'targetValue');
    swap(row, 'focalErrorFlag', 'targetErrorFlag');
    swap(row, 'isFocalStatDisplayable', 'isTargetStatDisplayable');
    row.gap = -row.gap;
  }

  return rows;
}

export function load(subject: string, variable: string, focal: number, target: number): Promise<gap.Data[]> {
  const shouldSwap = focal > target;
  if (shouldSwap) {
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
  }).then(shouldSwap ? swapCategories : swapValues);
}

export default load;
