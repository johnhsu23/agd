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
  protected channel = radio.channel('page');

  protected showPage(path: string, subject?: string): void {
    const {vent} = this.channel;
    vent.trigger('page', path, subject);
    this.updateSecondaryNav(subject);
  }

  protected updateSecondaryNav(subject?: string): void {
    const {vent} = radio.channel('secondary-nav');
    vent.trigger('secondary-nav', subject);
  }

  homepage(): void {
    this.showPage('pages/homepage');
  }

  overallResults(subject: string): void {
    this.showPage('pages/overall-results', subject);
  }

  studentGroups(subject: string): void {
    this.showPage('pages/student-groups', subject);
  }

  scoreGaps(subject: string): void {
    this.showPage('pages/score-gaps', subject);
  }

  questionsAnalysis(subject: string): void {
    this.showPage('pages/questions-analysis', subject);
  }

  studentExperiences(subject: string): void {
    this.showPage('pages/student-experiences', subject);
  }

  about(): void {
    this.showPage('pages/about');
  }
}
