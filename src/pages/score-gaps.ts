import {Model} from 'backbone';
import {ItemView} from 'backbone.marionette';

import Page from 'views/page';
import DefaultSection from 'views/default-section';

import context from 'models/context';

import ScoreGapsFigure from 'pages/score-gaps/gaps-figure';

import * as respondingCommentary from 'json!commentary/score-gaps/responding.json';
import * as creatingTaskCommentary from 'json!commentary/score-gaps/creating-task.json';
import * as studentGroupsCommentary from 'json!commentary/score-gaps/student-groups.json';

export default class ScoreGaps extends Page {
  pageTitle = 'Group Score Gaps';

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.pushSection(new DefaultSection({
      inner: new ScoreGapsFigure({
        share: {
          download: true,
        },
      }),
      commentary: respondingCommentary[context.subject],
    }));

    // Music does not have the "Creating Task" Score Gaps section
    if (context.subject !== 'music') {
      this.pushSection(new DefaultSection({
        inner: new (class extends ItemView<Model> { template = () => '' }),
        commentary: creatingTaskCommentary[context.subject],
      }));
    }

    this.pushSection(new DefaultSection({
      inner: new (class extends ItemView<Model> { template = () => '' }),
      commentary: studentGroupsCommentary[context.subject],
    }));
  }
}
