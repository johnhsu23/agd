import {Behavior} from 'backbone.marionette';
import {EventsHash} from 'backbone';

export default class AccordionBehavior extends Behavior {
  events(): EventsHash {
    return {
      'click [data-accordion-header]': 'accordionToggle',
    };
  }

  protected accordionToggle(event: JQueryMouseEventObject): void {
    this.$('> [data-accordion-contents]').slideToggle();
    this.$el.toggleClass('is-expanded');

    this.$('.accordion__header__button')
        .text(this.$el.hasClass('is-expanded') ? 'Hide' : 'Show');

    event.preventDefault();
  }
}
