import {EventsHash} from 'backbone';
import * as $ from 'jquery';

import context from 'models/context';
import Page from 'views/page';
import DefaultSection from 'views/default-section';
import NotesSourcesView from 'views/notes-sources';

import QuestionsListView from 'pages/opportunities-and-access/questions-list';
import CustomDataTable from 'pages/opportunities-and-access/custom-data-table';

import * as studentExperiencesCommentary from 'json!commentary/opportunities-and-access/student-experiences.json';
import * as opportunitiesMusicNotes from 'text!notes/opportunities-and-access/music.html';
import * as opportunitiesVisualArtsNotes from 'text!notes/opportunities-and-access/visual-arts.html';

export default class OpportunitiesAndAccess extends Page {
  pageTitle = 'Opportunities and Access';

  regions(): { [key: string]: string } {
    return {
      'in-page-nav': '.in-page-nav-wrapper',
      footer: '.main__footer .inner',
      'data-table': '.js-data-table',
    };
  }

  events(): EventsHash {
    return {
      'click .js-table-link': 'tableLink',
    };
  }

  protected tableLink(event: JQueryMouseEventObject): void {
    event.preventDefault();

    // find the "Custom Data Table" section and scroll to it
    const position = $('.js-data-table .data-table__title').position().top;

    $(window).scrollTop(position);
  }

  onBeforeShow(): void {
    this.pushSection(new DefaultSection({
      inner: new QuestionsListView,
      commentary: studentExperiencesCommentary[context.subject],
    }));

    this.showChildView('footer', new NotesSourcesView({
      contents: (context.subject === 'music') ? opportunitiesMusicNotes : opportunitiesVisualArtsNotes,
    }));

    this.showChildView('data-table', new CustomDataTable);
  }
}
