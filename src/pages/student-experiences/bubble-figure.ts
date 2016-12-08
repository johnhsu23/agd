import {default as Figure, FigureOptions} from 'views/figure';

import forwardEvents from 'util/forward-events';
import Legend from 'legends/model';
import context from 'models/context';
import {Variable} from 'data/variables';
import LegendView from 'views/legend';
import Collection from 'collections/legend';

import BubbleChart from 'pages/student-experiences/bubble-chart';

export interface BubbleFigureOptions extends FigureOptions {
  variable: Variable;
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

    this.showContents(new BubbleChart({
      variable: this.variable,
    }));

    const collection = new Collection([
      new Legend({
        type: 'bubble',
        marker: '',
        description: 'The size of each bubble represents the percentage of students in that response category.',
      }),
    ]);

    this.showLegend(new LegendView({ collection }));

    this.setTitle(this.makeTitle());
  }

  protected makeTitle(): string {
    return `Average responding scale scores and percentage of eighth-grade students assessed in NAEP ${context.subject}`
      + `, by ${this.variable.title}: 2016`;
  }
}
