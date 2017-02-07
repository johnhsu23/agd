import {ItemView} from 'backbone.marionette';
import * as $ from 'jquery';

import configure from 'util/configure';
import noTemplate from 'util/no-template';
import {formatValue} from 'codes';
import {studentGroupsById} from 'data/variables';

import GroupsModel from 'pages/score-gaps/groups-model';
import {Data} from 'pages/score-gaps/groups-data';

const keys = [
  '2008-RP',
  '2016-RP',
  '2008-MN',
  '2016-MN',
];

@noTemplate
@configure({
  tagName: 'tr',
})
export default class RowView extends ItemView<GroupsModel> {
  render(): this {
    super.render();

    const model = this.model,
          variable = model.variable,
          category = model.category,
          shouldIndent = (variable === studentGroupsById['SCHTYPE'] && category === 2);

    $('<th>', { scope: 'row' })
      .text(variable.categories[category])
      .toggleClass('indent', shouldIndent)
      .appendTo(this.$el);

    for (const key of keys) {
      const data = model.get(key) as Data,
            row = $('<td>');

      if (data) {
        row.text(formatValue(data.targetvalue, data.sig, data.TargetErrorFlag));
      }

      row.appendTo(this.$el);
    }

    return this;
  }
}
