import {LayoutView} from 'backbone.marionette';
import {defer} from 'underscore';

import configure from 'util/configure';

import * as template from 'text!templates/overlay.html';

@configure({
  className: 'overlay',
})
export default class Overlay extends LayoutView<any> {
  template = () => template;

  render(): this {
    super.render();

    defer(() => this.$('.overlay__close').focus());

    return this;
  }

  regions(): { [key: string]: string} {
    return {
      contents: '.overlay__contents',
    };
  }

  position(x: number, y: number): void {
    this.$el.css({
      top: y,
      left: x,
    });
  }
}
