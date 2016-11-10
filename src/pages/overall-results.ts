import Page from 'views/page';

import DefaultSection from 'views/default-section';

import PercentileFigure from 'pages/overall-results/percentile-figure';

import * as averageCommentary from 'json!commentary/overall-results/average.json';
import * as percentilesCommentary from 'json!commentary/overall-results/percentiles.json';
import * as creatingTasksCommentary from 'json!commentary/overall-results/creating-tasks.json';
import * as respondingTaskCommentary from 'json!commentary/overall-results/responding-task.json';

export default class AverageScores extends Page {
  onBeforeShow(): void {
    this.pushSection(new DefaultSection({
      inner: new PercentileFigure({
        share: {
          download: true,
        },
      }),
      commentary: averageCommentary[this.subject],
    }));

    this.pushSection(new DefaultSection({
      inner: new PercentileFigure({
        share: {
          download: true,
        },
      }),
      commentary: percentilesCommentary[this.subject],
    }));

    this.pushSection(new DefaultSection({
      inner: new PercentileFigure({
        share: {
          download: true,
        },
      }),
      commentary: creatingTasksCommentary[this.subject],
    }));

    this.pushSection(new DefaultSection({
      inner: new PercentileFigure({
        share: {
          download: true,
        },
      }),
      commentary: respondingTaskCommentary[this.subject],
    }));
  }
}
