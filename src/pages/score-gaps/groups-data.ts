import * as Bluebird from 'bluebird';

import loadData from 'api';
import context from 'models/context';
import {Params, Data} from 'api/tuda-acrossyear';

import {Variable, SDRACE, SRACE10, SCHTYPE, SCHTYP2} from 'data/variables';
import * as sdrace from 'util/sdrace';
import * as schtype from 'util/schtype';

export {Data};

function loadOne(variable: Variable, categories: number[]): Bluebird<Data[]> {
  return loadData<Params, Data>({
    type: 'tuda-acrossyear',

    subject: context.subject,
    subscale: context.subject === 'visual arts' ? 'VISRP' : 'MUSRP',
    grade: 8,

    variable: variable.id,
    categoryindex: categories,

    focalyear: '2016R3',
    targetyears: ['2008R3', '2016R3'],

    jurisdiction: 'NT',
    stattype: ['MN', 'RP'],
  })
  // Unconditionally call adjust() for all rows
  // (The function won't mangle data for variables it doesn't recognize)
  .then(rows => rows.map(sdrace.adjust));
}

export async function load(variable: Variable): Bluebird<Data[]> {
  const categories = sdrace.categories(variable);

  // If we've requested variables that need combination, handle that here
  if (sdrace.shouldCombine(variable)) {
    const sdraceData = loadOne(SDRACE, sdrace.categories(SDRACE)),
          srace10Data = loadOne(SRACE10, sdrace.categories(SRACE10));

    return [
      ...await sdraceData,
      ...await srace10Data,
    ];
  } else if (schtype.shouldCombine(variable)) {
    const schtypeData = loadOne(SCHTYPE, schtype.categories(SCHTYPE)),
          schtyp2Data = loadOne(SCHTYP2, schtype.categories(SCHTYP2));

    return [
      ...await schtypeData,
      ...await schtyp2Data,
    ];
  }

  return loadOne(variable, categories);
}
