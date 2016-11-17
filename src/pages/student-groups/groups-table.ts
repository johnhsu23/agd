import {Collection} from 'backbone';
import {defaults} from 'underscore';

import {TableView, TableViewOptions} from 'views/table';
import {Variable} from 'data/variables';

import configure from 'util/configure';

import GroupsModel from 'pages/student-groups/groups-model';
import GroupsHeader from 'pages/student-groups/groups-header';
import RowView from 'pages/student-groups/groups-row';
import {load} from 'pages/student-groups/groups-data';

interface GroupsTableOptions extends TableViewOptions<GroupsModel> {
  variable: Variable;
}

@configure({
  className: 'table table--groups',
  childView: RowView as { new(...args: any[]): RowView },
})
export default class GroupsTable extends TableView<GroupsModel, RowView> {
  protected variable: Variable;

  constructor(options: GroupsTableOptions) {
    options = defaults(options, { headerClass: GroupsHeader });

    console.log(options);

    super(options);

    this.collection = new Collection<GroupsModel>();
    this.variable = options.variable;
  }

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

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

        return models;
      })
      .then(models => {
        this.collection.reset(models);
      })
      .done();
  }

  render(): this {
    super.render();

    let caption = this.$('caption');
    if (!caption.length) {
      caption = $('<caption>').appendTo(this.$el);
    }

    caption.text(this.variable.name);

    return this;
  }
}
