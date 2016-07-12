import * as $ from 'jquery';
import Figure from 'pages/average-scores/percentile-scores';

$(() => {
  const figure = new Figure({
    el: '#figure',
  });

  figure.setTitle('Something something chart title...');

  figure.render();
  figure.triggerMethod('show');
});
