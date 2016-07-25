import * as Promise from 'bluebird';

import Figure from 'views/figure';
import LegendView from 'views/legend';
import significant from 'legends/sig-diff';

import TrendChart from 'pages/average-scores/trend-chart';

import Legend from 'legends/model';
import Collection from 'collections/legend';

import context from 'models/context';
import {yearsForGrade} from 'data/assessment-years';
import formatList from 'util/format-list';
import nth from 'util/nth';

import {Data} from 'api/tuda-acrossyear';
import load from 'pages/average-scores/trend-data';

export default class TrendFigure extends Figure {
  collection = new Collection;

  protected promise = Promise.resolve(void 0);
  protected chart: TrendChart;

  protected makeTitle(): string {
    const {grade} = context;
    const years = formatList(yearsForGrade(grade));

    return `Average scores for ${nth(grade)}-grade students assessed in NAEP science: ${years}`;
  }

  protected gradeChange(): void {
    this.setTitle(this.makeTitle());
    this.promise = load(context.grade)
      .then(data => this.loaded(data));

    this.promise.done();
  }

  protected loaded(data: Data[]): void {
    this.chart.renderSeries([data]);

    const notes: {[key: string]: boolean} = Object.create(null);

    for (const row of data) {
      if (row.sig === '<' || row.sig === '>') {
        notes['sig-diff'] = true;
      }
    }

    const models: Legend[] = [];
    if (notes['sig-diff']) {
      models.push(significant());
    }

    this.collection.reset(models);
  }

  delegateEvents(): this {
    super.delegateEvents();

    this.listenTo(context, 'change:grade', this.gradeChange);

    return this;
  }

  onBeforeShow(): void {
    this.setTitle(this.makeTitle());

    if (!this.chart) {
      this.chart = new TrendChart;
    }

    this.promise = load(context.grade)
      .then(data => {
        this.showContents(this.chart);

        this.showLegend(new LegendView({
          collection: this.collection,
        }));

        return data;
      })
      .then(data => this.loaded(data));

    this.promise.done();
  }
}
