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

/**
 * Create a scale break appropriate for a vertically-oriented axis.
 */
export function vertical(selection: Selection<number>): void {
  selection.each(function (pos) {
    const elt = d3.select(this);

    elt.attr({
      d: path,
      transform: `translate(0, ${pos}) rotate(${verticalRotation})`,
    })
    .style('stroke-dasharray', width + ' ' + height);
  });
}
