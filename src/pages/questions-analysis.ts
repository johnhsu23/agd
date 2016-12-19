import Page from 'views/page';
import DefaultSection from 'views/default-section';
import NotesSourcesView from 'views/notes-sources';
import {EventsHash} from 'backbone';
import * as $ from 'jquery';

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
      inner: new ItemMap,
      commentary: knowledgeSkillsCommentary[context.subject],
    }));

    this.showChildView('footer', new NotesSourcesView({
      contents: (context.subject === 'music') ? questionsMusicNotes : questionsVisualArtsNotes,
    }));
  }

  events(): EventsHash {
    return {
      'click .item-map__item__link a': 'goToAccordion',
    };
  }

  goToAccordion(event: JQueryMouseEventObject): void {
    // get the accordion based on the ID on the link
    const accordionId = event.target.getAttribute('data-accordion-id');
    const accordion = this.$(`[data-index="${accordionId}"]`);

    // check if accordion is NOT already expanded
    if (accordion.find('.is-expanded').length === 0) {
      //open the accordion (trigger click on the data-accordion-header anchor)
      accordion.find('[data-accordion-header]').click();
    }

    // have the page scroll to the accordion
    $(window).scrollTop(accordion.offset().top);

    event.preventDefault();
  }
}
