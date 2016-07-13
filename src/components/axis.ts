import makeScale, {Scale, Tick} from 'components/scale';
import {Selection} from 'd3';

export interface Axis {
  (selection: Selection<{}>): void;

  scale(): Scale;
  scale(scale: Scale): this;

  ticks(): Tick[];
  ticks(ticks: Tick[]): this;
}

export function verticalLeft(): Axis {
  type Setter<T> = {
    (): T;
    (value: T): Axis;
  }

  let ticks: Tick[] = [],
      scale = makeScale();

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

  return axis;
}
