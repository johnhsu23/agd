import {Collection} from 'backbone';
import {union} from 'underscore';

import {default as Figure, FigureOptions} from 'views/figure';
import LegendView from 'views/legend';
import Legend from 'models/legend';
import sigDiff from 'legends/sig-diff';
import {all as gatherNotes} from 'legends/gather';
import forwardEvents from 'util/forward-events';
import context from 'models/context';
import BarLegend from 'models/legend/bar';
import {ContextualVariable} from 'data/contextual-variables';

import {load, Result, Data} from 'pages/opportunities-and-access/trends-data';
import TrendsChart from 'pages/opportunities-and-access/trends-chart';

export interface TrendsFigureOptions extends FigureOptions {
  variable: ContextualVariable;
}

export default class TrendsFigure extends Figure {
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

    const legends: Legend[] = this.variable.categories.map((d, i) => {
      return new BarLegend({
        category: i,
        description: d,
      });
    });

    const collection = new Collection(legends);

    this.showLegend(new LegendView({ collection }));
  }

  protected makeTitle(): string {
    return `Percentage distribution of eighth-grade students assessed in NAEP ${context.subject}`
      + `, by ${this.variable.title}: 2008 and 2016`;
  }

  protected buildLegend(result: Result[]): void {
    let notes: Legend[] = [],
        data: Data[] = [];

    // populate our data array
    result.forEach(item => {
      data = union(data, item.values);
    });

    // add our sig diff note if applicable
    if (data.some(row => row.sig === '<' || row.sig === '>')) {
      notes.push(sigDiff());
    }

    // add other notes based on error flags
    notes = notes.concat(...gatherNotes(data, row => row.TargetErrorFlag));

    this.legendCollection.reset(notes);
  }
}
