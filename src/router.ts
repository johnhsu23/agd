import AverageScores from 'pages/average-scores';

export default class Router extends Marionette.AppRouter {
  controller: Controller;

  appRoutes: {
    'average-scores': 'averageScores',
  };

  initialize(): void {
    this.controller = new Controller();
  };
}

class Controller extends Marionette.Object {
  averageScores(): void {
    const page = new AverageScores({
      el: '#main',
    });
    page.render();
    page.triggerMethod('before:show');
    page.triggerMethod('show');
  };
}
