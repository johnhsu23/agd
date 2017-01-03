import {default as Figure, FigureOptions} from 'views/figure';
import {EventsHash, Collection} from 'backbone';

import forwardEvents from 'util/forward-events';
import context from 'models/context';
import Legend from 'models/legend';
import BarLegend from 'models/legend/bar';
import * as vars from 'data/variables';
import {ContextualVariable} from 'data/contextual-variables';
import VariableSelector from 'views/variable-selector';
import LegendView from 'views/legend';

import GroupChart from 'pages/opportunities-and-access/group-chart';

export interface GroupFigureOptions extends FigureOptions {
  contextualVariable: ContextualVariable;
}

export default class GroupFigure extends Figure {
  protected variable = vars.SDRACE;
  protected contextualVariable: ContextualVariable;

  constructor(options: GroupFigureOptions) {
    super(options);

    this.contextualVariable = options.contextualVariable;
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

    /** Delete this if the data for school type is correct.
    const studentGroups = vars.studentGroups.map(group => {
      switch (group.id) {
        case 'SLUNCH3':
          return vars.SLUNCH3;
        case 'SCHTYPE':
          return vars.SCHTYPE;
        default:
          return group;
      }
    });
    */

    this.showControls(new VariableSelector({ variables: vars.studentGroups }));

    this.showContents(new GroupChart({
      variable: this.variable,
      contextualVariable: this.contextualVariable,
    }));

    const legends: Legend[] = this.contextualVariable.categories.map((d, i) => {
      return new BarLegend({
        category: i,
        description: d,
      });
    });

    const collection = new Collection(legends);

    this.showLegend(new LegendView({ collection }));

    this.setTitle(this.makeTitle());
  }

  childEvents(): EventsHash {
    return {
      'variable:select': 'onChildVariableSelect',
    };
  }

  onChildVariableSelect(_view: VariableSelector, variable: vars.Variable): void {
    if (this.variable !== variable) {
      this.variable = variable;
      this.getChildView('contents')
        .trigger('variable:select', variable);
      this.setTitle(this.makeTitle());
    }
  }

  protected makeTitle(): string {
    return `Percentage distribution of eighth-grade students assessed in NAEP ${context.subject}`
      + `, by ${this.variable.title} and ${this.contextualVariable.title}: 2016`;
  }
}
