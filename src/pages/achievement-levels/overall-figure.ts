import * as Promise from 'bluebird';
import {Collection, EventsHash} from 'backbone';

import Figure from 'views/figure';
import BaselineSwitcher from 'views/baseline-switcher';
import LegendView from 'views/legend';

import sigDiff from 'legends/sig-diff';
import Model from 'legends/model';
import {all as gatherNotes} from 'legends/gather';

import Chart from 'pages/achievement-levels/overall-chart';
import {group, load, Data} from 'pages/achievement-levels/overall-data';
import context from 'models/context';

import {yearsForGrade} from 'data/assessment-years';
import formatList from 'util/format-list';
import nth from 'util/nth';

export default class OverallFigure extends Figure {
  collection = new Collection<Model>();

  protected chart: Chart = new Chart;
  protected promise: Promise<Data[]> = Promise.resolve(null);

  childEvents(): EventsHash {
    return {
      'baseline:set': 'onBaselineSet',
    };
  }

  protected onBaselineSet(view: {}, baseline: 'basic' | 'proficient'): void {
    this.chart.setBaseline(baseline);

    this.promise
      .then(data => this.loaded(data))
      .done();
  }

  protected makeTitle(): string {
    const {grade} = context;
    const years = formatList(yearsForGrade(grade));

    return `Achievement-level results for ${nth(grade)}-grade students assessed in NAEP science: ${years}`;
  }

  protected resetNotes(data: Data[]): void {
    let notes: Model[] = [];
    if (data.some(row => row.sig === '<' || row.sig === '>')) {
      notes.push(sigDiff());
    }

    notes = notes.concat(...gatherNotes(data, row => row.TargetErrorFlag));
    this.collection.reset(notes);
  }

  protected loaded(data: Data[]): void {
    this.resetNotes(data);
    this.chart.renderData(group(data));
  }

  onBeforeShow(): void {
    this.setTitle(this.makeTitle());
    this.showContents(this.chart);
    this.showControls(new BaselineSwitcher);
    this.showLegend(new LegendView({
      collection: this.collection,
    }));

    this.promise = this.promise.then(() => load(context.grade));

    this.promise
      .then(data => this.loaded(data))
      .done();
  }
}
