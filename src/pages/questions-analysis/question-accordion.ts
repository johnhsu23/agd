import {LayoutView, LayoutViewOptions} from 'backbone.marionette';
import {Model} from 'backbone';

import configure from 'util/configure';
import AccordionBehavior from 'behaviors/accordion';
import {SampleQuestion} from 'data/sample-questions';

import * as template from 'text!templates/sample-question-accordion.html';

interface SampleQuestionAccordionOptions extends LayoutViewOptions<Model> {
  question: SampleQuestion;
}

@configure({
  behaviors: {
    AccordionBehavior: {
      behaviorClass: AccordionBehavior,
    },
  },
})
export default class SampleQuestionAccordion extends LayoutView<Model> {
  template = () => template;

  protected question: SampleQuestion;

  constructor(options: SampleQuestionAccordionOptions) {
    super(options);

    this.question = options.question;
  }

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.$('.accordion__header-text')
      .text(this.question.name);
  }
}
