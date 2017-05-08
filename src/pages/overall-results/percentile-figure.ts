import {zip} from 'd3-array';
import {SymbolType} from 'd3-shape';
import {Collection} from 'backbone';
import * as $ from 'jquery';

import Figure from 'views/figure';
import context from 'models/context';
import Legend from 'models/legend';
import series from 'legends/series';
import sigDiff from 'legends/sig-diff';
import {types as symbolTypes} from 'components/symbol';

import Chart from 'pages/overall-results/percentile-chart';
import LegendView from 'pages/overall-results/percentile-legend';
import {load, Data, group} from 'pages/overall-results/percentile-data';

import * as percentileInstructions from 'text!templates/percentile-instructions.html';

export default class PercentileScores extends Figure {
  collection: Collection<Legend> = new Collection<Legend>();

  protected buildLegend(data: Data[]): void {
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

    if (data.some(d => d.sig === '<' || d.sig === '>')) {
      models.push(sigDiff());
    }

    this.collection.reset(models);
  }

  protected makeTitle(): string {
    return `Percentile scores for eighth-grade students assessed in NAEP ${context.subject}: 2008 and 2016`;
  }

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.setTitle(this.makeTitle());

    this.showLegend(new LegendView({
      collection: this.collection,
    }));

    this.showInstructions(percentileInstructions);

    const chart = new Chart;
    this.showContents(chart);

    const promise = load();

    promise
      .then(rows => this.buildLegend(rows))
      .then(() => this.removePlaceholder())
      .done();

    promise
      .then(group)
      .then(data => chart.renderData(data))
      .done();

    this.setOffscreenLink();
  }

  protected setOffscreenLink(): void {
    const subject = (context.subject === 'music') ? 'MUS' : 'VIS';
    const subscale = (context.subject === 'music') ? 'MUSRP' : 'VISRP';
    const link = 'https://nces.ed.gov/nationsreportcard/naepdata/report.aspx'
      + `?p=2-${subject}-2-20163,20083-${subscale}-TOTAL-NT-PC_P1,PC_P2,PC_P5,PC_P7,PC_P9-Y_J-0-0-5`;

    $('<div>', { class: 'off-screen' })
      .text('See the accessible version of this chart in the NAEP Data Explorer: ')
      .append($('<a>', { href: link }).text(link))
      .insertAfter(this.$('.figure__title'));
  }
}
