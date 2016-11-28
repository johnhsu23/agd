import {EventsHash} from 'backbone';

import Figure from 'views/figure';
import Chart from 'pages/score-gaps/bar-chart';
import VariableSelector from 'pages/score-gaps/variable-selector';

import * as vars from 'data/variables';

export default class TaskBar extends Figure {
  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.showContents(new Chart);
    this.showControls(new VariableSelector);
  }

  childEvents(): EventsHash {
    return {
      'variable:select': 'onChildVariableSelect',
    };
  }

  onChildVariableSelect(variable: vars.Variable): void {
    this.getChildView('contents')
      .trigger('variable:select', variable);
  }
}
