import * as $ from 'jquery';
import {EventsHash} from 'backbone';
import {Behavior} from 'backbone.marionette';
import {Wreqr} from 'backbone';

function tagOf(target: EventTarget): string {
  return $(target).data('tag');
}

const {vent} = Wreqr.radio.channel('percentile-hover');

export default class HoverBehavior extends Behavior {
  events(): EventsHash {
    return {
      'mouseover [data-tag]': 'mouseover',
      'mouseout [data-tag]': 'mouseout',
      'click [data-tag]': 'clicked',
    };
  }

  initialize(): void {
    this.listenTo(vent, 'hover:set', this.setHover);
    this.listenTo(vent, 'hover:clear', this.clearHover);
    this.listenTo(vent, 'active:set', this.setActive);
    this.listenTo(vent, 'active:clear', this.clearActive);
  }

  protected setHover(tag: string): void {
    this.$(`[data-tag=${tag}]`)
      .addClass('is-hover');
  }

  protected clearHover(tag: string): void {
    this.$(`[data-tag=${tag}]`)
      .removeClass('is-hover');
  }

  protected setActive(tag: string): void {
    this.$(`[data-tag]`)
      .each((_, elt) => {
        const $elt = $(elt),
              eltTag = tagOf(elt);

        $elt
          .toggleClass('is-active', eltTag === tag)
          .toggleClass('is-inactive', eltTag !== tag);
      });
  }

  protected clearActive(tag: string): void {
    this.$('[data-tag]')
      .removeClass('is-active is-inactive');
  }

  protected mouseover(event: JQueryMouseEventObject): void {
    vent.trigger('hover:set', tagOf(event.currentTarget));
  }

  protected mouseout(event: JQueryMouseEventObject): void {
    vent.trigger('hover:clear', tagOf(event.currentTarget));
  }

  protected clicked(event: JQueryMouseEventObject): void {
    const target = event.currentTarget,
          tag = tagOf(target);

    if ($(target).hasClass('is-active')) {
      vent.trigger('active:clear', tag);
    } else {
      vent.trigger('active:set', tag);
    }
  }
}
