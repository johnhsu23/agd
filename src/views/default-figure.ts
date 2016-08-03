import Figure from 'views/figure';

import context from 'models/context';

abstract class DefaultFigure extends Figure {
  protected abstract onGradeChanged(): void;

  delegateEvents(): this {
    super.delegateEvents();

    this.listenTo(context, 'change:grade', this.onGradeChanged);

    return this;
  }
}

export default DefaultFigure;
