import {zip} from 'd3-array';
import {SymbolType} from 'd3-shape';
import {Collection} from 'backbone';

import {types as symbolTypes} from 'components/symbol';

import Figure from 'views/figure';
import Chart from 'pages/overall-results/percentile-chart';
import LegendView from 'pages/overall-results/percentile-legend';

import Legend from 'legends/model';
import significant from 'legends/sig-diff';
import series from 'legends/series';

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

    const list = zip<string | SymbolType>(tags, names, symbolTypes) as [string, string, SymbolType][];

    for (const [tag, description, type] of list.reverse()) {
      const legend = series(type, description);

      legend.tag = tag;
      models.push(legend);
    }

    models.push(significant());
    this.collection.reset(models);
  }

  protected makeTitle(): string {
    const years = formatList(yearsForGrade(12));

    return `Percentile scores for ${nth(12)}-grade students assessed in NAEP science: ${years}`;
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
