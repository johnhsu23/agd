import * as $ from 'jquery';
import {EventsHash, ViewOptions} from 'backbone';
import {ItemView} from 'backbone.marionette';

import {context, Context} from 'models/context';
import configure from 'util/configure';
import * as template from 'text!templates/grade-switcher.html';

@configure({
  className: 'grade-switcher',
  modelEvents: {
    'change:grade': 'changedGrade',
  },
  attributes: {
    role: 'radiogroup',
  },
  template: () => template,
})
export default class Switcher extends ItemView<Context> {
  template: () => string;

  constructor(options?: ViewOptions<Context>) {
    options = $.extend({ model: context }, options);
    super(options);
  }

  render(): this {
    super.render();

    this.changedGrade(this.model);

    return this;
  }

  protected radioClick(event: JQueryMouseEventObject): void {
    this.model.grade = +$(event.currentTarget).data('grade');
  }

  protected radioKeydown(event: JQueryKeyEventObject): void {
    const code = event.keyCode;
    // Don't process key presses for anything other than Enter or Space
    if (code !== 13 && code !== 32) {
      return;
    }

    event.preventDefault();
    this.model.grade = +$(event.currentTarget).data('grade');
  }

  protected changedGrade(model: Context): void {
    const grade = model.grade;

    this.$('[data-grade]')
      .each((i, elt) => {
        const $elt = $(elt),
              value = +$elt.data('grade'),
              checked = value === grade;
        $elt.attr('aria-checked', '' + checked);
      });
  }

  events(): EventsHash {
    return {
      'click [role=radio]': 'radioClick',
      'keydown [role=radio]': 'radioKeydown',
    };
  }
}
