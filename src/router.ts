import {AppRouter, Object} from 'backbone.marionette';
import {radio} from 'backbone.wreqr';

import context from 'models/context';
import configure from 'util/configure';
import parse from 'util/query-string';

@configure({
  appRoutes: {
    '': 'homepage',
    ':subject/overall-results': 'overallResults',
    ':subject/score-gaps': 'scoreGaps',
    ':subject/sample-questions': 'questionsAnalysis',
    ':subject/opportunities-and-access': 'studentExperiences',
    'about': 'about',
  } as {[key: string]: string},
})
export default class Router extends AppRouter {
  appRoutes: {[key: string]: string};
  controller: Controller;

  execute(callback: Function, args: string[], name: string): void {
    const queryString = args[args.length - 1],
      query = parse(queryString);
    context.anchor = query['anchor'];

    // Find out the active subject
    switch (name) {
      // Explicitly set the subject to `undefined' for these pages
      case 'homepage':
      case 'about':
        context.subject = undefined;
        break;

      // Assume that /:subject/ is the first URL parameter
      default:
        context.subject = args[0] === 'visual-arts' ? 'visual arts' : 'music';
    }

    // Execute route callbacks
    super.execute(callback, args, name);
  };

  initialize(): void {
    this.controller = new Controller();
  };
}

class Controller extends Object {
  protected page = radio.channel('page').vent;
  protected nav = radio.channel('secondary-nav').vent;

  protected showPage(page: string): void {
    this.page.trigger('page', 'pages/' + page, context.subject);

    if (context.subject) {
      this.nav.trigger('show', page);
    } else {
      this.nav.trigger('hide');
    }
  }

  homepage(): void {
    this.showPage('homepage');
  }

  overallResults(): void {
    this.showPage('overall-results');
  }

  scoreGaps(): void {
    this.showPage('score-gaps');
  }

  questionsAnalysis(): void {
    this.showPage('sample-questions');
  }

  studentExperiences(): void {
    this.showPage('opportunities-and-access');
  }

  about(): void {
    this.showPage('about');
  }
}
