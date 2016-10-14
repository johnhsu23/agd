import Page from 'views/page';

import DefaultSection from 'views/default-section';

import TrendFigure from 'pages/average-scores/trend-figure';
import PercentileFigure from 'pages/average-scores/percentile-figure';
import SubscaleFigure from 'pages/average-scores/subscale-figure';

import * as trendCommentary from 'json!commentary/average-scores/trends.json';
import * as percentilesCommentary from 'json!commentary/average-scores/percentiles.json';
import * as subscaleCommentary from 'json!commentary/average-scores/subscales.json';

export default class AverageScores extends Page {
  onBeforeShow(): void {
    this.pushSection(new DefaultSection({
      inner: new TrendFigure({
        share: {
          download: true,
        },
      }),
      commentary: trendCommentary,
    }));

    this.pushSection(new DefaultSection({
      inner: new PercentileFigure({
        share: {
          download: true,
        },
      }),
      commentary: percentilesCommentary,
    }));

    this.pushSection(new DefaultSection({
      inner: new SubscaleFigure({
        share: {
          download: false,
        },
      }),
      commentary: subscaleCommentary,
    }));
  }
}
