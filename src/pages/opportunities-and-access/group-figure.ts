import {default as Figure, FigureOptions} from 'views/figure';
import {EventsHash, Collection} from 'backbone';
import {union} from 'underscore';

import forwardEvents from 'util/forward-events';
import context from 'models/context';
import Legend from 'models/legend';
import BarLegend from 'models/legend/bar';
import {all as gatherNotes} from 'legends/gather';
import * as vars from 'data/variables';
import {ContextualVariable} from 'data/contextual-variables';
import VariableSelector from 'views/variable-selector';
import LegendView from 'views/legend';

import GroupChart from 'pages/opportunities-and-access/group-chart';
import {load, Result, Data} from 'pages/opportunities-and-access/group-data';

export interface GroupFigureOptions extends FigureOptions {
  contextualVariable: ContextualVariable;
}

export default class GroupFigure extends Figure {
  protected variable = vars.SDRACE;
  protected contextualVariable: ContextualVariable;
  protected legendCollection = new Collection;
  protected chart: GroupChart;

  constructor(options: GroupFigureOptions) {
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

    this.chart = new GroupChart({
      variable: this.variable,
      contextualVariable: this.contextualVariable,
    });

    const studentGroups = vars.studentGroups.map(group => {
      switch (group.id) {
        case 'SLUNCH3':
          return vars.SLUNCH1;
        case 'SCHTYPE':
          return vars.SCHTYP1;
        default:
          return group;
      }
    });

    this.showControls(new VariableSelector({ variables: studentGroups }));
    this.showContents(this.chart);
    this.setTitle(this.makeTitle());
    this.showLegend(new LegendView({
      collection: this.legendCollection,
    }));

    this.updateChart();
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

      this.updateChart();
    }
  }

  protected updateChart(): void {
    load(this.variable, this.contextualVariable)
      .then(data => {
        this.chart.updateData(data);
        this.buildLegend(data);
      })
      .done();
  }

  protected makeTitle(): string {
    return `Percentage distribution of eighth-grade students assessed in NAEP ${context.subject}`
      + `, by ${this.variable.title} and ${this.contextualVariable.title}: 2016`;
  }

  protected buildLegend(result: Result[]): void {
    let legends: Legend[] = this.contextualVariable.categories.map((d, i) => {
      return new BarLegend({
        category: i,
        description: d,
      });
    });

    let data: Data[] = [];

    // populate our data array
    for (const item of result) {
      data = union(data, item.values);
    }

    // add notes based on error flags
    legends = legends.concat(...gatherNotes(data, row => row.errorFlag));

    this.legendCollection.reset(legends);
  }
}
