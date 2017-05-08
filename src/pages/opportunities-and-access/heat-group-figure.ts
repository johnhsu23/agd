import {EventsHash, Collection} from 'backbone';
import {default as Figure, FigureOptions} from 'views/figure';
import {union} from 'underscore';
import {nest} from 'd3-collection';
import {ascending} from 'd3-array';
import * as $ from 'jquery';

import forwardEvents from 'util/forward-events';
import * as analytics from 'util/analytics';
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
import {load, Result, Data} from 'pages/opportunities-and-access/group-data';
import * as template from 'text!templates/question-accordion-item-figure.html';

export interface HeatGroupFigureOptions extends FigureOptions {
  contextualVariable: ContextualVariable;
}

export default class HeatGroupFigure extends Figure {
  template = () => template;
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

    this.$('.figure__heading')
      .text('Percentages by Student Group');

    // set up empty off-screen div after chart title
    $('<div>', { class: 'off-screen' })
      .insertAfter(this.$('.figure__title'));
    this.setOffscreenLink();

    load(this.variable, this.contextualVariable)
      .then(result => this.updateTable(result))
      .then(() => this.removePlaceholder())
      .done();
  }

  childEvents(): EventsHash {
    const events =  {
      'variable:select': 'onChildVariableSelect',
    };
    $.extend(events, super.childEvents());

    return events;
  }

  onChildVariableSelect(_view: VariableSelector, variable: vars.Variable): void {
    if (this.variable !== variable) {
      this.variable = variable;
      this.getChildView('contents')
        .trigger('variable:select', variable);
      this.setTitle(this.makeTitle());
      this.setOffscreenLink();

      analytics.push('_trackEvent', 'Student Group Chart', 'Selection Changed', this.contextualVariable.id,
          this.variable.id);

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

  protected setOffscreenLink(): void {
    const subject = (context.subject === 'music') ? 'MUS' : 'VIS';
    const subscale = (context.subject === 'music') ? 'MUSRP' : 'VISRP';
    // set initial link text and path
    const text = (this.variable === vars.SCHTYPE)
      ? 'See the accessible version of the public/catholic data in the NAEP data explorer: '
      : 'See the accessible version of this chart in the NAEP Data Explorer: ';

    const link = 'https://nces.ed.gov/nationsreportcard/naepdata/report.aspx'
      + `?p=2-${subject}-2-20163-${subscale}-${this.contextualVariable.id},${this.variable.id}-NT-RP_RP-1_Y_J-0-0-37`;

    // empty the off-screen div, then insert contents
    this.$('.off-screen').empty()
      .text(text)
      .append($('<a>', { href: link }).text(link));

    if (this.variable === vars.SCHTYPE) {
      // school types gets an additional link for SCHTYP2
      const schtyp2Link = 'https://nces.ed.gov/nationsreportcard/naepdata/report.aspx'
        + `?p=2-${subject}-2-20163-${subscale}-${this.contextualVariable.id},SCHTYP2-NT-RP_RP-1_Y_J-0-0-37`;

      this.$('.off-screen')
        .append('. See the accessible version of the public/private data in the NAEP data explorer: ')
        .append($('<a>', { href: schtyp2Link }).text(schtyp2Link));
    }
  }
}
