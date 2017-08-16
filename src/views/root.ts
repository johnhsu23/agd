import {radio} from 'backbone.wreqr';
import {LayoutView} from 'backbone.marionette';
import {Model} from 'backbone';
import * as $ from 'jquery';

import noTemplate from 'util/no-template';
import * as analytics from 'util/analytics';
import Page from 'views/page';
import SiteHeader from 'views/site-header';
import SiteFooter from 'views/site-footer';
// import SecondaryNav from 'views/secondary-nav';
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
      // 'secondary-nav': '#secondary-nav',
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
    // this.showChildView('secondary-nav', new SecondaryNav());
  }

  protected changePage(path: string): void {
    // Using dynamic require here to avoid front-loading every page and its supporting modules
    // (we'll have r.js include them, of course)
    // tslint:disable-next-line:no-require-imports
    require([path], (mod: { default: { new(): Page} }) => {
      let subjectTitle = '';

      switch (context.subject) {
        case 'visual arts':
          subjectTitle = ' Visual Arts -';
          break;

        case 'music':
          subjectTitle = ' Music -';
          break;
      }

      const pageView = new mod.default;

      pageView.once('attach', () => {
        if (context.accordion) {
          // Get accordion element and set our initial positioning.
          const accordion = $(`[data-naepid="${context.accordion}"]`);
          const position = accordion.offset().top;

          // Trigger click event to open the accordion.
          accordion.find('[data-accordion-header]').click();

          // Opps & Access page share links will give anchor as well.
          if (context.anchor) {
            const section = accordion.find(`.accordion__chart--${context.anchor}`);

            const channel = radio.channel('accordion');
            channel.vent.on('accordion:opened', function() {
              // Get position of specific section in this accordion.
              const position = section.position().top;
              $(window).scrollTop(position);

              // Reset here so we don't get weird behavior if a user tries to open other accordions.
              channel.reset();
            });
          } else {
            // have page scroll to the position
            $(window).scrollTop(position);
          }
        } else if (context.anchor) {
          const section = $('#' + context.anchor),
              position = section.position().top;

          $(window).scrollTop(position);
        }
      });

      this.showChildView('main', pageView);
      document.title = `NAEP - 2016 Arts Assessment -${subjectTitle} ${pageView.pageTitle}`;

      analytics.push('_trackEvent', 'Page Change', 'Changed', document.title, path);
    });
  }
}
