import * as $ from 'jquery';
import {Application} from 'backbone.marionette';
import Page from 'pages/average-scores';

$(() => {
  const app = new Application;

  app.on('start', () => {
    const page = new Page({
      el: '#main',
    });

    page.render();
    page.triggerMethod('before:show');
    page.triggerMethod('show');
  });

  app.start();
});
