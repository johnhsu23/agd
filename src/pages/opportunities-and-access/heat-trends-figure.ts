import {default as Figure, FigureOptions} from 'views/figure';
import {Collection} from 'backbone';
import {union} from 'underscore';

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

export interface HeatTrendsFigureOptions extends FigureOptions {
  contextualVariable: ContextualVariable;
}

export default class HeatTrendsFigure extends Figure {
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

    load(this.contextualVariable)
      .then(result => this.loaded(result))
      .done();
  }

  protected loaded(results: Result[]): void {
    const models: HeatModel[] = [];
    models.length = results.length;

    // probably a better way to get the index of item in the results array, but until then...
    let i = 0;

    for (const result of results) {
      let model = models[i];
      if (!model) {
        model = models[i] = new HeatModel;
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

      i++;
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
}
