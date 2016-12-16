import Page from 'views/page';
import DefaultSection from 'views/default-section';
import QuestionsListView from 'pages/student-experiences/questions-list';
import NotesSourcesView from 'views/notes-sources';

import context from 'models/context';

import * as studentExperiencesCommentary from 'json!commentary/student-experiences/student-experiences.json';
import * as studentExperiencesMusicNotes from 'text!notes/student-experiences/music.html';
import * as studentExperiencesVisualArtsNotes from 'text!notes/student-experiences/visual-arts.html';

export default class StudentExperiences extends Page {
  pageTitle = 'Opportunities and Access';

  onBeforeShow(): void {
    this.pushSection(new DefaultSection({
      inner: new QuestionsListView,
      commentary: studentExperiencesCommentary[context.subject],
    }));

    this.showChildView('footer', new NotesSourcesView({
      contents: (context.subject === 'music') ? studentExperiencesMusicNotes : studentExperiencesVisualArtsNotes,
    }));
  }
}
