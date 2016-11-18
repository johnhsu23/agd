import {EventsHash} from 'backbone';

import Figure from 'views/figure';
import Chart from 'pages/score-gaps/gaps-chart';
import GapSelector from 'pages/score-gaps/gap-selector';

import * as api from 'pages/score-gaps/gaps-data';

import * as vars from 'data/variables';

export default class ScoreGaps extends Figure {
  protected chart: Chart;

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.chart = new Chart;

    this.showContents(this.chart);
    this.showControls(new GapSelector);

    this.updateChart(vars.SDRACE, 0, 1);
  }

  childEvents(): EventsHash {
    return {
      'gap:select': 'onChildGapSelect',
    };
  }

  onChildGapSelect(view: GapSelector, variable: vars.Variable, focal: number, target: number): void {
    this.updateChart(variable, focal, target);
  }

  protected updateChart(variable: vars.Variable, focal: number, target: number): void {
    api.load(vars.SDRACE, 0, 1)
      .then(result => this.chart.renderData(result))
      .done();
  }
}
