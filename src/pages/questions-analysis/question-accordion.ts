import {LayoutView, LayoutViewOptions} from 'backbone.marionette';
import {Model} from 'backbone';
import {EventsHash} from 'backbone';

import context from 'models/context';
import configure from 'util/configure';
import AccordionBehavior from 'behaviors/accordion';
import {SampleQuestion} from 'data/sample-questions';

import QuestionHeaderBar from 'pages/questions-analysis/question-header-bar';
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

  regions(): {[key: string]: string} {
    return {
      'header-bar': '.accordion__header-bar',
    };
  }

  events(): EventsHash {
    return {
      'click [data-answer-button]': 'answerToggle',
      'click [data-accordion-header]': 'chartDisplayToggle',
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

    this.showChildView('header-bar', new QuestionHeaderBar({
      question: this.question,
    }));

    this.$('.sample-question__question')
      .html(questionData['question']);

    this.$('.sample-question__answer-detail')
      .html(questionData['answer']);
  }

  protected answerToggle(event: JQueryMouseEventObject): void {
    this.$('.sample-question__answer-detail').toggleClass('is-hidden');

    event.preventDefault();
  }

  protected chartDisplayToggle(event: JQueryMouseEventObject): void {
    this.$('.accordion__header-bar').toggleClass('is-hidden');

    event.preventDefault();
  }
}
