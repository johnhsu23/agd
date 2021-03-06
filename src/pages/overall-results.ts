import {EventsHash} from 'backbone';

import Page from 'views/page';
import DefaultSection from 'views/default-section';

import context from 'models/context';

import PercentileFigure from 'pages/overall-results/percentile-figure';
import AverageFigure from 'pages/overall-results/average-figure';
import RespondingFigure from 'pages/overall-results/responding-figure';
import NotesSourcesView from 'views/notes-sources';

import * as averageCommentary from 'json!commentary/overall-results/average.json';
import * as percentilesCommentary from 'json!commentary/overall-results/percentiles.json';
import * as respondingTaskCommentary from 'json!commentary/overall-results/responding-task.json';
import * as overallMusicNotes from 'text!notes/overall-results/music.html';
import * as overallVisualArtsNotes from 'text!notes/overall-results/visual-arts.html';

export default class AverageScores extends Page {
  pageTitle = 'Overall Results';

  events(): EventsHash {
    return {
      'click .js-footer': 'scrollToFooter',
    };
  }

  onBeforeShow(): void {
    this.pushSection(new DefaultSection({
      inner: new AverageFigure({
        share: {
          section: 'section-1',
          message: `Average ${context.subject} `
            + 'responding score for eighth-graders not significantly different compared to 2008',
        },
        placeholderHeight: 156,
      }),
      commentary: averageCommentary[context.subject],
    }));

    this.pushSection(new DefaultSection({
      inner: new PercentileFigure({
        share: {
          download: true,
          section: 'section-2',
          message: `Average ${context.subject} `
            + 'responding score for eighth-graders not significantly different compared to 2008',
        },
        placeholderHeight: 470,
      }),
      commentary: percentilesCommentary[context.subject],
    }));

    if (context.subject !== 'music') {
      this.pushSection(new DefaultSection({
        inner: new RespondingFigure({
          share: {
            download: true,
            section: 'section-3',
            message: `Average ${context.subject} `
              + 'responding score for eighth-graders not significantly different compared to 2008',
          },
          placeholderHeight: 430,
        }),
        commentary: respondingTaskCommentary[context.subject],
      }));
    }

    this.showChildView('footer', new NotesSourcesView({
      contents: (context.subject === 'music') ? overallMusicNotes : overallVisualArtsNotes,
    }));
  }
}
