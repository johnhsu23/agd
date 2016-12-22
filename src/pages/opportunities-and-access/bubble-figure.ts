import {Collection} from 'backbone';

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

export interface BubbleFigureOptions extends FigureOptions {
  variable: Variable;
}

function gatherNotes(data: Grouped[]): Legend[] {
  const models = gatherAll(data, ({mean, percent}) => {
    // Laziness: just union these together to get the combined error flags for both
    // the mean and percentage rows
    return mean.TargetErrorFlag | percent.TargetErrorFlag;
  });

  return models.concat(new BubbleLegend({}));
}

export default class BubbleFigure extends Figure {
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

    const chart = new BubbleChart({
      variable: this.variable,
    });

    promise.then(data => chart.renderData(data))
      .done();

    this.showContents(chart);

    this.setTitle(this.makeTitle());
  }

  protected makeTitle(): string {
    return `Average responding scale scores and percentage of eighth-grade students assessed in NAEP ${context.subject}`
      + `, by ${this.variable.title}: 2016`;
  }
}
