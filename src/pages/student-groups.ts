import {Model} from 'backbone';
import {ItemView} from 'backbone.marionette';

import Page from 'views/page';
import DefaultSection from 'views/default-section';

import context from 'models/context';

import * as scoreTrendsCommentary from 'json!commentary/student-groups/score-trends.json';
import * as percentagesCommentary from 'json!commentary/student-groups/percentages.json';

export default class StudentGroups extends Page {
  pageTitle = 'Scores by Student Group';

  onBeforeShow(): void {
    this.pushSection(new DefaultSection({
      inner: new (class extends ItemView<Model> { template = () => '' }),
      commentary: scoreTrendsCommentary[context.subject],
    }));

    this.pushSection(new DefaultSection({
      inner: new (class extends ItemView<Model> { template = () => '' }),
      commentary: percentagesCommentary[context.subject],
    }));
  }
}
