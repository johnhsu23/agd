import {default as Figure, FigureOptions} from 'views/figure';
import {EventsHash, Collection} from 'backbone';
import {union} from 'underscore';
import * as $ from 'jquery';

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
import * as template from 'text!templates/question-accordion-item-figure.html';

export interface GroupFigureOptions extends FigureOptions {
  contextualVariable: ContextualVariable;
}

export default class GroupFigure extends Figure {
  template = () => template;

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

    // Signal that we're not using the full gamut of category colors (if need be).
    const categories = this.contextualVariable.categories.length;
    this.$el
      .toggleClass('u-categories-2', categories === 2)
      .toggleClass('u-categories-3', categories === 3)
      .toggleClass('u-categories-4', categories === 4);

    this.chart = new GroupChart({
      variable: this.variable,
      contextualVariable: this.contextualVariable,
    });
    this.$('.figure__heading')
      .text('Percentages by Student Group');

    // set up empty off-screen div after chart title
    $('<div>', { class: 'off-screen' })
      .insertAfter(this.$('.figure__title'));
    this.setOffscreenLink();

    this.showControls(new VariableSelector({ variables: vars.studentGroups }));
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
      this.setOffscreenLink();

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
