import {Collection} from 'backbone';
import * as $ from 'jquery';

import {default as Figure, FigureOptions} from 'views/figure';
import LegendView from 'views/legend';
import forwardEvents from 'util/forward-events';
import Legend from 'models/legend';
import BubbleLegend from 'models/legend/bubble';
import context from 'models/context';
import {Variable} from 'data/variables';
import {all as gatherAll} from 'legends/gather';

import {load, Grouped} from 'pages/opportunities-and-access/bubble-data';
import BubbleChart from 'pages/opportunities-and-access/bubble-chart';
import * as bubbleInstructions from 'text!templates/bubble-instructions.html';
import * as template from 'text!templates/question-accordion-item-figure.html';

export interface BubbleFigureOptions extends FigureOptions {
  variable: Variable;
}

function gatherNotes(data: Grouped[]): Legend[] {
  const models: Legend[] = [];
  models.push(new BubbleLegend({}));

  const gathered = gatherAll(data, ({mean, percent}) => {
      // Laziness: just union these together to get the combined error flags for both
      // the mean and percentage rows
      return mean.TargetErrorFlag | percent.TargetErrorFlag;
  });

  return models.concat(gathered);
}

export default class BubbleFigure extends Figure {
  template = () => template;
  protected variable: Variable;

  constructor(options: BubbleFigureOptions) {
    super(options);

    this.variable = options.variable;
  }

  delegateEvents(): this {
    super.delegateEvents();

    // Events triggered via triggerMethod() do not propagate downwards by default.
    forwardEvents(this, 'visibility:visible', 'visibility:hidden');

    return this;
  }

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    const promise = load(this.variable);

    const collection = new Collection<Legend>();
    promise.then(gatherNotes)
      .then(models => collection.reset(models))
      .done();

    this.showLegend(new LegendView({ collection }));
    this.showInstructions(bubbleInstructions);

    const chart = new BubbleChart({
      variable: this.variable,
    });

    promise.then(data => chart.renderData(data))
      .then(() => this.removePlaceholder())
      .done();

    this.showContents(chart);

    this.setTitle(this.makeTitle());
    this.setOffscreenLink();
    this.$('.figure__heading')
      .text('Scale Scores and Percentages');
  }

  protected makeTitle(): string {
    return `Average responding scale scores and percentage of eighth-grade students assessed in NAEP ${context.subject}`
      + `, by ${this.variable.title}: 2016`;
  }

  protected setOffscreenLink(): void {
    const subject = (context.subject === 'music') ? 'MUS' : 'VIS';
    const subscale = (context.subject === 'music') ? 'MUSRP' : 'VISRP';
    const link = 'https://nces.ed.gov/nationsreportcard/naepdata/report.aspx'
      + `?p=2-${subject}-2-20163-${subscale}-${this.variable.id},TOTAL-NT-MN_MN,RP_RP-Y_J-0-0-5`;

    $('<div>', { class: 'off-screen' })
      .text('See the accessible version of this chart in the NAEP Data Explorer: ')
      .append($('<a>', { href: link }).text(link))
      .insertAfter(this.$('.figure__title'));
  }
}
