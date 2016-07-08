import View from 'views/d3';

export default class Chart<T> extends View<any> {
  width(width: number): this;
  width(): number;
  width(width?: number): number | this {
    if (arguments.length) {
      this.d3el.style('width', width + 'px');
      return this;
    }

    return this.$el.width();
  }

  height(height: number): this;
  height(): number;
  height(height?: number): number | this {
    if (arguments.length) {
      this.d3el.style('height', height + 'px');
      return this;
    }

    return this.$el.height();
  }
}

Chart.prototype.tagName = 'svg';
Chart.prototype.className = 'chart';
(Chart.prototype as any).template = false;