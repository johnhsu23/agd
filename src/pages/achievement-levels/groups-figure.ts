import * as Promise from 'bluebird';

import DefaultFigure from 'views/default-figure';
import LegendView from 'views/legend';
import * as vars from 'data/variables';
import context from 'models/context';
import sigDiff from 'legends/sig-diff';
import Model from 'legends/model';
import {all as gatherNotes} from 'legends/gather';
import Collection from 'collections/legend';

import {load, Data} from 'pages/achievement-levels/groups-data';
import Chart from 'pages/achievement-levels/groups-chart';

export default class Figure extends DefaultFigure {
  collection = new Collection;

  protected promise: Promise<Data[]> = Promise.resolve(null);
  protected variable = vars.GENDER;
  protected chart = new Chart;

  protected loaded(data: Data[]): void {
    this.resetNotes(data);
    this.chart.renderData(data);
  }

  protected resetNotes(data: Data[]): void {
    const notes: Model[] = [];
    if (data.some(row => row.sig === '<' || row.sig === '>')) {
      notes.push(sigDiff());
    }

    notes.push(...gatherNotes(data, row => row.TargetErrorFlag));
    this.collection.reset(notes);
  }

  onGradeChanged(): void {
    this.promise = this.promise.then(() => load(context.grade, this.variable));

    this.promise
      .then(data => this.loaded(data))
      .done();
  }

  onBeforeShow(): void {
    this.showContents(this.chart);
    this.showLegend(new LegendView({
      collection: this.collection,
    }));

    this.onGradeChanged();
  }
}
