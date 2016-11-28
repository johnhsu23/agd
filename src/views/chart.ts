import {Model} from 'backbone';
import {Selection} from 'd3-selection';
import View from 'views/d3';

import configure from 'util/configure';
import noTemplate from 'util/no-template';

interface Margins {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

@noTemplate
@configure({
  tagName: 'svg',
  className: 'chart',
})
export default class Chart<TModel extends Model> extends View<SVGSVGElement, TModel> {
  protected marginLeft = 0;
  protected marginRight = 0;
  protected marginTop = 0;
  protected marginBottom = 0;

  protected innerWidth = 0;
  protected innerHeight = 0;

  protected getMargins(): Margins {
    return {
      left: this.marginLeft,
      right: this.marginRight,
      top: this.marginTop,
      bottom: this.marginBottom,
    };
  }

  protected setMargins(margins: Margins): void {
    const {left, right, top, bottom} = margins;

    if (left != null) {
      this.marginLeft = +left;
    }
    if (right != null) {
      this.marginRight = +right;
    }
    if (top != null) {
      this.marginTop = +top;
    }
    if (bottom != null) {
      this.marginBottom = +bottom;
    }
  }

  protected inner: Selection<SVGGElement, {}, null, void>;

  render(): this {
    super.render();

    if (!this.inner) {
      this.inner = this.d3el.append<SVGGElement>('g')
        .classed('chart__inner', true);
    }

    this.inner
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`);

    return this;
  }

  margins(): Margins;
  margins(margins: Margins): this;
  margins(margins?: Margins): Margins | this {
    if (arguments.length) {
      this.setMargins(margins);
      return this.resize();
    }

    return this.getMargins();
  }

  protected computeWidth(width: number): number {
    return this.marginLeft + this.marginRight + width;
  }

  protected computeHeight(height: number): number {
    return this.marginTop + this.marginBottom + height;
  }

  protected resize(): this {
    const width = this.computeWidth(this.innerWidth),
          height = this.computeHeight(this.innerHeight);

    this.d3el
      .style('width', width + 'px')
      .style('height', height + 'px');

    if (this.inner) {
      this.inner
        .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`);
    }

    return this;
  }

  width(width: number): this;
  width(): number;
  width(width?: number): number | this {
    if (arguments.length) {
      this.innerWidth = width;
      return this.resize();
    }

    return this.innerWidth;
  }

  height(height: number): this;
  height(): number;
  height(height?: number): number | this {
    if (arguments.length) {
      this.innerHeight = height;
      return this.resize();
    }

    return this.innerHeight;
  }
}
