import {LayoutView} from 'backbone.marionette';
import {Model} from 'backbone';

import {eachView} from 'util/each-region';

type Forwarder = (...args: any[]) => void;

/**
 * Forwards the named events to each view within the layout view's region.
 *
 * This is intended to be called in a LayoutView's `delegateEvents()` method.
 */
export default function forwardEvents(view: LayoutView<Model>, ...events: string[]): void {
  for (const event of events) {
    view.on(event, makeHandler(view, event));
  }
}

// This function exists separately due to variable capture issues with `const' and ES5 output
function makeHandler(view: LayoutView<Model>, event: string): Forwarder {
  return (...args: any[]) => {
    eachView(view, view => {
      view.triggerMethod(event, ...args);
    });
  };
}
