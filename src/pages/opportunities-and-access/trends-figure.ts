import {Collection} from 'backbone';
import {union} from 'underscore';

import {FigureOptions} from 'views/figure';
import LegendView from 'views/legend';
import Legend from 'models/legend';
import {all as gatherNotes} from 'legends/gather';
import forwardEvents from 'util/forward-events';
import context from 'models/context';
import BarLegend from 'models/legend/bar';
import {ContextualVariable} from 'data/contextual-variables';

import QuestionAccordionItemFigure from 'pages/opportunities-and-access/question-accordion-item-figure';
import {load, Result, Data} from 'pages/opportunities-and-access/trends-data';
import TrendsChart from 'pages/opportunities-and-access/trends-chart';

export interface TrendsFigureOptions extends FigureOptions {
  variable: ContextualVariable;
}

export default class TrendsFigure extends QuestionAccordionItemFigure {
  protected variable: ContextualVariable;
  protected legendCollection = new Collection;

  constructor(options: TrendsFigureOptions) {
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

    load(this.variable)
      .then(data => this.loaded(data))
      .done();

    this.setTitle(this.makeTitle());
    this.setHeading('Percentage Trends');

    this.showLegend(new LegendView({
      collection: this.legendCollection,
    }));
  }

  protected loaded(data: Result[]): void {
    this.showContents(new TrendsChart({
      variable: this.variable,
      data: data,
    }));

    this.setTitle(this.makeTitle());

    this.buildLegend(data);
  }

  protected makeTitle(): string {
    return `Percentage distribution of eighth-grade students assessed in NAEP ${context.subject}`
      + `, by ${this.variable.title}: 2008 and 2016`;
  }

  protected buildLegend(result: Result[]): void {
    let legends: Legend[] = this.variable.categories.map((d, i) => {
      return new BarLegend({
        category: i,
        description: d,
      });
    });

    let data: Data[] = [];

    // populate our data array
    result.forEach(item => {
      data = union(data, item.values);
    });

    // add other notes based on error flags
    legends = legends.concat(...gatherNotes(data, row => row.TargetErrorFlag, row => row.sig));

    this.legendCollection.reset(legends);
  }
}
