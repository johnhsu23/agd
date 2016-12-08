import {Model} from 'backbone';
import {ItemView} from 'backbone.marionette';

import Page from 'views/page';
import DefaultSection from 'views/default-section';
import NotesSourcesView from 'views/notes-sources';

import context from 'models/context';
import {questions} from 'data/sample-questions';

import QuestionList from 'pages/questions-analysis/question-list';
import SampleQuestionAccordion from 'pages/questions-analysis/question-accordion';

import * as sampleQuestionsCommentary from 'json!commentary/questions-analysis/sample-questions.json';
import * as knowledgeSkillsCommentary from 'json!commentary/questions-analysis/knowledge-skills.json';
import * as questionsNotes from 'text!notes/questions-analysis.html';

export default class QuestionsAnalysis extends Page {
  pageTitle = 'Sample Questions';

  onBeforeShow(): void {
    const list = new QuestionList;

    this.pushSection(new DefaultSection({
      inner: list,
      commentary: sampleQuestionsCommentary[context.subject],
    }));

    for (const question of questions()) {
      list.pushView(new SampleQuestionAccordion({ question }));
    }

    this.pushSection(new DefaultSection({
      inner: new (class extends ItemView<Model> { template = () => '' }),
      commentary: knowledgeSkillsCommentary[context.subject],
    }));

    this.showChildView('footer', new NotesSourcesView({
      contents: questionsNotes,
    }));
  }
}
