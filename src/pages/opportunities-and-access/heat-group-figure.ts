import {EventsHash, Collection} from 'backbone';
import {FigureOptions} from 'views/figure';
import {union} from 'underscore';
import {nest} from 'd3-collection';
import {ascending} from 'd3-array';

import forwardEvents from 'util/forward-events';
import context from 'models/context';
import Legend from 'models/legend';
import LegendView from 'views/legend';
import {all as gatherNotes} from 'legends/gather';
import * as vars from 'data/variables';
import VariableSelector from 'views/variable-selector';
import {ContextualVariable} from 'data/contextual-variables';
import {getHeatLegendItems} from 'models/legend/heat';

import QuestionAccordionItemFigure from 'pages/opportunities-and-access/question-accordion-item-figure';
import HeatModel from 'pages/opportunities-and-access/heat-model';
import HeatTable from 'pages/opportunities-and-access/heat-table';
import {load, Result, Data} from 'pages/opportunities-and-access/group-data';

export interface HeatGroupFigureOptions extends FigureOptions {
  contextualVariable: ContextualVariable;
}

export default class HeatGroupFigure extends QuestionAccordionItemFigure {
  protected variable = vars.SDRACE;
  protected contextualVariable: ContextualVariable;

  protected table: HeatTable;
  protected tableData = new Collection;
  protected legendCollection = new Collection;

  constructor(options: HeatGroupFigureOptions) {
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
      variableName: this.variable.name,
      contextualVariable: this.contextualVariable,
    });

    this.showControls(new VariableSelector({ variables: vars.studentGroups }));
    this.showContents(this.table);
    this.showLegend(new LegendView({
      collection: this.legendCollection,
    }));

    this.setHeading('Percentages by Student Group');

    load(this.variable, this.contextualVariable)
      .then(result => this.updateTable(result))
      .done();
  }

  childEvents(): EventsHash {
    return {
      'variable:select': 'onChildVariableSelect',
    };
  }

  onChildVariableSelect(_view: VariableSelector, variable: vars.Variable): void {
    if (this.variable !== variable) {
      this.variable = variable;
      this.getChildView('contents')
        .trigger('variable:select', variable);
      this.setTitle(this.makeTitle());

      load(this.variable, this.contextualVariable)
        .then(results => this.updateTable(results))
        .done();
    }
  }

  protected updateTable(results: Result[]): void {
    // Reorder the data if this is SCHTYPE since we are actually pulling from both SCHTYPE and SCHTYP2.
    if (this.variable.id === 'SCHTYPE') {
      results = nest<Result>()
        .sortValues((a, b) => ascending(this.variable.categories.indexOf(a.key),
          this.variable.categories.indexOf(b.key)))
        .entries(results);
    }

    const models: HeatModel[] = [];
    models.length = this.variable.categories.length;

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
          value: datum.value,
          sig: datum.sig,
          errorFlag: datum.errorFlag,
          isStatDisplayable: (datum.isStatDisplayable !== 0),
        });
      }
    }

    this.buildLegend(results);
    this.tableData.reset(models);
    this.setTitle(this.makeTitle());
  }

  protected makeTitle(): string {
    return `Percentage distribution of eighth-grade students assessed in NAEP ${context.subject}`
      + `, by ${this.variable.title} and ${this.contextualVariable.title}: 2016`;
  }

  protected buildLegend(results: Result[]): void {
    let legends: Legend[] = getHeatLegendItems();

    let data: Data[] = [];

    // populate our data array
    for (const item of results) {
      data = union(data, item.values);
    }

    // add notes based one error flags
    legends = legends.concat(...gatherNotes(data, row => row.errorFlag, row => row.sig));

    this.legendCollection.reset(legends);
  }
}
