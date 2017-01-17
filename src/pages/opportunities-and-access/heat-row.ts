import {ItemView} from 'backbone.marionette';
import * as $ from 'jquery';

import configure from 'util/configure';
import noTemplate from 'util/no-template';
import {formatValue, isRoundsToZero} from 'codes';

import {default as HeatModel, Data} from 'pages/opportunities-and-access/heat-model';

@noTemplate
@configure({
  tagName: 'tr',
})
export default class HeatRowView extends ItemView<HeatModel> {
  render(): this {
    super.render();

    const model = this.model,
      label = model.label,
      contextualVariable = model.contextualVariable,
      dataArray = model.data;

    $('<th>', { scope: 'row' })
      .text(label)
      .appendTo(this.$el);

    for (const index of contextualVariable.categories.map((_, i) => i)) {
      const data = dataArray[index],
        row = $('<td>');

      if (data) {
        row.text(formatValue(data.value, data.sig, data.errorFlag));
        row.addClass(this.getValueClass(data));
      }

      if (dataArray.some(data => data.isStatDisplayable)) {
        // data is available in the array, simply append and keep going
        row.appendTo(this.$el);
      } else {
        // no data is available, set colspan of data cell, append and return early
        row.attr('colspan', contextualVariable.categories.length);
        row.appendTo(this.$el);
        return this;
      }
    }

    return this;
  }

  // helper function to get the necessary class based on value
  protected getValueClass(data: Data): string {
    const value = Math.round(data.value);
    let classString = 'table__cell--';

    if (value === 0 || isRoundsToZero(data.errorFlag) || !data.isStatDisplayable) {
      return classString += 'zero';
    } else if (value < 10) {
      return classString += 'lt10';
    } else if (value < 20) {
      return classString += 'gt10';
    } else if (value < 30) {
      return classString += 'gt20';
    } else if (value < 40) {
      return classString += 'gt30';
    } else if (value < 50) {
      return classString += 'gt40';
    } else {
      return classString += 'gt50';
    }
  }
}
