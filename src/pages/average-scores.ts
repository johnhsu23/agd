import Page from 'views/page';

import PercentileFigure from 'pages/average-scores/percentile-figure';

export default class AverageScores extends Page {
  onBeforeShow(): void {

    this.pushSection(new DefaultSection({
      inner: new PercentileFigure,
    }));
  }
}
