import Page from 'views/page';

import DefaultSection from 'views/default-section';
import TrendFigure from 'pages/average-scores/trend-figure';
import PercentileFigure from 'pages/average-scores/percentile-figure';

export default class AverageScores extends Page {
  onBeforeShow(): void {
    this.pushSection(new DefaultSection({
      inner: new TrendFigure,
    }));

    this.pushSection(new DefaultSection({
      inner: new PercentileFigure,
    }));
  }
}
