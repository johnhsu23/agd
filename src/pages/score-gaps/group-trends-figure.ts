import Figure from 'views/figure';

import * as vars from 'data/variables';
import context from 'models/context';

export default class GroupTrendsFigure extends Figure {
  protected variable: vars.Variable = vars.SDRACE;

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.setTitle(this.makeTitle());
  }

  protected makeTitle(): string {
    return 'Percentage distribution and average responding scale scores of eighth-grade students ' +
      `assessed in NAEP ${context.subject}, by ${this.variable.title}: 2008 and 2016`;
  }
}
