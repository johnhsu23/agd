import {csvParse} from 'd3-dsv';
import {nest} from 'd3-collection';
import {ascending} from 'd3-array';
import * as vars from 'data/variables';

interface CsvData {
  variable: string;
  categoryindex: number;
  value: number;
  name: string;
}

export interface Grouped {
  [variable: string]: CsvData[];
}

import * as CSV from 'text!files/creating-task.csv';

export function load(): Grouped {

  const data = csvParse(CSV, function(d): CsvData {
    return {
      variable: d['Variable'],
      categoryindex: +d['CategoryIndex'],
      value: +d['Value'],
      name: vars.VariableList[d['Variable']].categories[+d['CategoryIndex']],
    };
  });

  return nest<CsvData>()
      .key(d => d.variable)
      .sortValues((a, b) => ascending(a.categoryindex, b.categoryindex))
      .object(data);
}

export default load;
