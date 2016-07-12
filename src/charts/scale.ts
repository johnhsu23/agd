import {interpolate, deinterpolate} from 'math/interpolate';

export interface Scale {
  /**
   * Transform the given value in the input domain to the output range.
   */
  (x: number): number;

  /**
   * Given a value in the output range, convert it back to the input range.
   */
  invert(y: number): number;

  /**
   * Return the domain passed to this scale.
   */
  domain(): [number, number];
  /**
   * Set the domain for this scale. Note that the domain values are rescaled based
   * on the `interval' parameter.
   */
  domain(domain: [number, number]): this;

  /**
   * Return the bounds for this scale.
   */
  bounds(): [number, number];
  /**
   * Set the bounds for this scale. A scale's (optional) bounds denote the actual
   * maximum and minimum for a given input domain.
   *
   * The scale will ensure that enough space is given in the output range to
   * accommodate a break marker.
   * 
   * By way of example: if a scale has bounds [0, 100] but the domain is only
   * [20, 80], then the scale will ensure that 0 and 100 have output points (see the
   * `ticks' method).
   */
  bounds(bounds: [number, number]): this;

  /**
   * Returns the interval for this scale.
   */
  interval(): number;
  /**
   * Sets the interval for this scale. The interval is the number of input domain 
   * units between each axis tick mark.
   */
  interval(interval: number): this;

  /** 
   * Returns the interval size for this scale.
   */
  intervalSize(): number;
  /**
   * Sets the interval size for this scale. This is the number of output range units
   * between each axis tick mark.
   */
  intervalSize(intervalSize: number): this;

  /** 
   * Returns the output offset.
   */
  offset(): number;
  /**
   * Sets the output offset. The output range is defined to begin with this offset 
   * value, which defaults to zero. Set to another value to, e.g., accommodate 
   * padding from some known value.
   */
  offset(offset: number): this;

  /**
   * Force the scale to reverse the output domain.
   * 
   * This is equivalent to calling scale.reversed(true).
   */
  reverse(): this;

  /**
   * Returns true if the scale's output range is in reverse order.
   */
  reversed(): boolean;
  /**
   * Set the `reversed' status of this scale. This is useful for vertical output,
   * since SVG's coordinate system begins with 0 at the top left, which runs counter
   * to the origin used in most graphs.
   */
  reversed(reversed: boolean): this;

  /**
   * Return the computed output range.
   */
  range(): [number, number];

  /** 
   * Returns an array of values corresponding to break marker positions.
   */
  breaks(): number[];

  /**
   * Returns an array of tick marks. The first value is the domain value 
   * corresponding to this tick mark, which can be thought of as the label. The 
   * second value is the range value corresponding to this tick mark -- the position 
   * of the mark.
   * 
   * In general, the label and position correspond logically with each other unless 
   * the scale's bounds have been set. In that case, the first and last values have 
   * positions that may not correspond with what the scale would otherwise compute.
   */
  ticks(): Array<[number, number]>;
}

export function scale(): Scale {
  type Pair = [number, number];
  type Setter<T> = {
    (): T;
    (value: T): Scale;
  };

  // We have to store `inputDomain' (a copy of the user's actual input in order to
  // avoid us from creating a situation in which changing the interval creates
  // an unexpected rescaling of the domain:
  //
  //   let s = scale().interval(0.5).domain([0, 0.5]);
  //   s.interval(1);   // domain now [0, 1]
  //   s.interval(0.5); // domain still [0, 1]
  //
  // This is, admittedly, something of an edge case, but it's an edge case
  // nonetheless.
  let inputDomain: Pair = [0, 1], 
      domain: Pair = [0, 1],
      range: Pair = [0, 1],
      bounds: Pair = null,
      offset = 0,
      interval = 1,
      intervalSize = 1,
      reversed = false;

  const scale = function (value: number): number {
    const t = deinterpolate(domain[0], domain[1], value);
    return interpolate(range[0], range[1], t);
  } as Scale;

  scale.domain = function (value?: Pair): Scale | Pair {
    if (arguments.length) {
      inputDomain = value.map(n => +n) as Pair;
      domain = null;
      return recompute();
    }

    return domain;
  } as Setter<Pair>;

  scale.bounds = function (value?: Pair): Scale | Pair {
    if (arguments.length) {
      bounds = value.map(n => +n) as Pair;
      return recompute();
    }

    return bounds;
  } as Setter<Pair>;

  scale.interval = function (value?: number): Scale | number {
    if (arguments.length) {
      interval = +value;
      return recompute();
    }

    return interval;
  } as Setter<number>;

  scale.intervalSize = function (value?: number): Scale | number {
    if (arguments.length) {
      intervalSize = +value;
      return recompute();
    }

    return interval;
  } as Setter<number>;

  scale.offset = function (value?: number): Scale | number {
    if (arguments.length) {
      offset = +value;
      return recompute();
    }

    return offset;
  } as Setter<number>;

  scale.reversed = function (value?: boolean): Scale | boolean {
    if (arguments.length) {
      reversed = !!value;
      return recompute();
    }

    return reversed;
  } as Setter<boolean>;

  scale.reverse = function () {
    return scale.reversed(true);
  };

  scale.range = function () {
    return range;
  };

  scale.ticks = function () {
    const output: Pair[] = [],
          [rangeMin, rangeMax] = range,
          [min, max] = domain;

    for (let pos = min; pos < max; pos += interval) {
      output.push([
        pos,
        scale(pos)
      ]);
    }

    output.push([max, rangeMax]);

    if (bounds) {
      output[0][0] = bounds[0];
      output[output.length - 1][0] = bounds[1];
    }

    return output;
  }

  scale.breaks = function () {
    const output: number[] = [];
    if (!bounds) {
      return output;
    }

    if (domain[0] !== bounds[0]) {
      output.push(domain[0] + interval/2);
    }
    
    if (domain[1] !== bounds[1]) {
      output.push(domain[1] - interval/2);
    }

    return output.map(scale);
  }

  function recompute(): Scale {
    let [lo, hi] = inputDomain;
    lo = Math.floor(lo / interval) * interval;
    hi = Math.ceil(hi / interval) * interval;
    if (bounds) {
      lo = Math.max(lo - interval, bounds[0]);
      hi = Math.min(hi + interval, bounds[1]);
    }
    domain = [lo, hi];

    let intervals = Math.ceil((hi - lo)/interval);
    lo = offset;
    hi = offset + intervals * intervalSize;
    if (reversed) {
      range = [hi, lo];
    } else {
      range = [lo, hi];
    }

    return scale;
  }

  return recompute();
}

export default scale;