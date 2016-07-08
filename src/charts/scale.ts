import * as d3 from 'd3';

export interface ScaleOptions {
  /**
   * The minimum and maximum values for this scale.
   */
  domain: [number, number];
  /**
   * If the input domain has defined minima and maxima *and* the extent of the data does not have  
   */
  bounds?: [number, number];
  /**
   * The number of input units (e.g., scale score points) that one interval encompasses.
   */
  interval: number;
  /**
   * The number of output units (e.g., pixels) that one interval encompasses.
   */
  intervalSize: number;
  /**
   * When true, reverses the scale's output range. This is especially useful for
   * vertically-oriented data, since SVG's origin is in the top left corner of the image.
   */
  reverse?: boolean;
}

function resize(domain: [number, number], interval: number): [number, number] {
  const [lo, hi] = domain;

  return [
    Math.floor(lo / interval) * interval,
    Math.ceil(hi / interval) * interval,
  ];
}

export function scale(options: ScaleOptions): d3.scale.Linear<number, number> {
  const {domain, bounds, interval, intervalSize} = options;

  let [lo, hi] = resize(domain, interval);
  if (bounds) {
    lo -= interval;
    hi += interval;
  }

  const range = (hi - lo)/interval;

  let min = 0;
  let max = range * intervalSize;
  if (options.reverse) {
    [min, max] = [max, min];
  }

  return d3.scale.linear()
    .domain([lo, hi])
    .range([min, max]);
}

export default scale;