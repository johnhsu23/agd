import Figure from 'views/figure';
import BaselineSwitcher from 'views/baseline-switcher';

import Chart from 'pages/achievement-levels/overall-chart';
// import {load, Data} from 'pages/achievement-levels/overall-data';
import context from 'models/context';

import {yearsForGrade} from 'data/assessment-years';
import formatList from 'util/format-list';
import nth from 'util/nth';

export default class OverallFigure extends Figure {
  protected makeTitle(): string {
    const {grade} = context;
    const years = formatList(yearsForGrade(grade));

    return `Achievement-level results for ${nth(grade)}-grade students assessed in NAEP science: ${years}`;
  }

  onBeforeShow(): void {
    this.setTitle(this.makeTitle());
    this.showContents(new Chart);
    this.showControls(new BaselineSwitcher);
  }
}
