import {Model} from 'backbone';
import {ItemView} from 'backbone.marionette';
import {load, Data} from 'pages/score-gaps/gaps-data/trends';
import * as template from 'text!templates/score-results.html';

export default class AverageResults extends ItemView<Model> {
  template = () => template;

  protected loaded(data: Data[]) : void {
    const d = data;
    const targetvalue = Math.round(d[0].targetvalue);
    const focalvalue = Math.round(d[0].focalvalue);
    const sigText = 'No significant change in score between 2008 and 2016'
      + ' <span class="figure__content_avgSigDiff">p &lt; .05</span>';

    this.$('[data-score=2008]').text(targetvalue);
    this.$('[data-score=2016]').text(focalvalue);
    this.$('.figure__content_sigText').html(sigText);
  }

  onRender(): void {
    load('TOTAL', 0, 0)
      .then(data => this.loaded(data))
      .done();
  }
}
