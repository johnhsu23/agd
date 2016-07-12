import * as d3 from 'd3';
import * as $ from 'jquery';

import {Model} from 'backbone';
import {ItemView} from 'backbone.marionette';

class D3View<TModel extends Model> extends ItemView<TModel> {
  template: boolean;
  d3el: d3.Selection<any>;

  _createElement(tagName: string): Element {
    const result = d3.ns.qualify(tagName);

    if (typeof result === 'string') {
      return document.createElement(result);
    } else {
      return document.createElementNS(result.space, result.local);
    }
  }

  _setAttributes(attributes: {[key: string]: string}): void {
    this.d3el.attr(attributes);
  }

  setElement(el: any, delegate?: boolean): this {
    super.setElement(el, delegate);

    if (el instanceof $) {
      this.d3el = d3.select(el[0]);
    } else if (el instanceof d3.selection) {
      this.d3el = el;
    } else {
      this.d3el = d3.select(el);
    }

    return this;
  }

  select(selector: string): d3.Selection<any> {
    return this.d3el.select(selector);
  }

  selectAll(selector: string): d3.Selection<any> {
    return this.d3el.selectAll(selector);
  }
}

export default D3View;
