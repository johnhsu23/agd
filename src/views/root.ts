import {radio} from 'backbone.wreqr';
import {LayoutView} from 'backbone.marionette';
import {Model} from 'backbone';
import * as $ from 'jquery';

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

  protected changePage(path: string): void {
    // Using dynamic require here to avoid front-loading every page and its supporting modules
    // (we'll have r.js include them, of course)
    // tslint:disable-next-line:no-require-imports
    require([path], (mod: { default: { new(): Page} }) => {
      let subjectTitle = '';

      if (context.subject) {
        switch (context.subject) {
          case 'visual arts':
            subjectTitle = ' Visual Arts -';
            break;

          case 'music':
            subjectTitle = ' Music -';
            break;
        }
      }

      const pageView = new mod.default;

      if (context.anchor) {
        pageView.once('attach', () => {
          const section = $('#' + context.anchor),
              position = section.position().top;

          $(window).scrollTop(position);
        });
      }

      this.showChildView('main', pageView);
      document.title = `NAEP - 2016 Arts Assessment -${subjectTitle} ${pageView.pageTitle}`;
    });
  }
}
