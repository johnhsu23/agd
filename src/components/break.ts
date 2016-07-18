import {Selection} from 'd3';

const width = 18,
      height = 6,
      up = height / -2,
      left = width / -2,
      path = `M${left},${up}h${width}v${height}h${-width}z`;

const verticalRotation = -30;

/*
 * A "break" (short for "scale break") is a small notation indicating that a scale's full
 * range has been truncated. In ASCII, it kinda looks like this: //
 *
 * This marker is really ugly and annoying to draw, so the code to handle it has been
 * abstracted into this module. It is assumed that the only client of this module is the
 * axis component.
 */

export interface Break {
  <T>(selection: Selection<T>): void;

  values(): number[];
  values(values: number[]): this;
}

/**
 * Create a scale break appropriate for a vertically-oriented axis.
 */
export function vertical<T>(): Break {
  let values: number[] = [];

  const breakFn = function <T>(parent: Selection<T>): void {
    const selection = parent.selectAll('.axis__break')
      .data(values);

    selection
      .attr('transform', pos => `translate(0, ${pos}) rotate(${verticalRotation})`);

    selection.enter()
      .append('path')
      .classed('axis__break', true)
      .attr('d', path)
      .attr('transform', pos => `translate(0, ${pos}) rotate(${verticalRotation})`)
      .style('stroke-dasharray', width + ' ' + height);

    selection.exit()
      .remove();
  } as Break;

  breakFn.values = function (value?: number[]): Break | number[] {
    if (arguments.length) {
      values = value.map(Number);
      return breakFn;
    }

    return values;
  } as {
    (): number[];
    (values: number[]): Break;
  };

  return breakFn;
}
