import {Collection} from 'backbone';

import {default as Figure, FigureOptions} from 'views/figure';
import forwardEvents from 'util/forward-events';
import context from 'models/context';
import Legend from 'models/legend';
import BarLegend from 'models/legend/bar';
import LegendView from 'views/legend';
import {ContextualVariable} from 'data/contextual-variables';

import TrendsChart from 'pages/opportunities-and-access/trends-chart';

export interface TrendsFigureOptions extends FigureOptions {
  variable: ContextualVariable;
}

export default class TrendsFigure extends Figure {
  protected variable: ContextualVariable;

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

    this.showContents(new TrendsChart({
      variable: this.variable,
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
}
