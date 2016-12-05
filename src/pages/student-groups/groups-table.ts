import {defaults} from 'underscore';

import {TableView, TableViewOptions} from 'views/table';

import configure from 'util/configure';

import GroupsModel from 'pages/student-groups/groups-model';
import GroupsHeader from 'pages/student-groups/groups-header';
import RowView from 'pages/student-groups/groups-row';

interface GroupsTableOptions extends TableViewOptions<GroupsModel> {}

@configure({
  className: 'table table--groups',
  childView: RowView as { new(...args: any[]): RowView },
})
export default class GroupsTable extends TableView<GroupsModel, RowView> {
  constructor(options: GroupsTableOptions) {
    options = defaults(options, { headerClass: GroupsHeader });

    super(options);
  }
}
