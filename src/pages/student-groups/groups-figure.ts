import Figure from 'views/figure';
import {EventsHash} from 'backbone';

import nth from 'util/nth';

import Table from 'pages/student-groups/groups-table';
import GroupsSelector from 'pages/student-groups/groups-selector';

import * as vars from 'data/variables';

export default class GroupsFigure extends Figure {
  protected variable: vars.Variable = vars.SDRACE;
  protected table: Table;

  render(): any {
    if (super.onRender) {
      super.render();
    }

    this.showControls(new GroupsSelector);

    const variable = this.variable;
    this.table = new Table({ variable });
    this.showContents(this.table);
    this.setTitle(this.makeTitle());
  }

  childEvents(): EventsHash {
    return {
      'scoreTrends:select': 'onChildScoreTrendsSelect',
    };
  }

  onChildScoreTrendsSelect(view: GroupsSelector, variable: vars.Variable): void {
    if (this.variable !== variable) {
      this.variable = variable;
      this.table.setVariable(this.variable);
      this.table.updateRows();
      this.setTitle(this.makeTitle());
    }
  }

  protected makeTitle(): string {
    const grade = 8;

    return `Percentage distribution of students assessed in ${nth(grade)}-grade NAEP arts, by ${this.variable.name}`;
  }
}
