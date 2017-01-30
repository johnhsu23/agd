import Figure from 'views/figure';
import configure from 'util/configure';

import * as template from 'text!templates/question-accordion-item-figure.html';

@configure({
  className: 'figure figure--accordion',
})
export default class QuestionAccordionItemFigure extends Figure {
  template = () => template;

  protected setHeading(text: string): void {
    this.$('.figure__heading')
      .text(text);
  }
}
