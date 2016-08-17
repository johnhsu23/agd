import {select, selection, Selection, namespace} from 'd3-selection';
import * as $ from 'jquery';

import {Model} from 'backbone';
import {ItemView} from 'backbone.marionette';

class D3View<TElement extends Element, TModel extends Model> extends ItemView<TModel> {
  d3el: Selection<TElement, {}, null, void>;

  _createElement(tagName: string): Element {
    const result = namespace(tagName);

    if (typeof result === 'string') {
      return document.createElement(result);
    } else {
      return document.createElementNS(result.space, result.local);
    }
  }

  _setAttributes(attributes: {[key: string]: string}): void {
    const elt = this.d3el;

    for (const k of Object.keys(attributes)) {
      elt.attr(k, attributes[k]);
    }
  }

  setElement(el: any, delegate?: boolean): this {
    super.setElement(el, delegate);

    if (el instanceof $) {
      this.d3el = select(el[0]);
    } else if (el instanceof selection) {
      this.d3el = el;
    } else {
      this.d3el = select(el);
    }

    return this;
  }

  select<Child extends Element>(selector: string): Selection<Child, {}, null, void> {
    return this.d3el.select<Child>(selector);
  }

  selectAll<Child extends Element, OldDatum>(selector: string): Selection<Child, OldDatum, TElement, {}> {
    return this.d3el.selectAll<Child, OldDatum>(selector);
  }
}

export default D3View;
