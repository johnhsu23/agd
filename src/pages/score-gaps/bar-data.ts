import {csvParse} from 'd3-dsv';
import {nest} from 'd3-collection';
import {ascending} from 'd3-array';
import * as vars from 'data/variables';
import * as csv from 'text!files/creating-task.csv';

export interface CsvData {
  variable: string;
  categoryindex: number;
  value: number;
  name: string;
  errorFlag: number;
}

interface Grouped {
  [variable: string]: CsvData[];
}

const csvData = csvParse(csv, (d): CsvData => {
  return {
    variable: d['Variable'],
    categoryindex: +d['CategoryIndex'],
    value: +d['Value'],
    name: vars.studentGroupsById[d['Variable']].categories[+d['CategoryIndex']],
    errorFlag: +d['ErrorFlag'],
  };
});

export const groupedData: Grouped = nest<CsvData>()
      .key(d => d.variable)
      .sortValues((a, b) => ascending(a.categoryindex, b.categoryindex))
      .object(csvData);
