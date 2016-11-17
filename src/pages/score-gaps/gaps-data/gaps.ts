import * as Promise from 'bluebird';

import context from 'models/context';
import loadData from 'api';

import {Params, Data} from 'api/tuda-gap';
export {Data};

function swap<T>(object: {[key: string]: T}, a: string, b: string): void {
  const temp = object[a];
  object[a] = object[b];
  object[b] = temp;
}

function swapCategories(rows: Data[]): Data[] {
  /*
   * The 'tuda-gap' endpoint confuses focal and target categories. We want 'categoryindex' to be the category of the
   * focal value, but it instead points to the target. So we have to reverse the categories (and their labels) here.
   */
  for (const row of rows as (Data & {[key: string]: number | string})[]) {
    swap(row, 'category', 'categoryb');
    swap(row, 'categoryindex', 'categorybindex');
    row.gap = -row.gap;
  }

  return rows;
}

function swapValues(rows: Data[]): Data[] {
  /*
   * See the comment in swapCategories() for why we don't also modify swap category and categoryindex here.
   */
  for (const row of rows as (Data & {[key: string]: number | string})[]) {
    swap(row, 'focalValue', 'targetValue');
    swap(row, 'focalErrorFlag', 'targetErrorFlag');
    swap(row, 'isFocalStatDisplayable', 'isTargetStatDisplayable');
  }

  return rows;
}

export function load(subject: string, variable: string, focal: number, target: number): Promise<Data[]> {
  const shouldSwap = focal > target;
  if (shouldSwap) {
    [focal, target] = [target, focal];
  }

  return loadData<Params, Data>({
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
