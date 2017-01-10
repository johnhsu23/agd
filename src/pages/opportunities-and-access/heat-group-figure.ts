import {EventsHash, Collection} from 'backbone';
import {default as Figure, FigureOptions} from 'views/figure';
import {union} from 'underscore';

import forwardEvents from 'util/forward-events';
import context from 'models/context';
import Legend from 'models/legend';
import LegendView from 'views/legend';
import {all as gatherNotes} from 'legends/gather';
import * as vars from 'data/variables';
import VariableSelector from 'views/variable-selector';
import {ContextualVariable} from 'data/contextual-variables';
import {getHeatLegendItems} from 'models/legend/heat';

import HeatModel from 'pages/opportunities-and-access/heat-model';
import HeatTable from 'pages/opportunities-and-access/heat-table';
import {load as groupLoad, Result as GroupResult, Data as GroupData} from 'pages/opportunities-and-access/group-data';
import {load as trendLoad, Data as TrendData} from 'pages/opportunities-and-access/trends-data';

export interface HeatGroupFigureOptions extends FigureOptions {
  contextualVariable: ContextualVariable;
}

export default class HeatGroupFigure extends Figure {
  protected variable = vars.SDRACE;
  protected contextualVariable: ContextualVariable;

  protected trendData: TrendData[];
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

    trendLoad(this.contextualVariable)
      .then(results => {
        // first item in results will be 2016 stack data. assign values to trend data
        this.trendData = results[0].values;
      })
      .done();

    this.updateTable();
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

      this.updateTable();
    }
  }

  protected updateTable(): void {
    groupLoad(this.variable, this.contextualVariable)
      .then(results => {
        const models: HeatModel[] = [];
        models.length = this.variable.categories.length + 1;

        // probably a better way to get the index of item in the results array, but until then...
        let i = 0;

        // insert top level "All Students" data with our 2016 trends data
        let model = models[i];
        if (!model) {
          model = models[i] = new HeatModel;
        }

        model.data = [];
        model.label = 'All Students';
        model.contextualVariable = this.contextualVariable;

        for (const datum of this.trendData) {
          model.data.push({
            value: datum.targetvalue,
            sig: datum.sig,
            errorFlag: datum.TargetErrorFlag,
            isStatDisplayable: (datum.isTargetStatDisplayable !== 0),
          });
        }

        i++;

        // add our group data to the models
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
              value: datum.value,
              sig: datum.sig,
              errorFlag: datum.errorFlag,
              isStatDisplayable: (datum.isStatDisplayable !== 0),
            });
          }

          i++;
        }

        this.buildLegend(results);
        this.tableData.reset(models);
        this.setTitle(this.makeTitle());
      })
      .done();
  }

  protected makeTitle(): string {
    return `Percentage distribution of eighth-grade students assessed in NAEP ${context.subject}`
      + `, by ${this.variable.title} and ${this.contextualVariable.title}: 2016`;
  }

  protected buildLegend(groupResults: GroupResult[]): void {
    let legends: Legend[] = getHeatLegendItems();

    let groupData: GroupData[] = [];

    // populate our data array
    for (const item of groupResults) {
      groupData = union(groupData, item.values);
    }

    // add notes based one error flags
    legends = legends.concat(...gatherNotes(groupData, row => row.errorFlag, row => row.sig));

    this.legendCollection.reset(legends);
  }
}
