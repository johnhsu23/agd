import {Model, EventsHash} from 'backbone';
import {LayoutView} from 'backbone.marionette';
import {defer} from 'underscore';

import configure from 'util/configure';

import * as template from 'text!templates/overlay.html';

@configure({
  className: 'overlay',
})
export default class Overlay extends LayoutView<Model> {
  template = () => template;

  render(): this {
    super.render();

    defer(() => this.$('.overlay__close').focus());

    return this;
  }

  events(): EventsHash {
    return {
      'click .overlay__close': 'dismiss',
    };
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

  protected dismiss(event: JQueryMouseEventObject): void {
    event.preventDefault();
    this.destroy();
  }
}
