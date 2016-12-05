import Figure from 'views/figure';
import {Collection, EventsHash} from 'backbone';

import LegendView from 'views/legend';
import * as vars from 'data/variables';

import Legend from 'legends/model';
import sigDiff from 'legends/sig-diff';
import {all as gatherNotes} from 'legends/gather';

import GroupsTable from 'pages/student-groups/groups-table';
import GroupsSelector from 'pages/student-groups/groups-selector';
import GroupsModel from 'pages/student-groups/groups-model';
import {Data, load} from 'pages/student-groups/groups-data';

export default class GroupsFigure extends Figure {
  protected variable: vars.Variable = vars.SDRACE;
  protected tableData: Collection<GroupsModel> = new Collection([]);
  legendCollection: Collection<Legend> = new Collection([]);

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.showControls(new GroupsSelector);

    this.showContents(new GroupsTable({ collection: this.tableData }));

    this.updateData();

    this.showLegend(new LegendView({
      collection: this.legendCollection,
    }));
  }

  childEvents(): EventsHash {
    return {
      'group:select': 'onChildScoreTrendsSelect',
    };
  }

  onChildScoreTrendsSelect(view: GroupsSelector, variable: vars.Variable): void {
    if (this.variable !== variable) {
      this.variable = variable;
      this.updateData();
    }
  }

  protected updateData(): void {
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
        this.tableData.reset(models);
        this.setTitle(this.makeTitle());

        return models;
      })
      .done();
  }

  protected makeTitle(): string {
    return `Percentage distribution of students assessed in eighth-grade NAEP arts, by ${this.variable.name}`;
  }

  protected resetNotes(data: Data[]): void {
    let notes: Legend[] = [];
    if (data.some(row => row.sig === '<' || row.sig === '>')) {
      notes.push(sigDiff());
    }

    notes = notes.concat(...gatherNotes(data, row => row.TargetErrorFlag));

    this.legendCollection.reset(notes);
  }
}
