import Page from 'views/page';

import DefaultSection from 'views/default-section';

import PercentileFigure from 'pages/overall-results/percentile-figure';

import * as percentilesCommentary from 'json!commentary/overall-results/percentiles.json';

export default class AverageScores extends Page {
  onBeforeShow(): void {
    this.pushSection(new DefaultSection({
      inner: new PercentileFigure({
        share: {
          download: true,
        },
      }),
      commentary: percentilesCommentary['visual-arts'],
    }));
  }

  onDomRefresh(): void {
    this.loadInPageNav();
  }
}
