import {zip, svg} from 'd3';
import {View, Collection} from 'backbone';
import {ItemView, Region} from 'backbone.marionette';

import Figure from 'views/figure';
import Chart from 'charts/percentile';
import LegendView from 'views/percentile-legend';

import Legend from 'legends/model';
import significant from 'legends/sig-diff';
import series from 'legends/series';

export default class PercentileScores extends Figure {
  collection: Collection<Legend> = new Collection<Legend>();

  childEvents(): { [key: string]: string } {
    return {
      'parent:hover:set': 'setHover',
      'parent:hover:clear': 'clearHover',
      'parent:active:set': 'setActive',
      'parent:active:clear': 'clearActive',
    };
  }

  protected eachRegion(callback: (region: Region, name: string) => void): void {
    const regions = this.getRegions();

    for (const key of Object.keys(regions)) {
      callback(regions[key], name);
    }
  }

  protected eachChild(callback: (childView: View<any>) => void): void {
    this.eachRegion(region => {
      callback(region.currentView);
    });
  }

  protected setHover(child: ItemView<any>, tag: string) {
    this.eachChild(child => {
      child.trigger('child:hover:set', tag);
    });
  }

  protected clearHover(child: ItemView<any>, tag: string) {
    this.eachChild(child => {
      child.trigger('child:hover:clear', tag);
    });
  }

  protected setActive(child: ItemView<any>, tag: string) {
    this.eachChild(child => {
      child.trigger('child:active:set', tag);
    });
  }

  protected clearActive(child: ItemView<any>, tag: string) {
    this.eachChild(child => {
      child.trigger('child:active:clear');
    });
  }

  protected buildLegend(): void {
    const models: Legend[] = [];

    const names = [
      '10th',
      '25th',
      '50th',
      '75th',
      '90th',
    ].map(d => d + ' Percentile');

    const tags = [
      'p1',
      'p2',
      'p5',
      'p7',
      'p9',
    ];

    const list = zip(svg.symbolTypes, tags, names).reverse();

    for (const [type, tag, description] of list) {
      const legend = series(type, description);

      legend.tag = tag;
      models.push(legend);
    }

    models.push(significant());

    models.push(new Legend({
      type: 'note',
      marker: null,
      description: '[...]',
    }));

    this.collection.reset(models);
  }

  render(): this {
    this.buildLegend();

    super.render();

    this.showChildView('legend', new LegendView({ collection: this.collection }));
    this.showChildView('inner', new Chart);

    return this;
  }
}
