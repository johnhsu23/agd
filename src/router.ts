import {AppRouter, Object} from 'backbone.marionette';
import {radio} from 'backbone.wreqr';

import configure from 'util/configure';

@configure({
  appRoutes: {
    '': 'homepage',
    ':subject/overall-results(?anchor=:anchor)': 'overallResults',
    ':subject/score-gaps(?anchor=:anchor)': 'scoreGaps',
    ':subject/questions-analysis(?anchor=:anchor)': 'questionsAnalysis',
    ':subject/student-experiences(?anchor=:anchor)': 'studentExperiences',
    'about': 'about',
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
  protected page = radio.channel('page').vent;
  protected nav = radio.channel('secondary-nav').vent;

  protected showPage(page: string, subject?: string, anchor?: string): void {
    this.page.trigger('page', 'pages/' + page, subject, anchor);

    if (subject) {
      if (anchor) {
        this.nav.trigger('show', page, subject, anchor);
      } else {
        this.nav.trigger('show', page, subject);
      }
    } else {
      this.nav.trigger('hide');
    }
  }

  homepage(): void {
    this.showPage('homepage');
  }

  overallResults(subject: string, anchor: string): void {
    this.showPage('overall-results', subject, anchor);
  }

  scoreGaps(subject: string, anchor: string): void {
    this.showPage('score-gaps', subject, anchor);
  }

  questionsAnalysis(subject: string, anchor: string): void {
    this.showPage('questions-analysis', subject, anchor);
  }

  studentExperiences(subject: string, anchor: string): void {
    this.showPage('student-experiences', subject, anchor);
  }

  about(): void {
    this.showPage('about');
  }
}
