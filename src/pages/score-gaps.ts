import {Model} from 'backbone';
import {ItemView} from 'backbone.marionette';

import Page from 'views/page';
import DefaultSection from 'views/default-section';

import context from 'models/context';

import * as respondingCommentary from 'json!commentary/score-gaps/responding.json';
import * as creatingTaskCommentary from 'json!commentary/score-gaps/creating-task.json';

export default class ScoreGaps extends Page {
  onBeforeShow(): void {
    this.pushSection(new DefaultSection({
      inner: new (class extends ItemView<Model> { template = () => '' }),
      commentary: respondingCommentary[context.subject],
    }));

    this.pushSection(new DefaultSection({
      inner: new (class extends ItemView<Model> { template = () => '' }),
      commentary: creatingTaskCommentary[context.subject],
    }));
  }
}
