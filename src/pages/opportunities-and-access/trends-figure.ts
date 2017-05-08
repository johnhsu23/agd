import {Collection} from 'backbone';
import {union} from 'underscore';
import * as $ from 'jquery';

import {default as Figure, FigureOptions} from 'views/figure';
import LegendView from 'views/legend';
import Legend from 'models/legend';
import {all as gatherNotes} from 'legends/gather';
import forwardEvents from 'util/forward-events';
import context from 'models/context';
import BarLegend from 'models/legend/bar';
import {ContextualVariable} from 'data/contextual-variables';

import {load, Result, Data} from 'pages/opportunities-and-access/trends-data';
import TrendsChart from 'pages/opportunities-and-access/trends-chart';
import * as template from 'text!templates/question-accordion-item-figure.html';

export interface TrendsFigureOptions extends FigureOptions {
  variable: ContextualVariable;
}

export default class TrendsFigure extends Figure {
  template = () => template;
  protected variable: ContextualVariable;
  protected legendCollection = new Collection;

  constructor(options: TrendsFigureOptions) {
    super(options);

    this.variable = options.variable;
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
    const categories = this.variable.categories.length;
    this.$el
      .toggleClass('u-categories-2', categories === 2)
      .toggleClass('u-categories-3', categories === 3)
      .toggleClass('u-categories-4', categories === 4);

    load(this.variable)
      .then(data => this.loaded(data))
      .then(() => this.removePlaceholder())
      .done();

    this.setTitle(this.makeTitle());
    this.setOffscreenLink();
    this.$('.figure__heading')
      .text('Percentage Trends');

    this.showLegend(new LegendView({
      collection: this.legendCollection,
    }));
  }

  protected loaded(data: Result[]): void {
    this.showContents(new TrendsChart({
      variable: this.variable,
      data: data,
    }));

    this.setTitle(this.makeTitle());

    this.buildLegend(data);
  }

  protected makeTitle(): string {
    return `Percentage distribution of eighth-grade students assessed in NAEP ${context.subject}`
      + `, by ${this.variable.title}: 2008 and 2016`;
  }

  protected buildLegend(result: Result[]): void {
    let legends: Legend[] = this.variable.categories.map((d, i) => {
      return new BarLegend({
        category: i,
        description: d,
      });
    });

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
      + `?p=2-${subject}-2-20163,20083-${subscale}-${this.variable.id},TOTAL-NT-RP_RP-Y_J-0-0-5`;

    $('<div>', { class: 'off-screen' })
      .text('See the accessible version of this chart in the NAEP Data Explorer: ')
      .append($('<a>', { href: link }).text(link))
      .insertAfter(this.$('.figure__title'));
  }
}
