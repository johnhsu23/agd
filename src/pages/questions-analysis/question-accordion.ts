import {LayoutView, LayoutViewOptions} from 'backbone.marionette';
import {Model} from 'backbone';
import {EventsHash} from 'backbone';

import context from 'models/context';
import configure from 'util/configure';
import AccordionBehavior from 'behaviors/accordion';
import {SampleQuestion} from 'data/sample-questions';

import * as template from 'text!templates/sample-question-accordion.html';
import * as musicQuestions from 'json!questions/music.json';
import * as visualArtsQuestions from 'json!questions/visual-arts.json';

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

  events(): EventsHash {
    return {
      'click [data-answer-button]': 'answerToggle',
    };
  }

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    const questions = (context.subject === 'music') ? musicQuestions : visualArtsQuestions,
      questionData = questions[this.question.naepid];

    this.$('.accordion__header-text')
      .text(this.question.name);

    this.$('.accordion__contents__left')
      .html(questionData['question']);

    this.$('.question__answer-contents')
      .html(questionData['answer']);
  }

  protected answerToggle(event: JQueryMouseEventObject): void {
    this.$('.question__answer-contents').toggleClass('is-hidden');

    event.preventDefault();
  }
}
