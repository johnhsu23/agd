import {EventsHash, Collection} from 'backbone';

import Figure from 'views/figure';
import Legend from 'legends/model';
import LegendView from 'views/legend';

import category from 'legends/category';
import significant from 'legends/sig-diff';
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
    const {focal, target, trend} = result,
          models: Legend[] = [];

    models.push(category(focal.categoryindex, focal.category));

    const targetLegend = category(target.categoryindex, target.category);
    targetLegend.tag = 'target';
    models.push(targetLegend);

    const gaps = result.gaps.filter(gap => {
      return gap.isFocalStatDisplayable
          && gap.isSigDisplayable
          && gap.isTargetStatDisplayable;
    });

    if (gaps.some(gap => gap.sig === '<' || gap.sig === '>')) {
      models.push(significantGap());
    }

    if (gaps.some(gap => gap.sig !== '<' && gap.sig !== '>')) {
      models.push(insignificantGap());
    }

    const isFocalSignificant = focal.isTargetStatDisplayable
                            && focal.isSigDisplayable
                            && (focal.sig === '<' || focal.sig === '>');

    const isTargetSignificant = target.isTargetStatDisplayable
                             && target.isSigDisplayable
                             && (target.sig === '<' || target.sig === '>');

    const isTrendSignificant = gaps.length === 2
                            && (trend.sig === '<' || trend.sig === '>');

    if (isFocalSignificant || isTargetSignificant || isTrendSignificant) {
      models.push(significant());
    }

    if (gaps.some(gap => gap.gap < 0)) {
      const description = [
        'Negative score differences indicate that the average score of the first student group selected was',
        'numerically lower than the score of students in the comparison group.',
      ].join(' ');

      models.push(new Legend({
        type: 'note',
        marker: '',
        description,
      }));
    }

    this.collection.reset(models);
  }
}
