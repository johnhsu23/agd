import {radio} from 'backbone.wreqr';
import {LayoutView} from 'backbone.marionette';
import {Model, View} from 'backbone';
import noTemplate from 'util/no-template';

import SiteHeader from 'views/site-header';
import configure from 'util/configure';

@noTemplate
@configure({
  el: document.body,
})
export default class RootView extends LayoutView<Model> {
  regions(): {[key: string]: string} {
    return {
      header: 'header',
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
    this.showChildView('header', new SiteHeader);
  }

  protected changePage(path: string): void {
    // Using dynamic require here to avoid front-loading every page and its supporting modules
    // (we'll have r.js include them, of course)
    // tslint:disable-next-line:no-require-imports
    require([path], (mod: { default: typeof View}) => {
      this.showChildView('main', new mod.default);
    });
  }
}
