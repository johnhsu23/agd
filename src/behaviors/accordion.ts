import {Behavior} from 'backbone.marionette';
import {EventsHash} from 'backbone';
import {radio} from 'backbone.wreqr';

export default class AccordionBehavior extends Behavior {
  protected vent = radio.channel('accordion').vent;

  events(): EventsHash {
    return {
      'click [data-accordion-header]': 'accordionToggle',
    };
  }

  protected accordionToggle(event: JQueryMouseEventObject): void {
    // Will this accordion be closing?
    const willClose = this.$el.hasClass('is-expanded');

    this.$('> [data-accordion-contents]').slideToggle(() => {
      // Inform the view to which we are attached when we finish opening or closing.
      const eventName = willClose ? 'closed' : 'opened';
      this.vent.trigger('accordion:' + eventName);
    });
    this.$el.toggleClass('is-expanded');

    this.$('.accordion__show-hide')
        // Mnemonic: if we're closing, show the text that will undo the action
        .text(willClose ? 'Show' : 'Hide');

    // Inform the view to which we are attached what's happening
    const eventName = willClose ? 'close' : 'open';
    this.view.triggerMethod('accordion:' + eventName);

    event.preventDefault();
  }
}
