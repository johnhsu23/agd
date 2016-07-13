import Page from 'views/page';

import PercentileSection from 'pages/average-scores/percentile-section';

export default class AverageScores extends Page {
  onBeforeShow(): void {
    this.pushSection();

    this.showChildView('section-1', new PercentileSection);
  }
}
