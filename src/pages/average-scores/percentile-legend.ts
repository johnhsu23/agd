import * as $ from 'jquery';

import {CollectionViewOptions} from 'backbone.marionette';

import Legend from 'legends/model';
import LegendView from 'views/legend';
import {EventsHash} from 'backbone';
import {EventAggregator} from 'backbone.wreqr';

export interface PercentileViewOptions extends CollectionViewOptions<Legend> {
  eventHandle: EventAggregator;
}

export default class PercentileLegendView extends LegendView {
  protected eventHandle: EventAggregator;

  constructor(options: PercentileViewOptions) {
    super(options);

    this.eventHandle = options.eventHandle;
    this.listenToHandle();
  }

  protected listenToHandle(): void {
    const handle = this.eventHandle;
    this.listenTo(handle, 'hover:set', this.setHover);
    this.listenTo(handle, 'hover:clear', this.clearHover);
    this.listenTo(handle, 'active:set', this.setActive);
    this.listenTo(handle, 'active:clear', this.clearActive);
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

    this.eventHandle.trigger('hover:set', tag);
  }

  protected unhovered(event: JQueryMouseEventObject): void {
    const $target = $(event.currentTarget),
          tag = $target.data('tag') as string;

    this.eventHandle.trigger('hover:clear', tag);
  }

  protected clicked(event: JQueryMouseEventObject): void {
    const $target = $(event.currentTarget),
          tag = $target.data('tag') as string;

    if ($target.hasClass('is-active')) {
      this.eventHandle.trigger('active:clear', tag);
    } else {
      this.eventHandle.trigger('active:set', tag);
    }
  }
}
