import DefaultSection from 'views/default-section';
import Page from 'views/page';

import OverallFigure from 'pages/achievement-levels/overall-figure';
import * as overallCommentary from 'json!commentary/acls-overall.json';

export default class AchievementLevels extends Page {
  onBeforeShow(): void {
    this.pushSection(new DefaultSection({
      inner: new OverallFigure,
      commentary: overallCommentary,
    }));
  }
}
