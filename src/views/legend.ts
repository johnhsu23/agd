import {CollectionView, ItemView} from 'backbone.marionette';
import Legend from 'legends/models/base';

import configure from 'util/configure';

@configure({
  className: 'legend',
})
export default class LegendCollectionView extends CollectionView<Legend, ItemView<Legend>> {
  render(): this {
    super.render();

    this.$el.toggleClass('is-empty', this.collection.isEmpty());

    return this;
  }

  getChildView(legend: Legend): new(...args: any[]) => ItemView<Legend> {
    return legend.getView();
  }
}
