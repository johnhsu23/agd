import {Collection} from 'backbone';

import Figure from 'views/figure';
import LegendView from 'views/legend';
import significant from 'legends/sig-diff';

import TrendChart from 'pages/average-scores/trend-chart';

export default class TrendFigure extends Figure {
  collection = new Collection([significant()]);

  onBeforeShow(): void {
    this.setTitle('average scores');

    this.showChildView('inner', new TrendChart);

    this.showChildView('legend', new LegendView({
      collection: this.collection,
    }));
  }
}
