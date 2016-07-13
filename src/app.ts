import * as $ from 'jquery';
import {Application} from 'backbone.marionette';
import Figure from 'pages/average-scores/percentile-figure';

$(() => {
  const app = new Application;

  app.on('start', () => {
    const figure = new Figure({
      el: '#figure',
    });

    figure.setTitle('Something something chart title...');

    figure.render();
    figure.triggerMethod('show');
  });

  app.start();
});
