import {EventsHash, Collection} from 'backbone';

import Figure from 'views/figure';
import LegendView from 'views/legend';
import {types} from 'components/symbol';
import context from 'models/context';
import Legend from 'models/legend';
import NoteLegend from 'models/legend/note';
import significant from 'legends/sig-diff';
import roundsZero from 'legends/rounds-zero';
import * as comparison from 'legends/comparison';
import * as gapNotes from 'legends/gaps';
import * as vars from 'data/variables';

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
    // default to 'Race/Ethnicity', White - Hispanic (0 - 2)
    this.updateChart(this.variable, 0, 2);
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
          models: Legend[] = [],
          focalLabel = vars.studentGroupsById[focal.variable].categories[focal.categoryindex],
          targetLabel = vars.studentGroupsById[target.variable].categories[target.categoryindex];

    models.push(comparison.focal(types[focal.categoryindex], focalLabel));
    models.push(comparison.target(types[target.categoryindex], targetLabel));

    const gaps = result.gaps.filter(gap => {
      return gap.isFocalStatDisplayable
          && gap.isSigDisplayable
          && gap.isTargetStatDisplayable;
    });

    if (gaps.some(gap => gap.sig === '<' || gap.sig === '>')) {
      models.push(gapNotes.significant());
    }

    if (gaps.some(gap => gap.sig !== '<' && gap.sig !== '>')) {
      models.push(gapNotes.notSignificant());
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

    if (gaps.some(gap => Math.round(gap.gap) === 0)) {
      models.push(roundsZero());
    }

    // Add special notes for legend
    const description: String[] = [];

    if (gaps.some(gap => gap.gap < 0)) {
      description.push([
        'Negative score differences indicate that the average score of the first student group selected was',
        'numerically lower than the score of students in the comparison group.',
      ].join(' '));
    }

    if (this.variable.id === 'SDRACE') {
      // legend note for American Indian/Alaska Native
      if (focal.categoryindex === 4 || target.categoryindex === 4) {
        description.push([
          'Results are not available for American Indian/Alaska Native students due to insufficient sample',
          'sizes to permit reliable estimates.',
        ].join(' '));
      }

      // legend note for Two or More Races
      if (focal.categoryindex === 5 || target.categoryindex === 5) {
        description.push([
          'Results are not available for students with Two or More Races in 2008 due to the insufficient sample',
          'size to permit a reliable estimate.',
        ].join(' '));
      }
    }

    // add NOTE only if there descriptions to display
    if (description.length > 0) {
      models.push(new NoteLegend({
        description: description.join(' '),
      }));
    }

    this.collection.reset(models);
  }
}
