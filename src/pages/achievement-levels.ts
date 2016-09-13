import DefaultSection from 'views/default-section';
import Page from 'views/page';

import OverallFigure from 'pages/achievement-levels/overall-figure';
import GroupsFigure from 'pages/achievement-levels/groups-figure';

import * as overallCommentary from 'json!commentary/achievement-levels/overall.json';
import * as groupsCommentary from 'json!commentary/achievement-levels/groups.json';

export default class AchievementLevels extends Page {
  onBeforeShow(): void {
    this.pushSection(new DefaultSection({
      inner: new OverallFigure,
      commentary: overallCommentary,
    }));

    this.pushSection(new DefaultSection({
      inner: new GroupsFigure,
      commentary: groupsCommentary,
    }));
  }
}
