import Page from 'views/page';
import DefaultSection from 'views/default-section';
import QuestionsListView from 'pages/opportunities-and-access/questions-list';
import NotesSourcesView from 'views/notes-sources';

import context from 'models/context';

import * as studentExperiencesCommentary from 'json!commentary/opportunities-and-access/student-experiences.json';
import * as opportunitiesMusicNotes from 'text!notes/opportunities-and-access/music.html';
import * as opportunitiesVisualArtsNotes from 'text!notes/opportunities-and-access/visual-arts.html';

export default class OpportunitiesAndAccess extends Page {
  pageTitle = 'Opportunities and Access';

  onBeforeShow(): void {
    this.pushSection(new DefaultSection({
      inner: new QuestionsListView,
      commentary: studentExperiencesCommentary[context.subject],
    }));

    this.showChildView('footer', new NotesSourcesView({
      contents: (context.subject === 'music') ? opportunitiesMusicNotes : opportunitiesVisualArtsNotes,
    }));
  }
}
