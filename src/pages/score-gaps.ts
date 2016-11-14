import {Model} from 'backbone';
import {ItemView} from 'backbone.marionette';

import Page from 'views/page';
import DefaultSection from 'views/default-section';

import ScoreGapsFigure from 'pages/score-gaps/gaps-figure';

import * as respondingCommentary from 'json!commentary/score-gaps/responding.json';
import * as creatingTaskCommentary from 'json!commentary/score-gaps/creating-task.json';

export default class ScoreGaps extends Page {
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
      commentary: respondingCommentary[this.subject],
    }));

    this.pushSection(new DefaultSection({
      inner: new (class extends ItemView<Model> { template = () => '' }),
      commentary: creatingTaskCommentary[this.subject],
    }));
  }
}
