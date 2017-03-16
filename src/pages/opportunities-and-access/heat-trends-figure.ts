import {default as Figure, FigureOptions} from 'views/figure';
import {Collection} from 'backbone';
import {union} from 'underscore';
import * as $ from 'jquery';

import forwardEvents from 'util/forward-events';
import context from 'models/context';
import Legend from 'models/legend';
import LegendView from 'views/legend';
import {all as gatherNotes} from 'legends/gather';
import {ContextualVariable} from 'data/contextual-variables';
import {getHeatLegendItems} from 'models/legend/heat';

import HeatModel from 'pages/opportunities-and-access/heat-model';
import HeatTable from 'pages/opportunities-and-access/heat-table';
import {load, Result, Data} from 'pages/opportunities-and-access/trends-data';
import * as template from 'text!templates/question-accordion-item-figure.html';

export interface HeatTrendsFigureOptions extends FigureOptions {
  contextualVariable: ContextualVariable;
}

export default class HeatTrendsFigure extends Figure {
  template = () => template;
  protected contextualVariable: ContextualVariable;

  protected table: HeatTable;
  protected tableData = new Collection;
  protected legendCollection = new Collection;

  constructor(options: HeatTrendsFigureOptions) {
    super(options);

    this.contextualVariable = options.contextualVariable;
  }

  delegateEvents(): this {
    super.delegateEvents();

    // Events triggered via triggerMethod() do not propagate downwards by default.
    forwardEvents(this, 'visibility:visible', 'visibility:hidden');

    return this;
  }

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.table = new HeatTable({
      collection: this.tableData,
      variableName: 'Year',
      contextualVariable: this.contextualVariable,
    });

    this.showContents(this.table);
    this.showLegend(new LegendView({
      collection: this.legendCollection,
    }));

    this.$('.figure__heading')
      .text('Percentage Trends');
    this.setOffscreenLink();

    load(this.contextualVariable)
      .then(result => this.loaded(result))
      .done();
  }

  protected loaded(results: Result[]): void {
    const models: HeatModel[] = [];
    models.length = results.length;

    for (const result of results) {
      const index = results.indexOf(result);
      let model = models[index];
      if (!model) {
        model = models[index] = new HeatModel;
      }

      model.data = [];
      model.label = result.key;
      model.contextualVariable = this.contextualVariable;

      for (const datum of result.values) {
        model.data.push({
          value: datum.targetvalue,
          sig: datum.sig,
          errorFlag: datum.TargetErrorFlag,
          isStatDisplayable: (datum.isTargetStatDisplayable !== 0),
        });
      }
    }

    this.buildLegend(results);
    this.tableData.reset(models);
    this.setTitle(this.makeTitle());
  }

  protected makeTitle(): string {
    return `Percentage distribution of eighth-grade students assessed in NAEP ${context.subject}`
      + `, by ${this.contextualVariable.title}: 2008 and 2016`;
  }

  protected buildLegend(result: Result[]): void {
    let legends: Legend[] = getHeatLegendItems();

    let data: Data[] = [];

    // populate our data array
    result.forEach(item => {
      data = union(data, item.values);
    });

    // add other notes based on error flags
    legends = legends.concat(...gatherNotes(data, row => row.TargetErrorFlag, row => row.sig));

    this.legendCollection.reset(legends);
  }

  protected setOffscreenLink(): void {
    const subject = (context.subject === 'music') ? 'MUS' : 'VIS';
    const subscale = (context.subject === 'music') ? 'MUSRP' : 'VISRP';
    const link = 'https://nces.ed.gov/nationsreportcard/naepdata/report.asp'
      + `?p=2-${subject}-2-20163,20083-${subscale}-${this.contextualVariable.id},TOTAL-NT-RP_RP-Y_J-0-0-5`;

    $('<div>', { class: 'off-screen' })
      .text('See the accessible version of this chart in the NAEP Data Explorer: ')
      .append($('<a>', { href: link }).text(link))
      .insertAfter(this.$('.figure__title'));
  }
}
