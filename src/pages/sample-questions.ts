import Page from 'views/page';
import DefaultSection from 'views/default-section';
import NotesSourcesView from 'views/notes-sources';

import context from 'models/context';
import {questions} from 'data/sample-questions';

import QuestionList from 'pages/sample-questions/question-list';
import SampleQuestionAccordion from 'pages/sample-questions/question-accordion';
import ItemMap from 'pages/sample-questions/item-map-figure';

import * as sampleQuestionsCommentary from 'json!commentary/sample-questions/sample-questions.json';
import * as knowledgeSkillsCommentary from 'json!commentary/sample-questions/knowledge-skills.json';
import * as questionsMusicNotes from 'text!notes/sample-questions/music.html';
import * as questionsVisualArtsNotes from 'text!notes/sample-questions/visual-arts.html';

export default class SampleQuestions extends Page {
  pageTitle = 'Sample Questions';

  onBeforeShow(): void {
    const list = new QuestionList;

    this.pushSection(new DefaultSection({
      inner: list,
      commentary: sampleQuestionsCommentary[context.subject],
    }));

    for (const question of questions()) {
      list.pushView(new SampleQuestionAccordion({ question }), question.naepid);
    }

    this.pushSection(new DefaultSection({
      inner: new ItemMap,
      commentary: knowledgeSkillsCommentary[context.subject],
    }));

    this.showChildView('footer', new NotesSourcesView({
      contents: (context.subject === 'music') ? questionsMusicNotes : questionsVisualArtsNotes,
    }));
  }
}
