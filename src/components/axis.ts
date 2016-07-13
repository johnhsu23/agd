import makeScale, {Scale, Tick} from 'components/scale';
import {Selection} from 'd3';

type Format = (n: number) => string;

export interface Axis {
  /**
   * Draw the axis on the specified selection (should be an SVG grouping element).
   */
  (selection: Selection<{}>): void;

  /**
   * Return the scale tied to this axis.
   */
  scale(): Scale;
  /**
   * Tie a scale to this axis. This informs the positions of the tick marks as well
   * as the default values of the ticks.
   */
  scale(scale: Scale): this;

  /**
   * Return the array of tick marks that will be used by this scale.
   */
  ticks(): Tick[];
  /**
   * Override the tick marks for this axis. To revert to the scale's own tick marks,
   * pass `null' to this method.
   */
  ticks(ticks: Tick[]): this;

  /**
   * Return the tick label formatter for this axis.
  */
  format(): Format;
  /**
   * Set the formatter for this axis. Formatters are passed the tick mark's label
   * and are expected to return a string.
   */
  format(format: Format): this;
}

const tickLength = 5;

function defaultFormat(n: number): string {
  return '' + n;
}

export function horizontalBottom(): Axis {
  type Setter<T> = {
    (): T;
    (value: T): Axis;
  }

  let ticks: Tick[] = [],
      scale = makeScale(),
      format = defaultFormat;

  const axis = function (selection: Selection<{}>): void {
    selection
      .classed('axis axis--horizontal-bottom', true);

    let line = selection.select('.axis__line');
    if (line.empty()) {
      line = selection.append('line')
        .classed('axis__line', true);
    }

    const range = scale.range();

    line.attr({
      x1: range[0],
      y1: 0,
      x2: range[1],
      y2: 0,
    });

    const groups = selection.selectAll('.axis__tick')
      .data(ticks || scale.ticks());

    groups.select('.axis__label')
      .text(tick => format(tick.label));

    const enter = groups.enter()
      .append('g')
      .classed('axis__tick', true)
      .attr('transform', tick => `translate(${tick.value}, 0)`);

    enter.append('line')
      .classed('axis__mark', true)
      .attr({
        x1: 0,
        y1: 0,
        x2: 0,
        y2: tickLength,
      });

    enter
      .append('text')
      .classed('axis__label', true)
      .text(tick => format(tick.label))
      .attr({
        x: 0,
        y: 0,
        dy: '1em',
      });

  } as Axis;

  axis.ticks = function (value?: Tick[]): Tick[] | Axis {
    if (arguments.length) {
      ticks = value;
      return axis;
    }

    return ticks;
  } as Setter<Tick[]>;

  axis.scale = function (value?: Scale): Scale | Axis {
    if (arguments.length) {
      scale = value;
      return axis;
    }

    return scale;
  } as Setter<Scale>;

  axis.format = function (value?: Format): Format | Axis {
    if (arguments.length) {
      format = value || defaultFormat;
      return axis;
    }

    return format;
  } as Setter<Format>;

  return axis;
}

export function verticalLeft(): Axis {
  type Setter<T> = {
    (): T;
    (value: T): Axis;
  }

  let ticks: Tick[] = [],
      scale = makeScale(),
      format = defaultFormat;

  const axis = function (selection: Selection<{}>): void {
    selection
      .classed('axis axis--vertical-left', true);

    let line = selection.select('.axis__line');
    if (line.empty()) {
      line = selection.append('line')
        .classed('axis__line', true);
    }

    const range = scale.range();

    line.attr({
      x1: 0,
      y1: range[0],
      x2: 0,
      y2: range[1],
    });

    const groups = selection.selectAll('.axis__tick')
      .data(ticks);

    groups.select('.axis__label')
      .text(tick => tick.label)
      .attr('y', tick => tick.value);

    groups.select('.axis__line')
      .attr({
        y1: tick => tick.value,
        y2: tick => tick.value,
      });

    const enter = groups.enter()
      .append('g')
      .classed('axis__tick', true);

    enter.append('line')
      .classed('axis__mark', true)
      .attr({
        x1: 0,
        y1: tick => tick.value,
        x2: -5,
        y2: tick => tick.value,
      });

    enter
      .append('text')
      .classed('axis__label', true)
      .text(tick => tick.label)
      .attr({
        x: 0,
        dx: -7,
        y: tick => tick.value,
        dy: '0.37em',
      });

  } as Axis;

  axis.ticks = function (value?: Tick[]): Tick[] | Axis {
    if (arguments.length) {
      ticks = value;
      return axis;
    }

    return ticks;
  } as Setter<Tick[]>;

  axis.scale = function (value?: Scale): Scale | Axis {
    if (arguments.length) {
      scale = value;
      ticks = scale.ticks();
      return axis;
    }

    return scale;
  } as Setter<Scale>;

  axis.format = function (value?: Format): Format | Axis {
    if (arguments.length) {
      format = value;
      return axis;
    }

    return format;
  } as Setter<Format>;

  return axis;
}
