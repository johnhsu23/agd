import Figure from 'views/figure';
import {Collection, EventsHash} from 'backbone';

import nth from 'util/nth';

import Table from 'pages/student-groups/groups-table';
import GroupsSelector from 'pages/student-groups/groups-selector';
import GroupsModel from 'pages/student-groups/groups-model';
import {Data} from 'pages/student-groups/groups-data';
import {load} from 'pages/student-groups/groups-data';

import Model from 'legends/model';
import sigDiff from 'legends/sig-diff';
import {all as gatherNotes} from 'legends/gather';
import LegendView from 'views/legend';

import * as template from 'text!templates/groups-figure.html';

import * as vars from 'data/variables';

export default class GroupsFigure extends Figure {
  protected variable: vars.Variable = vars.SDRACE;
  protected table: Table;
  legendCollection = new Collection([]);

  template = () => template;

  render(): any {
    if (super.onRender) {
      super.render();
    }

    this.showControls(new GroupsSelector);

    this.table = new Table({});
    this.showContents(this.table);

    this.updateTable();

    this.showLegend(new LegendView({
      collection: this.legendCollection,
    }));
  }

  childEvents(): EventsHash {
    return {
      'scoreTrends:select': 'onChildScoreTrendsSelect',
    };
  }

  onChildScoreTrendsSelect(view: GroupsSelector, variable: vars.Variable): void {
    if (this.variable !== variable) {
      this.variable = variable;
      this.updateTable();
    }
  }

  protected updateTable(): void {
    const variable = this.variable;

    load(variable)
      .then(rows => {
        const models: GroupsModel[] = [];
        models.length = variable.categories.length;

        for (const row of rows) {
          let model = models[row.categoryindex];
          if (!model) {
            model = models[row.categoryindex] = new GroupsModel;
          }

          model.variable = variable;
          model.category = row.categoryindex;

          model.set(row.targetyear + '-' + row.stattype, row);
        }

        this.resetNotes(rows);
        this.table.collection.reset(models);
        this.setTitle(this.resetTitle());

        return models;
      })
      .done();
  }

  protected resetTitle(): string {
    const grade = 8;

    return `Percentage distribution of students assessed in ${nth(grade)}-grade NAEP arts, by ${this.variable.name}`;
  }

  protected resetNotes(data: Data[]): void {
    let notes: Model[] = [];
    if (data.some(row => row.sig === '<' || row.sig === '>')) {
      notes.push(sigDiff());
    }

    notes = notes.concat(...gatherNotes(data, row => row.TargetErrorFlag));

    this.legendCollection.reset(notes);
  }
}
