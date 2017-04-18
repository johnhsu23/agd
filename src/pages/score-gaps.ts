import Page from 'views/page';
import DefaultSection from 'views/default-section';

import context from 'models/context';

import ScoreGapsFigure from 'pages/score-gaps/gaps-figure';
import TaskBarFigure from 'pages/score-gaps/bar-figure';
import GroupsFigure from 'pages/score-gaps/groups-figure';
import NotesSourcesView from 'views/notes-sources';

import * as respondingCommentary from 'json!commentary/score-gaps/responding.json';
import * as creatingTaskCommentary from 'json!commentary/score-gaps/creating-task.json';
import * as studentGroupsCommentary from 'json!commentary/score-gaps/student-groups.json';
import * as gapsMusicNotes from 'text!notes/score-gaps/music.html';
import * as gapsVisualArtsNotes from 'text!notes/score-gaps/visual-arts.html';

export default class ScoreGaps extends Page {
  pageTitle = 'Group Score Gaps';

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.pushSection(new DefaultSection({
      inner: new ScoreGapsFigure({
        share: {
          download: true,
          section: 'section-1',
          message: 'Gap between White and Hispanic students narrowed compared to 2008',
        },
      }),
      commentary: respondingCommentary[context.subject],
    }));

    this.pushSection(new DefaultSection({
      inner: new GroupsFigure({
        share: {
          download: true,
          section: 'section-2',
          message: 'Gap between White and Hispanic students narrowed compared to 2008',
        },
      }),
      commentary: studentGroupsCommentary[context.subject],
    }));

    if (context.subject !== 'music') {
      this.pushSection(new DefaultSection({
        inner: new TaskBarFigure({
          share: {
            download: true,
            section: 'section-3',
            message: 'Gap between White and Hispanic students narrowed compared to 2008',
          },
        }),
        commentary: creatingTaskCommentary[context.subject],
      }));
    }

    this.showChildView('footer', new NotesSourcesView({
      contents: (context.subject === 'music') ? gapsMusicNotes : gapsVisualArtsNotes,
    }));
  }
}
