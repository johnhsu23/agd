import Page from 'views/page';
import DefaultSection from 'views/default-section';

import ScoreGapsFigure from 'pages/score-gaps/gaps-figure';

import * as gapsCommentary from 'json!commentary/score-gaps/gaps.json';

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
      commentary: gapsCommentary['visual-arts'],
    }));
  }
}
