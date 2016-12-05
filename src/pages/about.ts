import Page from 'views/page';

import * as template from 'text!templates/about.html';

export default class AboutView extends Page {
  template = () => template;

  pageTitle = 'About';
}
