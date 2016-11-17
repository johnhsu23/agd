import {LayoutView} from 'backbone.marionette';
import {Model} from 'backbone';

import noTemplate from 'util/no-template';
import * as vars from 'data/variables';

import GroupsTable from 'pages/student-groups/groups-table';

const variables = [
  vars.SDRACE,
  vars.GENDER,
  vars.SLUNCH3,
];

@noTemplate
export default class GroupsTableList extends LayoutView<Model> {
  count = 0;

  render(): this {
    super.render();

    for (const variable of variables) {
      const div = document.createElement('div');
      div.setAttribute('data-index', '' + this.count);
      this.el.appendChild(div);

      const name = 'item-' + this.count;

      this.addRegion(name, `> [data-index=${this.count}]`);
      this.showChildView(name, new GroupsTable({ variable }));

      this.count++;
    }

    return this;
  }
}
