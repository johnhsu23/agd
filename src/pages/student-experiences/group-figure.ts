import {default as Figure, FigureOptions} from 'views/figure';
import {EventsHash} from 'backbone';

import forwardEvents from 'util/forward-events';
import context from 'models/context';
import * as vars from 'data/variables';
import {ContextualVariable} from 'data/contextual-variables';
import VariableSelector from 'views/variable-selector';

import GroupChart from 'pages/student-experiences/group-chart';

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

    const studentGroups = vars.studentGroups.map(group => {
      switch (group.id) {
        case 'SLUNCH3':
          return vars.SLUNCH1;
        case 'SCHTYPE':
          return vars.SCHTYP1;
        default:
          return group;
      }
    });

    this.showControls(new VariableSelector({ variables: studentGroups }));

    this.showContents(new GroupChart({
      variable: this.variable,
      contextualVariable: this.contextualVariable,
    }));

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
