import {Selection} from 'd3';
import View from 'views/d3';

interface Margins {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

export default class Chart<T> extends View<any> {
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

  protected inner: Selection<any>;

  render(): this {
    super.render();

    if (!this.inner) {
      this.inner = this.d3el.append('g')
        .classed('.chart__inner', true);
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

  protected resize(): this {
    const {marginLeft: left, marginTop: top} = this;

    const width = this.innerWidth + left + this.marginRight;
    const height = this.innerHeight + top + this.marginBottom;

    this.d3el.style({
      width: width + 'px',
      height: height + 'px',
    });

    if (this.inner) {
      this.inner
        .attr('transform', `translate(${left}, ${top})`);
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

Chart.prototype.tagName = 'svg';
Chart.prototype.className = 'chart';
(Chart.prototype as any).template = false;
