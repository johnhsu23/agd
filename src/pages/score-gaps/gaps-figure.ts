import {EventsHash, Collection} from 'backbone';

import Figure from 'views/figure';
import Legend from 'legends/model';
import LegendView from 'views/legend';

import significantGap from 'legends/sig-gap';
import insignificantGap from 'legends/insig-gap';

import * as vars from 'data/variables';

import {load, Result} from 'pages/score-gaps/gaps-data';
import Chart from 'pages/score-gaps/gaps-chart';
import GapSelector from 'pages/score-gaps/gap-selector';

export default class ScoreGaps extends Figure {
  collection = new Collection<Legend>();

  protected chart: Chart;

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.chart = new Chart;

    this.showControls(new GapSelector);
    this.showContents(this.chart);
    this.showLegend(new LegendView({
      collection: this.collection,
    }));

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
    const promise = load(variable, focal, target);

    promise
      .then(result => this.chart.renderData(result))
      .done();

    promise
      .then(result => this.gatherNotes(result))
      .done();
  }

  protected gatherNotes(result: Result): void {
    const models: Legend[] = [];

    const hasSignificantGap = result.gaps.some(gap => {
      return gap.isSigDisplayable
          && (gap.sig === '<' || gap.sig === '>');
    });

    if (hasSignificantGap) {
      models.push(significantGap());
    }

    const hasInsignificantGap = result.gaps.some(gap => {
      return gap.isSigDisplayable
          && gap.sig !== '<'
          && gap.sig !== '>';
    });

    if (hasInsignificantGap) {
      models.push(insignificantGap());
    }

    this.collection.reset(models);
  }
}
