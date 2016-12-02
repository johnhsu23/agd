import Page from 'views/page';

import * as template from 'text!templates/homepage.html';
import * as homepageNotes from 'text!notes/homepage.html';
import NotesSourcesView from 'views/notes-sources';

export default class HomepageView extends Page {
  template = () => template;

  pageTitle = 'Home';

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.showChildView('footer', new NotesSourcesView({
      contents: homepageNotes,
    }));
  }
}
