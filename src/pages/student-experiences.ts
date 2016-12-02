import Page from 'views/page';
import DefaultSection from 'views/default-section';
import QuestionsListView from 'pages/student-experiences/questions-list';
import NotesSourcesView from 'views/notes-sources';

import context from 'models/context';

import * as studentExperiencesCommentary from 'json!commentary/student-experiences/student-experiences.json';
import * as studentExperiencesNotes from 'text!notes/student-experiences.html';

export default class StudentExperiences extends Page {
  pageTitle = 'Opportunities and Access';

  onBeforeShow(): void {
    this.pushSection(new DefaultSection({
      inner: new QuestionsListView,
      commentary: studentExperiencesCommentary[context.subject],
    }));

    this.showChildView('footer', new NotesSourcesView({
      contents: studentExperiencesNotes,
    }));
  }
}
