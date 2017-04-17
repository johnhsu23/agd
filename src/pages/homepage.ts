import {EventsHash} from 'backbone';
import * as $ from 'jquery';

import Page from 'views/page';
import Dialog from 'views/dialog';
import Glossary from 'views/glossary';
import ShareView from 'views/share';
import * as share from 'models/share';

import * as template from 'text!templates/homepage.html';
import * as homepageNotes from 'text!notes/homepage.html';
import NotesSourcesView from 'views/notes-sources';

export default class HomepageView extends Page {
  template = () => template;

  pageTitle = 'Home';

  events(): EventsHash {
    return {
      'click [data-subject]': 'switchSubject',
      'click a[href^="#/"]': 'historyHash',
      'click a[data-glossary-term]': 'glossaryTerm',
    };
  }

  protected glossaryTerm(event: JQueryMouseEventObject): void {
    event.preventDefault();

    const target = $(event.target),
          term = target.data('glossary-term'),
          position = target.offset();

    const dialog = new Dialog;

    // set up our dialog box
    dialog
      .position([position.left, position.top])
      .render();

    // create and insert glossary term
    dialog.$('.dialog__contents')
      .html(new Glossary({term}).render().el);

    // append dialog box to the page
    this.$el.append(dialog.$el);

    if (target.parents('.dialog').length) {
      target.parents('.dialog').remove();
    }
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
    window.scroll(0, 0);
  }

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.showChildView('footer', new NotesSourcesView({
      contents: homepageNotes,
    }));

    // Since all of our sections are hardcoded in the homepage template, we need
    // to add share regions and render them here once the template has loaded.
    // One per section.
    this.$('.section').each((i) => {
      const section = i + 1;

      this.addRegion(`share_${section}`, `#section-${section} .section__share`);

      this.showChildView(`share_${section}`, new ShareView({
          model: new share.ShareModel({
          section: `section-${section}`,
          message: 'Sixty-three percent of eighth-graders took a music class; 42 percent took an art class in 2016',
        }),
      }));
    });
  }
}
