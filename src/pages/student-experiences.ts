import {Model} from 'backbone';
import {ItemView} from 'backbone.marionette';

import Page from 'views/page';
import DefaultSection from 'views/default-section';

import context from 'models/context';

import * as studentExperiencesCommentary from 'json!commentary/student-experiences/student-experiences.json';

export default class StudentExperiences extends Page {
  pageTitle = 'Student Experiences';

  onBeforeShow(): void {
    this.pushSection(new DefaultSection({
      inner: new (class extends ItemView<Model> { template = () => ''}),
      commentary: studentExperiencesCommentary[context.subject],
    }));
  }
}
