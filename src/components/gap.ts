// import * as shape from 'd3-shape';
import * as series from 'components/series';

export type PointInfo<T> = T & {
  /**
   * The numerical value of this record.
   */
  value: number;

  /**
   * Whether or not this record is defined. When omitted, defaults to `true`.
   */
  defined?: boolean;

  /**
   * The position of this record. When omitted, uses the `value` property.
   */
  position?: number;
};

export interface GapSeries<T> extends series.SeriesOutput<T> {
  type: 'focal' | 'target';
}

export type GapPoint<T, Data> = T & {
  /**
   * The numerical value of this record.
   */
  value: number;

  /**
   * The position of this record. This corresponds to the scaled output of `value`.
   */
  position: number;

  /**
   * The location of this record. The location is shared by both the focal and target data points.
   */
  location: number;

  /**
   * Is this record defined?
   */
  defined: boolean;

  /**
   * Is this value the larger of the two?
   */
  above: boolean;

  /**
   * Is this point the focal series point, or the target?
   */
  focal: boolean;

  /**
   * The original value from which this point was computed.
   */
  data: Data;
};

export interface GapOutput<Point, Data> {
  focal: GapSeries<GapPoint<Point, Data>>;
  target: GapSeries<GapPoint<Point, Data>>;
  series: GapSeries<GapPoint<Point, Data>>[];
}

export interface Gap<Point, Data> {
  (data: Data[]): GapOutput<Point, Data>;

  /**
   * Retrieves the function that returns information on the focal data point.
   */
  focal(): (row: Data, index: number) => PointInfo<Point>;
  /**
   * Return information on the focal data point from the data point.
   */
  focal(focal: (row: Data, index: number) => PointInfo<Point>): this;

  /**
   * Retrieves the function that returns information on the target data point.
   */
  target(): (row: Data, index: number) => PointInfo<Point>;
  /**
   * Return information on the target data point from the data point.
   */
  target(focal: (row: Data, index: number) => PointInfo<Point>): this;

  /**
   * Returns the position of the data point.
   *
   * This is almost always the opposite axis as used in the `focal` and `target` accessors. In the specific case of
   * NAEP, this means that `position` computes the x-position (assessment year) and `focal` and `target` compute the
   * y-position (scale score).
   */
  location(): (row: Data, index: number) => number;
  /**
   * Compute the position of the data point.
   *
   * This is almost always the opposite axis as used in the `focal` and `target` accessors. In the specific case of
   * NAEP, this means that `position` computes the x-position (assessment year) and `focal` and `target` compute the
   * y-position (scale score).
   */
  location(location: (row: Data, index: number) => number): this;
}

export default gap;
export function gap<Data>(): Gap<{}, Data>;
export function gap<Point, Data>(): Gap<Point, Data>;
export function gap<Point, Data>(): Gap<Point, Data> {
  type Project<T> = (row: Data, index: number) => T;

  const line = series.series<GapPoint<Point, Data>>()
    .x(d => d.location)
    .y(d => d.position)
    .defined(d => d.defined);

  let focal: Project<PointInfo<Point>> = d => ({ value: (d as any).value } as PointInfo<Point>),
      target: typeof focal = d => ({ value: (d as any).value } as PointInfo<Point>),
      location: Project<number> = d => (d as any).position;

  const gap = ((rows: Data[]): GapOutput<Point, Data> => {
    const focals: GapPoint<Point, Data>[] = [],
          targets: GapPoint<Point, Data>[] = [],
          count = rows.length;

    focals.length = targets.length = count;

    for (let i = 0; i < count; i++) {
      const row = rows[i];

      const focalInfo = focal(row, i) as GapPoint<Point, Data>,
            targetInfo = target(row, i) as GapPoint<Point, Data>,
            pointLocation = location(row, i),
            focalAbove = focalInfo.value > targetInfo.value;

      focalInfo.focal = true;
      focalInfo.above = focalAbove;
      if (focalInfo.position == null) {
        focalInfo.position = focalInfo.value;
      }
      if (focalInfo.defined == null) {
        focalInfo.defined = true;
      }

      targetInfo.focal = false;
      targetInfo.above = !focalInfo.above;
      if (targetInfo.position == null) {
        targetInfo.position = targetInfo.value;
      }
      if (targetInfo.defined == null) {
        targetInfo.defined = true;
      }

      focalInfo.location = targetInfo.location = pointLocation;
      focalInfo.data = targetInfo.data = row;

      focals[i] = focalInfo;
      targets[i] = targetInfo;
    }

    const focalSeries = line(focals) as GapSeries<GapPoint<Point, Data>>;
    focalSeries.type = 'focal';

    const targetSeries = line(targets) as typeof focalSeries;
    targetSeries.type = 'target';

    return {
      focal: focalSeries,
      target: targetSeries,
      series: [
        focalSeries,
        targetSeries,
      ],
    };
  }) as Gap<Point, Data>;

  gap.focal = gapFocal;
  gap.target = gapTarget;
  gap.location = gapLocation;

  return gap;

  function gapFocal(): typeof focal;
  function gapFocal(focal: Project<PointInfo<Point>>): typeof gap;
  function gapFocal(val?: Project<PointInfo<Point>>): typeof focal | typeof gap {
    if (arguments.length) {
      focal = val;
      return gap;
    }

    return focal;
  }

  function gapTarget(): typeof target;
  function gapTarget(target: Project<PointInfo<Point>>): typeof gap;
  function gapTarget(val?: Project<PointInfo<Point>>): typeof focal | typeof gap {
    if (arguments.length) {
      target = val;
      return gap;
    }

    return target;
  }

  function gapLocation(): typeof location;
  function gapLocation(location: Project<number>): typeof gap;
  function gapLocation(val?: Project<number>): typeof location | typeof gap {
    if (arguments.length) {
      location = val;
      return gap;
    }

    return location;
  }
}
