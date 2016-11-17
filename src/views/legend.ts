import {CollectionView} from 'backbone.marionette';
import Legend from 'legends/model';
import LegendItemView from 'views/legend/item';

import TextView from 'views/legend/text';
import PathView from 'views/legend/path';
import NoteView from 'views/legend/note';

import configure from 'util/configure';

@configure({
  className: 'legend',
})
export default class LegendView extends CollectionView<Legend, LegendItemView> {
  render(): this {
    super.render();

    this.$el.toggleClass('is-empty', this.collection.isEmpty());

    return this;
  }

  getChildView(item: Legend): { new(...args: any[]): LegendItemView } {
    switch (item.type) {
      case 'text':
        return TextView;

      case 'path':
        return PathView;

      case 'note':
        return NoteView;
    }
  }
}
