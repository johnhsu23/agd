import {EventsHash, Collection} from 'backbone';

import Figure from 'views/figure';
import Legend from 'legends/model';
import LegendView from 'views/legend';

import category from 'legends/category';
import significant from 'legends/sig-diff';
import significantGap from 'legends/sig-gap';
import insignificantGap from 'legends/insig-gap';

import * as vars from 'data/variables';
import context from 'models/context';

import {load, Result} from 'pages/score-gaps/gaps-data';
import Chart from 'pages/score-gaps/gaps-chart';
import GapSelector from 'pages/score-gaps/gap-selector';

export default class ScoreGaps extends Figure {
  collection = new Collection<Legend>();

  protected chart: Chart;
  protected variable: vars.Variable = vars.SDRACE;

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

    this.setTitle(this.makeTitle());
    this.updateChart(this.variable, 0, 1);
  }

  childEvents(): EventsHash {
    return {
      'gap:select': 'onChildGapSelect',
    };
  }

  onChildGapSelect(_: GapSelector, variable: vars.Variable, focal: number, target: number): void {
    this.variable = variable;
    this.setTitle(this.makeTitle());
    this.updateChart(this.variable, focal, target);
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

  protected makeTitle(): string {
    return 'Average responding scale scores and score gaps for eighth-grade students assessed in NAEP ' +
      `${context.subject}, by ${this.variable.title}: 2008 and 2016`;
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

    // Add special notes for legend
    const noteDescription: String[] = [];

    if (gaps.some(gap => gap.gap < 0)) {
      noteDescription.push([
        'Negative score differences indicate that the average score of the first student group selected was',
        'numerically lower than the score of students in the comparison group.',
      ].join(' '));
    }

    if (this.variable.id === 'SDRACE') {
      // legend note for American Indian/Alaska Native
      if (focal.categoryindex === 4 || target.categoryindex === 4) {
        noteDescription.push([
          'Results are not available for American Indian/Alaska Native students due to insufficient sample',
          'sizes to permit reliable estimates.',
        ].join(' '));
      }

      // legend note for Two or More Races
      if (focal.categoryindex === 5 || target.categoryindex === 5) {
        noteDescription.push([
          'Results are not available for students with Two or More Races in 2008 due to the insufficient sample',
          'size to permit a reliable estimate.',
        ].join(' '));
      }
    }

    // add NOTE only if there descriptions to display
    if (noteDescription.length > 0) {
      models.push(new Legend({
        type: 'note',
        marker: '',
        description: noteDescription.join(' '),
      }));
    }

    this.collection.reset(models);
  }
}
