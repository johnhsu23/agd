import {zip} from 'd3';
import {Collection} from 'backbone';

import {types as symbolTypes} from 'components/symbol';

import Figure from 'views/figure';
import Chart from 'pages/average-scores/percentile-chart';
import LegendView from 'pages/average-scores/percentile-legend';

import Legend from 'legends/model';
import significant from 'legends/sig-diff';
import series from 'legends/series';

import context from 'models/grade';

import {yearsForGrade} from 'data/assessment-years';
import formatList from 'util/format-list';
import nth from 'util/nth';

export default class PercentileScores extends Figure {
  collection: Collection<Legend> = new Collection<Legend>();

  protected buildLegend(): void {
    const models: Legend[] = [];

    const names = [
      '10th',
      '25th',
      '50th',
      '75th',
      '90th',
    ].map(d => d + ' Percentile');

    const tags = [
      'p1',
      'p2',
      'p5',
      'p7',
      'p9',
    ];

    const list = zip(symbolTypes, tags, names).reverse();

    for (const [type, tag, description] of list) {
      const legend = series(type, description);

      legend.tag = tag;
      models.push(legend);
    }

    models.push(significant());

    this.collection.reset(models);
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

  protected makeTitle(): string {
    const {grade} = context;
    const years = formatList(yearsForGrade(grade));

    return `Percentile scores for ${nth(grade)}-grade students assessed in NAEP science: ${years}`;
  }

  onBeforeShow(): void {
    this.buildLegend();

    this.setTitle(this.makeTitle());

    this.showLegend(new LegendView({
      collection: this.collection,
    }));

    this.showContents(new Chart);
  }
}
