import * as $ from 'jquery';
import {zip, svg} from 'd3';
import {Collection} from 'backbone';

import {load, Grouped, Data} from 'data/percentiles';

import Chart from 'charts/percentile';
import Figure from 'pages/average-scores/percentile-scores';
import LegendView from 'views/legend';

import Legend from 'legends/model';
import significant from 'legends/sig-diff';
import series from 'legends/series';

$(() => {
  const figure = new Figure({
    el: '#figure',
  });

  figure.setTitle('Something something chart title...');

  figure.render();
  figure.triggerMethod('show');
});