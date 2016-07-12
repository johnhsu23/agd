import * as $ from 'jquery';

import Legend from 'legends/model';
import LegendView from 'views/legend';
import {EventsHash} from 'backbone';

export default class PercentileLegendView extends LegendView {
  protected setHover(tag: string): void {
    this.$(`[data-tag=${tag}]`)
      .addClass('is-hover');
  }

  protected clearHover(tag: string): void {
    this.$(`[data-tag=${tag}]`)
      .removeClass('is-hover');
  }

  protected setActive(tag: string): void {
    this.$('[data-tag]')
      .each((_, elt) => {
        const $elt = $(elt);
        const eltTag = $elt.data('tag') as string;

        if (eltTag === tag) {
          $elt.removeClass('is-inactive')
            .addClass('is-active');
        } else {
          $elt.removeClass('is-active')
            .addClass('is-inactive');
        }
      });
  }

  protected clearActive(): void {
    this.$('[data-tag]')
      .removeClass('is-active is-inactive');
  }

  initialize(options?: Backbone.ViewOptions<Legend>): void {
    super.initialize(options);

    this.on('child:hover:set', this.setHover, this);
    this.on('child:hover:clear', this.clearHover, this);

    this.on('child:active:set', this.setActive, this);
    this.on('child:active:clear', this.clearActive, this);
  }

  events(): EventsHash {
    return {
      'mouseover [data-tag]': 'hovered',
      'mouseout [data-tag]': 'unhovered',
      'click [data-tag]': 'clicked',
    };
  }

  protected hovered(event: JQueryMouseEventObject): void {
    const $target = $(event.currentTarget),
          tag = $target.data('tag') as string;

    this.triggerMethod('parent:hover:set', tag);
  }

  protected unhovered(event: JQueryMouseEventObject): void {
    const $target = $(event.currentTarget),
          tag = $target.data('tag') as string;

    this.triggerMethod('parent:hover:clear', tag);
  }

  protected clicked(event: JQueryMouseEventObject): void {
    const $target = $(event.currentTarget),
          tag = $target.data('tag') as string;

    if ($target.hasClass('is-active')) {
      this.triggerMethod('parent:active:clear', tag);
    } else {
      this.triggerMethod('parent:active:set', tag);
    }
  }
}
