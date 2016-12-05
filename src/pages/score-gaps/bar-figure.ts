import {EventsHash} from 'backbone';

import Figure from 'views/figure';
import Chart from 'pages/score-gaps/bar-chart';
import VariableSelector from 'pages/score-gaps/variable-selector';

import * as vars from 'data/variables';

export default class TaskBar extends Figure {
  protected variable: vars.Variable = vars.SDRACE;

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.setTitle(this.makeTitle());
    this.showContents(new Chart);
    this.showControls(new VariableSelector);
  }

  childEvents(): EventsHash {
    return {
      'variable:select': 'onChildVariableSelect',
    };
  }

  onChildVariableSelect(_view: VariableSelector, variable: vars.Variable): void {
    this.variable = variable;
    this.getChildView('contents')
      .trigger('variable:select', variable);
    this.setTitle(this.makeTitle());
  }

  protected makeTitle(): string {
    return 'Average creating task scores for eighth-grade students assessed in NAEP ' +
      `visual arts, by ${this.variable.title}: 2016`;
  }
}