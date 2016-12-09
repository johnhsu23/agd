import {defaults} from 'underscore';

import {TableView, TableViewOptions} from 'views/table';

import configure from 'util/configure';

import GroupsModel from 'pages/score-gaps/groups-model';
import GroupsHeader from 'pages/score-gaps/groups-header';
import RowView from 'pages/score-gaps/groups-row';

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
