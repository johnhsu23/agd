import Page from 'views/page';

import * as template from 'text!templates/homepage.html';

export default class HomepageView extends Page {
  template = () => template;

  onRender(): void {
    this.pageTitle = 'Home';
  }
}
