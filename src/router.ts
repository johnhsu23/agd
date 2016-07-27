import {AppRouter} from 'backbone.marionette';
import {radio} from 'backbone.wreqr';

import configure from 'util/configure';

@configure({
  appRoutes: {
    'average-scores': 'averageScores',
  } as {[key: string]: string},
})
export default class Router extends AppRouter {
  appRoutes: {[key: string]: string};
  controller: Controller;

  initialize(): void {
    this.controller = new Controller();
  };
}

class Controller extends Marionette.Object {
  protected channel = radio.channel('page');

  protected showPage(path: string): void {
    const {vent} = this.channel;
    vent.trigger('page', path);
  }

  averageScores(): void {
    this.showPage('pages/average-scores');
  }
}
