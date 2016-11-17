import {EventsHash} from 'backbone';

import Figure from 'views/figure';
import Chart from 'pages/score-gaps/bar-chart';
import GapSelector from 'pages/score-gaps/gap-selector';

import * as vars from 'data/variables';

export default class TaskBar extends Figure {
  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.showContents(new Chart);
    this.showControls(new GapSelector);
  }

  childEvents(): EventsHash {
    return {
      'gap:select': 'onChildGapSelect',
    };
  }

  onChildGapSelect(view: GapSelector, variable: vars.Variable, focal: number, target: number): void {
    this.getChildView('contents')
      .trigger('gap:select', variable, focal, target);
  }
}
