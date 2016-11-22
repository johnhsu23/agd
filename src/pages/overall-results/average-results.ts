import {Model} from 'backbone';
import {ItemView} from 'backbone.marionette';
import {load, Data} from 'pages/score-gaps/gaps-data/trends';
import * as template from 'text!templates/score-results.html';

export default class AverageResults extends ItemView<Model> {
  template = () => template;

  protected loaded(data: Data[]) : void {
    const d = data;
    const targetvalue = Math.round(d[0].targetvalue);
    const targetyear = d[0].targetyear;
    const focalvalue = Math.round(d[0].focalvalue);
    const focalyear = d[0].focalyear;
    const sig = d[0].sig;
    let sigText = '';

    this.$('.figure__content_avgScore1Year').text(targetyear);
    this.$('.figure__content_avgScore2Year').text(focalyear);
    this.$('.figure__content_avgScore1Value').text(targetvalue);
    this.$('.figure__content_avgScore2Value').text(focalvalue);

    if (sig === '=') {
      sigText = `No significant change in score between ${targetyear} and ${focalyear}`
      + ' <span class="figure__content_avgSigDiff">p &lt; .05</span>';
    } else {
      sigText = `Scores changed significantly between ${targetyear} and ${focalyear}`
      + ' <span class="figure__content_avgSigDiff">p &gt; .05</span>';
    }

    this.$('.figure__content_sigText').html(sigText);

  }

  onRender(): void {
    load('TOTAL', 0, 0)
      .then(data => this.loaded(data))
      .done();
  }
}
