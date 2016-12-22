import {LayoutView, LayoutViewOptions} from 'backbone.marionette';
import {Model} from 'backbone';
import {EventsHash} from 'backbone';

import context from 'models/context';
import configure from 'util/configure';
import AccordionBehavior from 'behaviors/accordion';
import {SampleQuestion} from 'data/sample-questions';

import QuestionHeaderBar from 'views/question-header-bar';
import {questionData, QuestionBarData} from 'pages/questions-analysis/question-header-data';
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
  protected data: QuestionBarData;

  constructor(options: SampleQuestionAccordionOptions) {
    super(options);

    this.question = options.question;
    this.data = questionData[this.question.naepid];
  }

  regions(): {[key: string]: string} {
    return {
      'header-bar-chart': '.accordion__header-bar',
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

    // set text elements in the accordion header
    this.$('.accordion__header-text')
      .text(this.question.name);

    this.$('.question-labels__classification')
      .text(this.question.classification);

    this.$('.question-labels__type')
      .text((this.question.type === 'MC') ? 'Multiple choice' : 'Constructed response');

    // place our header chart and update the bar
    const questionHeaderBar = new QuestionHeaderBar();

    this.showChildView('header-bar-chart', questionHeaderBar);

    questionHeaderBar.updateChart(this.data.value, this.data.label);

    // set text elements in the accordion contents
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
