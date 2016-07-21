import Page from 'views/page';

import DefaultSection from 'views/default-section';

import TrendFigure from 'pages/average-scores/trend-figure';
import PercentileFigure from 'pages/average-scores/percentile-figure';
import SubscaleFigure from 'pages/average-scores/subscale-figure';

import context from 'models/grade';

import * as trendCommentary from 'json!commentary/average-scores.json';

export default class AverageScores extends Page {
  protected trendSection: DefaultSection;

  onBeforeShow(): void {
    if (!this.trendSection) {
      this.trendSection = new DefaultSection({
        inner: new TrendFigure,
      });
    }
    this.pushSection(this.trendSection);

    this.pushSection(new DefaultSection({
      inner: new PercentileFigure,
    }));

    this.pushSection(new DefaultSection({
      inner: new SubscaleFigure,
    }));

    this.setCommentary(context);
  }

  initialize(): void {
    this.listenTo(context, 'change:grade', this.setCommentary);
  }

  protected setCommentary({grade}: typeof context): void {
    this.trendSection.setCommentary(trendCommentary['' + grade]);
  }
}
