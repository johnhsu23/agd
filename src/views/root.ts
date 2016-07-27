import {radio} from 'backbone.wreqr';
import {LayoutView} from 'backbone.marionette';
import {Model} from 'backbone';

import configure from 'util/configure';

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

  protected changePage(path: string): void {
    // Using dynamic require here to avoid front-loading every page and its supporting modules
    // (we'll have r.js include them, of course)
    // tslint:disable-next-line:no-require-imports
    require([path], ({default: View}) => {
      this.showChildView('main', new View);
    });
  }
}
