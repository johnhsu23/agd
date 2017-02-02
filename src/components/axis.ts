import {Selection} from 'd3-selection';

import {scale as makeScale, Scale, Tick} from 'components/scale';
import {vertical} from 'components/break';

type Format = (n: number) => string;

export interface Axis {
  /**
   * Draw the axis on the specified selection (should be an SVG grouping element).
   */
  <T, U>(selection: Selection<SVGGElement | SVGSVGElement, T, null, U>): void;

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

  /**
   * Returns the padding in use by this axis.
   */
  padding(): number;

  /**
   * Set the padding for this axis. The axis padding is used to artificially extend
   * the axis line (to account for, e.g., scale offsets).
   */
  padding(padding: number): this;

  /**
   * Set the title of this axis.
   */
  title(title: string | string[]): this;
}

const tickLength = 5;

function defaultFormat(n: number): string {
  return '' + n;
}

type AxisArgs = {
  modifier: string;
  direction: string;

  tickPosition(tick: Tick): [number, number];

  text: {
    dx?: number | string;
    dy?: number | string;
  };

  line: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }
};

function makeAxis(args: AxisArgs): Axis {
  type Setter<T> = {
    (): T;
    (value: T): Axis;
  };

  const modifier = 'axis--' + args.modifier,
        {tickPosition, direction} = args,
        text = args.text,
        line = args.line;

  let ticks: Tick[] = null,
      scale = makeScale(),
      format = defaultFormat,
      padding = 0;

  const axis = function <T, U>(selection: Selection<SVGGElement | SVGSVGElement, T, null, U>): void {
    selection.classed('axis ' + modifier, true);

    let axisLine = selection.select('.axis__line');
    if (axisLine.empty()) {
      axisLine = selection.append('line')
        .classed('axis__line', true);
    }

    let [lo, hi] = scale.range();
    if (lo > hi) {
      [lo, hi] = [hi, lo];
    }

    axisLine
      .attr(direction + '1', lo - padding)
      .attr(direction + '2', hi + padding);

    const tickUpdate = selection.selectAll<SVGGElement, Tick>('.axis__tick')
      .data(ticks || scale.ticks(), tick => '' + tick.label);

    tickUpdate
      .classed('is-exiting', false)
      .interrupt()
      .transition()
      .duration(250)
      .attr('transform', tick => 'translate(' + tickPosition(tick) + ')');

    tickUpdate.select('.axis__label')
      .text(tick => format(tick.label))
      .attr('dx', text.dx)
      .attr('dy', text.dy);

    const tickEnter = tickUpdate.enter()
      .insert('g', undefined)
      .classed('axis__tick', true)
      .attr('transform', tick => 'translate(' + tickPosition(tick) + ')');

    tickEnter.append('line')
      .classed('axis__mark', true)
      .attr('x1', line.x1)
      .attr('x2', line.x2)
      .attr('y1', line.y1)
      .attr('y2', line.y2);

    tickEnter.append('text')
      .classed('axis__label', true)
      .text(tick => format(tick.label))
      .attr('dx', text.dx)
      .attr('dy', text.dy);

    tickUpdate.exit()
      .classed('is-exiting', true)
      .transition()
      .delay(250)
      .remove();

    // Add/remove breaks as needed
    vertical()
      .values(scale.breaks())
      (selection);
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

  axis.padding = function (value?: number): number | Axis {
    if (arguments.length) {
      padding = +value;
      return axis;
    }

    return padding;
  } as Setter<number>;

  let title: string | string[];

  axis.title = function (value?: string | string[]): string | string[] | Axis {
    if (arguments.length) {
      title = value;
      return axis;
    }
    return title;
  } as Setter<string>;

  return axis;
}

export function verticalLeft(): Axis {
  return makeAxis({
    modifier: 'vertical-left',
    tickPosition: tick => [0, tick.value],
    direction: 'y',
    text: {
      dx: -7,
      dy: '0.37em',
    },
    line: {
      x1: 0,
      y1: 0,
      x2: -tickLength,
      y2: 0,
    },
  });
}

export function horizontalBottom(): Axis {
  return makeAxis({
    modifier: 'horizontal-bottom',
    tickPosition: tick => [tick.value, 0],
    direction: 'x',
    text: {
      dy: '1.2em',
    },
    line: {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: tickLength,
    },
  });
}
