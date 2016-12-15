import Figure from 'views/figure';
import {Collection, EventsHash} from 'backbone';

import LegendView from 'views/legend';
import * as vars from 'data/variables';

import Legend from 'legends/models/base';
import sigDiff from 'legends/sig-diff';
import {all as gatherNotes} from 'legends/gather';

import GroupsTable from 'pages/score-gaps/groups-table';
import VariableSelector from 'views/variable-selector';
import GroupsModel from 'pages/score-gaps/groups-model';
import {Data, load} from 'pages/score-gaps/groups-data';

export default class GroupsFigure extends Figure {
  protected variable = vars.SDRACE;
  protected tableData = new Collection;
  protected legendCollection = new Collection;

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.showControls(new VariableSelector({}));

    this.showContents(new GroupsTable({ collection: this.tableData }));

    this.updateData();

    this.showLegend(new LegendView({
      collection: this.legendCollection,
    }));
  }

  childEvents(): EventsHash {
    return {
      'variable:select': 'onChildScoreTrendsSelect',
    };
  }

  onChildScoreTrendsSelect(_view: VariableSelector, variable: vars.Variable): void {
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
