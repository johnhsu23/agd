import {radio} from 'backbone.wreqr';
import {LayoutView} from 'backbone.marionette';
import {Model} from 'backbone';
import noTemplate from 'util/no-template';

import Page from 'views/page';

import SiteHeader from 'views/site-header';
import SiteFooter from 'views/site-footer';
import SecondaryNav from 'views/secondary-nav';
import configure from 'util/configure';

import context from 'models/context';

@noTemplate
@configure({
  el: document.body,
})
export default class RootView extends LayoutView<Model> {
  regions(): {[key: string]: string} {
    return {
      header: 'header',
      'secondary-nav': '#secondary-nav',
      main: 'main',
      footer: 'footer',
    };
  }

  delegateEvents(): this {
    super.delegateEvents();

    const {vent} = radio.channel('page');
    this.listenTo(vent, 'page', this.changePage);

    return this;
  }

  onRender(): void {
    // We have to dynamically require this script since it's part of an external service
    // Our own version is a stub that outputs the header markup
    // tslint:disable-next-line:no-require-imports
    require(['nrc-header']);

    this.showChildView('header', new SiteHeader);
    this.showChildView('footer', new SiteFooter);
    this.showChildView('secondary-nav', new SecondaryNav());
  }

  protected changePage(path: string, subject?: string): void {
    // Using dynamic require here to avoid front-loading every page and its supporting modules
    // (we'll have r.js include them, of course)
    // tslint:disable-next-line:no-require-imports
    require([path], (mod: { default: typeof Page}) => {
      let subjectTitle: string = '';
      switch (subject) {
        case 'visual-arts':
          subjectTitle = ' Visual Arts -';
          context.subject = 'visual arts';
          break;

        case 'music':
          subjectTitle = ' Music -';
        case undefined:
          // TS doesn't seem to like narrowing here
          context.subject = subject as 'music';
          break;

        default:
          // kaboom
          throw new Error(`Invalid subject name "${subject}"`);
      }
      const pageView = new mod.default;
      this.showChildView('main', pageView);
      document.title = `NAEP - 2016 Arts Assessment -${subjectTitle} ${pageView.pageTitle}`;
    });
  }
}
