import Page from 'views/page';
import DefaultSection from 'views/default-section';

import context from 'models/context';

import MultiSection from 'pages/overall-results/multi-section';
import PercentileFigure from 'pages/overall-results/percentile-figure';
import CreatingTasksFigure from 'pages/overall-results/creating-tasks-figure';
import AverageFigure from 'pages/overall-results/average-figure';
import RespondingFigure from 'pages/overall-results/responding-figure';
import NotesSourcesView from 'views/notes-sources';

import * as averageCommentary from 'json!commentary/overall-results/average.json';
import * as percentilesCommentary from 'json!commentary/overall-results/percentiles.json';
import * as creatingTasksCommentary from 'json!commentary/overall-results/creating-tasks.json';
import * as respondingTaskCommentary from 'json!commentary/overall-results/responding-task.json';
import * as overallMusicNotes from 'text!notes/overall-results/music.html';
import * as overallVisualArtsNotes from 'text!notes/overall-results/visual-arts.html';

export default class AverageScores extends Page {
  pageTitle = 'Overall Results';

  onBeforeShow(): void {
    const section = new MultiSection;
    this.pushSection(section);

    section.setCommentary(averageCommentary[context.subject]);
    section.addSection(new AverageFigure, averageCommentary[context.subject]);

    const percentileFigure = new PercentileFigure({
      share: {
        download: true,
      },
    });

    section.addSection(percentileFigure, percentilesCommentary[context.subject]);

    if (context.subject !== 'music') {
      this.pushSection(new DefaultSection({
        inner: new CreatingTasksFigure({
          share: {
            download: true,
          },
        }),
        commentary: creatingTasksCommentary[context.subject],
      }));

      this.pushSection(new DefaultSection({
        inner: new RespondingFigure,
        commentary: respondingTaskCommentary[context.subject],
      }));
    }

    this.showChildView('footer', new NotesSourcesView({
      contents: (context.subject === 'music') ? overallMusicNotes : overallVisualArtsNotes,
    }));
  }
}
