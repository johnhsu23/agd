import Page from 'views/page';
import DefaultSection from 'views/default-section';
import QuestionsListView from 'pages/student-experiences/questions-list';

import context from 'models/context';

import * as studentExperiencesCommentary from 'json!commentary/student-experiences/student-experiences.json';

export default class StudentExperiences extends Page {
  pageTitle = 'Student Experiences';

  onBeforeShow(): void {
    this.pushSection(new DefaultSection({
      inner: new QuestionsListView,
      commentary: studentExperiencesCommentary[context.subject],
    }));
  }
}
