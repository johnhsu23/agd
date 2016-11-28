import {Model} from 'backbone';
import {ItemView} from 'backbone.marionette';
import {load, Data} from 'pages/score-gaps/gaps-data/trends';
import * as template from 'text!templates/score-results.html';

export default class AverageResults extends ItemView<Model> {
  template = () => template;

  protected loaded(data: Data[]) : void {
    const targetvalue = Math.round(data[0].targetvalue),
          focalvalue = Math.round(data[0].focalvalue);

    this.$('[data-score=2008]').text(targetvalue);
    this.$('[data-score=2016]').text(focalvalue);
  }

  onRender(): void {
    load('TOTAL', 0, 0)
      .then(data => this.loaded(data))
      .done();
  }
}
