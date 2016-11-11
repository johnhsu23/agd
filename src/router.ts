import {AppRouter, Object} from 'backbone.marionette';
import {radio} from 'backbone.wreqr';

import configure from 'util/configure';

@configure({
  appRoutes: {
    '': 'homepage',
    ':subject/overall-results': 'overallResults',
    ':subject/student-groups': 'studentGroups',
    ':subject/score-gaps': 'scoreGaps',
    ':subject/questions-analysis': 'questionsAnalysis',
    ':subject/student-experiences': 'studentExperiences',
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

  protected showPage(page: string, subject?: string): void {
    this.page.trigger('page', 'pages/' + page, subject);

    if (subject) {
      this.nav.trigger('show', page, subject);
    } else {
      this.nav.trigger('hide');
    }
  }

  homepage(): void {
    this.showPage('homepage');
  }

  overallResults(subject: string): void {
    this.showPage('overall-results', subject);
  }

  studentGroups(subject: string): void {
    this.showPage('student-groups', subject);
  }

  scoreGaps(subject: string): void {
    this.showPage('score-gaps', subject);
  }

  questionsAnalysis(subject: string): void {
    this.showPage('questions-analysis', subject);
  }

  studentExperiences(subject: string): void {
    this.showPage('student-experiences', subject);
  }

  about(): void {
    this.showPage('about');
  }
}
