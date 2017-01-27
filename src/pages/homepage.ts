import {EventsHash} from 'backbone';
import * as $ from 'jquery';

import Page from 'views/page';

import * as template from 'text!templates/homepage.html';
import * as homepageNotes from 'text!notes/homepage.html';
import NotesSourcesView from 'views/notes-sources';

export default class HomepageView extends Page {
  template = () => template;

  pageTitle = 'Home';

  events(): EventsHash {
    return {
      'click [data-subject]': 'switchSubject',
      'click a[href^="#/about"]': 'historyHash',
    };
  }

  protected switchSubject(): void {
    $('[data-subject]')
      .each((_i, elt) => {
        const $elt = $(elt),
          checked = $elt.hasClass('checked'),
          subject = $elt.data('subject');
        $elt.attr('aria-checked', '' + !checked)
          .toggleClass('checked');
        $(`.figure--${subject}-percentages`).toggleClass('element-invisible');
      });
  }

  // prevent the page from saving and reloading with current scroll location
  protected historyHash(): void {
    window.location.reload();
  }

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.showChildView('footer', new NotesSourcesView({
      contents: homepageNotes,
    }));
  }
}
