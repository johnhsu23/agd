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
          category = model.category;

    let categoryLabel = variable.categories[category],
        shouldIndent = false;

    if (variable === studentGroupsById['SCHTYPE']) {
      // rename the school type categories for this table only
      if (category === 1) {
        categoryLabel = 'Private';
      } else if (category === 2) {
        categoryLabel = 'Catholic';
        // indent 'Catholic' label to show as subset of 'Private'
        shouldIndent = true;
      }
    }

    $('<th>', { scope: 'row' })
      .text(categoryLabel)
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
