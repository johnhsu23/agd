import Page from 'views/page';
import DefaultSection from 'views/default-section';
import NotesSourcesView from 'views/notes-sources';
import {EventsHash} from 'backbone';

import context from 'models/context';
import {questions} from 'data/sample-questions';

import QuestionList from 'pages/questions-analysis/question-list';
import SampleQuestionAccordion from 'pages/questions-analysis/question-accordion';
import ItemMap from 'pages/questions-analysis/item-map-figure';

import * as sampleQuestionsCommentary from 'json!commentary/questions-analysis/sample-questions.json';
import * as knowledgeSkillsCommentary from 'json!commentary/questions-analysis/knowledge-skills.json';
import * as questionsMusicNotes from 'text!notes/questions-analysis/music.html';
import * as questionsVisualArtsNotes from 'text!notes/questions-analysis/visual-arts.html';

export default class QuestionsAnalysis extends Page {
  pageTitle = 'Sample Questions';

  childEvents(): EventsHash {
    return {
      'show:question': 'showQuestionAccordion',
    };
  }

  showQuestionAccordion(_: ItemMap, naepid: string): void {
    console.log('triggered from show:question');
    this.getChildView('section-1')
      .trigger('show:question', naepid);
  }

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
