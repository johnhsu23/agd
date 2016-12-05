import {ItemView} from 'backbone.marionette';
import {Model, EventsHash, ViewOptions} from 'backbone';

import configure from 'util/configure';

import * as template from 'text!templates/notes-sources.html';

export interface NotesSourcesViewOptions extends ViewOptions<any> {
  contents: string;
}

@configure({
  className: 'note',
})
export default class NotesSourcesView extends ItemView<Model> {
  template = () => template;

  protected contents: string;

  events(): EventsHash {
    return {
      'click a.note__show-hide': 'toggleNoteDisplay',
    };
  }

  constructor(options: NotesSourcesViewOptions) {
    super(options);

    this.contents = options.contents;
  }

  protected toggleNoteDisplay(event: JQueryEventObject): void {
    event.preventDefault();

    this.$('.note__content').slideToggle();
    this.$el.toggleClass('is-expanded');

    const label = this.$el.hasClass('is-expanded') ? 'Hide' : 'Show';
    this.$('.note__show-hide')
    .html(`<span>${label} notes and sources</span>`);
  }

  onRender(): void {
    this.$('.note__content')
      .html(this.contents);
  }
}
