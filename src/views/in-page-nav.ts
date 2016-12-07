import {select, selectAll, Selection} from 'd3-selection';
import {Model, EventsHash, history} from 'backbone';
import * as $ from 'jquery';

import configure from 'util/configure';
import D3View from 'views/d3';

import * as template from 'text!templates/in-page-nav.html';

@configure({
  className: 'in-page-nav',
})
export default class InPageNav extends D3View<HTMLDivElement, Model> {
  /**
   * Is the widget open or closed?
   */
  protected open = false;

  /**
   * Did the user click (or tap) the expand toggle?
   *
   * It is assumed that when `this.sticky` is true, `this.open` is also true.
   */
  protected sticky = false;

  /**
   * The computed height of this list.
   *
   * This property is used for the open/close animations.
   */
  protected listHeight: string;

  protected list: Selection<HTMLUListElement, {}, null, void>;

  template = () => template;

  events(): EventsHash {
    return {
      'click a[data-anchor]': 'visitAnchor',
      'click a.in-page-nav__expand': 'onClickToggle',

      // NB. We may wish to filter these out on touch-enabled devices.
      'mouseover': 'onHoverExpand',
      'mouseleave': 'onHoverContract',
    };
  }

  onRender(): void {
    const list = this.select<HTMLUListElement>('.in-page-nav__list'),
          frag = history.getFragment();

    selectAll('.section').each(function () {
      const elt = select(this),
            title = elt.select('.section__title').text(),
            anchor = elt.attr('id');

      list.append('li')
        .append('a')
        .attr('href', `#/${frag}?section=${anchor}`)
        .attr('data-anchor', anchor)
        .text(title);
    });

    this.list = list;
    this.onScroll();
  }

  onAttach(): void {
    const list = this.list;

    this.listHeight = list.style('height');

    list.style('max-height', '0px')
      .style('overflow', 'hidden');
  }

  protected visitAnchor(event: JQueryEventObject): void {
    event.preventDefault();

    const anchor = $(event.target).data('anchor'),
          position = $('#' + anchor).offset().top;

    $(window).scrollTop(position);
  }

  protected expand(): void {
    this.list.interrupt()
      .transition()
      .style('max-height', this.listHeight)
      .on('end', () => {
        this.open = true;
        this.list.classed('is-expanded', true);
      });
  }

  protected contract(): void {
    this.list.interrupt()
      .transition()
      .style('max-height', '0px')
      .on('end', () => {
        this.open = false;
        this.list.classed('is-expanded', false);
      });
  }

  protected onClickToggle(event: JQueryMouseEventObject): void {
    event.preventDefault();

    if (this.open && !this.sticky) {
      // Special case: if the user hovered over the widget and then clicked the expand link, what we want to have
      // happen is that the widget is forced open. Hence, we set the `sticky' boolean to true and avoid triggering
      // animation.
      this.sticky = true;
      return;
    }

    if (this.open) {
      this.contract();
    } else {
      this.expand();
    }

    this.sticky = !this.sticky;
  }

  protected onHoverExpand(): void {
    // Since the list is already open, we don't need to expand it.
    if (this.sticky) {
      return;
    }

    this.expand();
  }

  protected onHoverContract(): void {
    // If the nav is forced open, don't close it.
    if (this.sticky) {
      return;
    }

    this.contract();
  }

  protected onScroll(): void {
    const scrollTop = $(document).scrollTop(),
          mainTop = $('#main').offset().top,
          isBelowMain = scrollTop > (mainTop - 20);

    const width = $(window).width(),
          breakpoint = width >= 1024 ? 1024 : 768,
          offset = (width - breakpoint) / 2;

    this.$('.in-page-nav__inner')
      .toggleClass('nav-fixed', isBelowMain)
      .css('right', isBelowMain ? offset : '');
  }

  delegateEvents(): this {
    super.delegateEvents();
    $(window).on('scroll.in-page-nav', () => this.onScroll());
    return this;
  }

  undelegateEvents(): this {
    $(window).off('scroll.in-page-nav');
    return super.undelegateEvents();
  }
}
