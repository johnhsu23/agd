import {AppRouter, Object} from 'backbone.marionette';
import {radio} from 'backbone.wreqr';

import configure from 'util/configure';

@configure({
  appRoutes: {
    '': 'homepage',
    'average-scores': 'averageScores',
    'achievement-levels': 'achievementLevels',
  } as {[key: string]: string},
})
export default class Router extends AppRouter {
  appRoutes: {[key: string]: string};
  controller: Controller;

  initialize(): void {
    this.controller = new Controller();
  };
}

class Controller extends Object {
  protected channel = radio.channel('page');

  protected showPage(path: string): void {
    const {vent} = this.channel;
    vent.trigger('page', path);
  }

  homepage(): void {
    this.showPage('pages/homepage');
  }

  averageScores(): void {
    this.showPage('pages/average-scores');
  }

  achievementLevels(): void {
    this.showPage('pages/achievement-levels');
  }
}
