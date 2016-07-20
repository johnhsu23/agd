import * as $ from 'jquery';
import {Model, EventsHash} from 'backbone';
import {LayoutView} from 'backbone.marionette';

import configure from 'util/configure';
import * as template from 'text!templates/dialog.html';

import {uniqueId, defer} from 'underscore';

@configure({
  className: 'dialog',
  attributes: {
    role: 'dialog',
    tabindex: 0,
  },
})
export default class Dialog<TModel extends Model> extends LayoutView<TModel> {
  template = () => template;

  protected registered = false;
  protected listenId: string;
  protected active: Element;

  events(): EventsHash {
    return {
      'click .dialog__close': 'dismiss',
    };
  }

  setFull(): this {
    this.$el.addClass('dialog--full');
    return this;
  }

  position(position: [number, number]): this {
    const [left, top] = position;
    this.$el.css({
      left,
      top,
    });

    return this;
  }

  protected eventName(prefix: string): string {
    if (!this.listenId) {
      this.listenId = uniqueId('dialog');
    }

    return prefix + '.' + this.listenId;
  }

  protected register(): void {
    if (this.registered) {
      return;
    }

    const focusin = this.eventName('focusin'),
          focusHandler = this.focusChange.bind(this),
          click = this.eventName('click'),
          clickHandler = this.bodyClick.bind(this),
          keydown = this.eventName('keydown'),
          keyHandler = this.bodyKeydown.bind(this);

    // This is a rather circuitous route, but it is written to handle these cases:
    // 1. The dialog is created in response to a 'click' event.
    //    We can't register click event handlers because the event is still bubbling,
    //    which means we'll set it and immediately destroy ourselves because the event target
    //    isn't us.
    // 2. The deferred registration happens _after_ someone has called deregister() on us.
    //    We have to check the flag to make sure we're still supposed to be handling our events.
    defer(() => {
      if (this.registered) {
        $(document)
          .on(focusin, focusHandler)
          .on(click, clickHandler)
          .on(keydown, keyHandler);
      }
    });

    this.registered = true;
  }

  protected deregister(): void {
    if (!this.registered) {
      return;
    }

    $(document)
      .off(this.eventName(''));

    this.registered = false;
  }

  undelegateEvents(): this {
    this.deregister();

    return super.undelegateEvents();
  }

  onBeforeDestroy(): void {
    this.deregister();

    if (this.active) {
      $(this.active).focus();
    }
  }

  /**
   * Handles click events on the document. If the user clicked outside of the dialog,
   * it is dismissed.
   */
  protected bodyClick(event: JQueryMouseEventObject): void {
    if (this.el.contains(event.target)) {
      return;
    }

    this.destroy();
  }

  protected bodyKeydown(event: JQueryKeyEventObject): void {
    if (event.keyCode === 27) {
      this.destroy();
    }
  }

  protected dismiss(event: JQueryMouseEventObject): void {
    event.preventDefault();
    this.destroy();
  }

  /**
   * Maintains a focus ring. When the focus changes to something outside
   */
  protected focusChange(event: JQueryEventObject): void {
    const position = (this.el as Element).compareDocumentPosition(event.target);

    // Same node
    if (position === 0) {
      return;
    }

    // One of us isn't in the main DOM tree, so just bail
    if ((position & Node.DOCUMENT_POSITION_DISCONNECTED) !== 0) {
      return;
    }

    // A child node received focus, so we're okay.
    if ((position & Node.DOCUMENT_POSITION_CONTAINED_BY) !== 0) {
      return;
    }

    // Since we're a ring, if the user reverse-tabs through the elements,
    // then we need to guide them back to the *last* element in the tree.
    // For our purposes, that's the .dialog__close element.
    //
    // Note that since neither 'focus' nor 'focusin' events are cancellable,
    // we have to defer changing the focus until the next event loop tick.
    if ((position & Node.DOCUMENT_POSITION_PRECEDING) !== 0) {
      defer(() => {
        this.$('.dialog__close').focus();
      });
      return;
    }

    // If the user has tabbed past the elements in this dialog,
    // then we need to send them to the first element (which is the
    // dialog proper, in this case).
    //
    // Due to how we set our parent (see `render'), this
    // particular scenario is EXTREMELY unlikely.
    if ((position & Node.DOCUMENT_POSITION_FOLLOWING) !== 0) {
      defer(() => {
        this.$el.focus();
      });
      return;
    }
  }

  render(): this {
    super.render();

    // Store the element that was last active (if any)
    this.active = document.activeElement;
    this.register();

    // Ensure that we are as far to the end of the document order as possible
    // And, more importantly, we are a child of the co
    const el: Element = this.el;
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
    document.body.appendChild(el);

    // Defer the setting of focus.
    // This handles the following chain of events:
    // 1. A dialog is open
    // 2. The user clicks on something that opens up a new dialog
    //
    // If we didn't defer, we'd end up with a sequence of steps like this:
    // 3. The second dialog renders and focuses itself
    // 4. The first dialog sense a 'click' event that has bubbled up to the body, and
    //    dismisses itself -- restoring focus to the element that had focus when it
    //    was rendered.
    //
    // The ordering of #3 and #4 is guaranteed since the first dialog listens to click events
    // on the <body>.
    //
    // Thus, we defer, ensuring that the first dialog is able to set focus and _then_ we set ours.
    defer(() => {
      this.$el.focus();
    });

    return this;
  }
}
