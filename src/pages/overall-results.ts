import {Model} from 'backbone';
import {ItemView} from 'backbone.marionette';

import Page from 'views/page';
import DefaultSection from 'views/default-section';

import context from 'models/context';

import PercentileFigure from 'pages/overall-results/percentile-figure';
import YearBarFigure from 'pages/overall-results/year-bar-figure';
import AverageFigure from 'pages/overall-results/average-figure';

import * as averageCommentary from 'json!commentary/overall-results/average.json';
import * as percentilesCommentary from 'json!commentary/overall-results/percentiles.json';
import * as creatingTasksCommentary from 'json!commentary/overall-results/creating-tasks.json';
import * as respondingTaskCommentary from 'json!commentary/overall-results/responding-task.json';

export default class AverageScores extends Page {
  pageTitle = 'Overall Results';

  onBeforeShow(): void {
    this.pushSection(new DefaultSection({
      inner: new AverageFigure,
      commentary: averageCommentary[context.subject],
    }));

    this.pushSection(new DefaultSection({
      inner: new PercentileFigure({
        share: {
          download: true,
        },
      }),
      commentary: percentilesCommentary[context.subject],
    }));

    this.pushSection(new DefaultSection({
      inner: new YearBarFigure({
        share: {
          download: true,
        },
      }),
      commentary: creatingTasksCommentary[context.subject],
    }));

    this.pushSection(new DefaultSection({
      inner: new (class extends ItemView<Model> { template = () => '' }),
      commentary: respondingTaskCommentary[context.subject],
    }));
  }
}
