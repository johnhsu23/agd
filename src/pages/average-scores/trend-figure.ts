import {Collection} from 'backbone';

import Figure from 'views/figure';
import LegendView from 'views/legend';
import significant from 'legends/sig-diff';

import TrendChart from 'pages/average-scores/trend-chart';

import context from 'models/grade';
import {yearsForGrade} from 'data/assessment-years';
import formatList from 'util/format-list';
import nth from 'util/nth';

export default class TrendFigure extends Figure {
  collection = new Collection([significant()]);

  protected makeTitle(): string {
    const {grade} = context;
    const years = formatList(yearsForGrade(grade));

    return `Average scores for ${nth(grade)}-grade students assessed in NAEP science: ${years}`;
  }

  delegateEvents(): this {
    super.delegateEvents();

    this.listenTo(context, 'change:grade', () => {
      this.setTitle(this.makeTitle());
    });

    return this;
  }

  undelegateEvents(): this {
    this.stopListening(context);

    return super.undelegateEvents();
  }

  onBeforeShow(): void {
    this.setTitle(this.makeTitle());

    this.showChildView('inner', new TrendChart);

    this.showChildView('legend', new LegendView({
      collection: this.collection,
    }));
  }
}
