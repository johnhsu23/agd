import {ItemView} from 'backbone.marionette';
import {Model, EventsHash} from 'backbone';
import * as $ from 'jquery';

import configure from 'util/configure';

import * as template from 'text!templates/nrc-header.html';
import * as stylesheet from 'text!templates/nrc-header.css';

@configure({
  className: 'header__top',
})
class NrcHeader extends ItemView<Model> {
  template = () => template;

  protected selected: JQuery;

  events(): EventsHash {
    return {
      'mouseenter .nav-heading': 'navHoverIn',
      'mouseleave .nav-heading': 'navHoverOut',
      'mouseout .sub-nav': 'navMouseout',
      'focus .nav-heading, .nav-heading a': 'navFocus',
    };
  }

  protected navHoverIn(event: JQueryEventObject): void {
    const item = $(event.target).closest('.nav-item');

    if (item.hasClass('selected')) {
      item.removeClass('selected');
      this.selected = item;
    }

    item.addClass('hover');
  }

  protected navHoverOut(event: JQueryEventObject): void {
    this.$('.nav-item')
      .removeClass('hover')
      .find('.sub-nav')
      .removeClass('open focus');

    if (this.selected) {
      this.selected.addClass('selected');
    }
  }

  protected navMouseout(event: JQueryEventObject): void {
    $(event.target).removeClass('open focus');
  }

  protected navFocus(event: JQueryEventObject): void {
    this.$('.nav-item, .sub-nav').removeClass('open');

    $(event.target).closest('.nav-item')
      .addClass('open')
      .find('.sub-nav')
      .addClass('open');
  }

  onRender(): void {
    this.$('nav').accessibleMegaMenu({
      // prefix for generated unique id attributes, which are required
      //   to indicate aria-owns, aria-controls and aria-labelledby
      uuidPrefix: 'accessible-megamenu',

      // css class used to define the megamenu styling
      menuClass: 'nav-menu',

      // css class for a top-level navigation item in the megamenu
      topNavItemClass: 'nav-item',

      // css class for a megamenu panel
      panelClass: 'sub-nav',

      // css class for a group of items within a megamenu panel
      panelGroupClass: 'sub-nav-group',

      // css class for the hover state
      hoverClass: 'hover',

      // css class for the focus state
      focusClass: 'focus',

      // css class for the open state
      openClass: 'open',
    });
  }
}

@configure({
  tagName: 'style',
})
class NrcStyleSheet extends ItemView<Model> {
  template = () => stylesheet;
}

$(() => {
  const stylesheet = new NrcStyleSheet;
  stylesheet.render();

  document.head.appendChild(stylesheet.el);

  const header = new NrcHeader;
  header.render();

  document.body.insertBefore(header.el, document.body.firstChild);
});
