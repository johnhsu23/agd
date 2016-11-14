import * as shape from 'd3-shape';

type Project<T, Out> = (datum: T, index: number) => Out;

type Point<T> = T & {
  x: number;
  y: number;
};

export interface SeriesOutput<T> {
  line: string;
  points: Point<T>[];
}

export interface Series<T> {
  (rows: T[]): SeriesOutput<T>;

  x(): Project<T, number>;
  x(x: number): this;
  x(x: Project<T, number>): this;

  y(): Project<T, number>;
  y(y: number): this;
  y(y: Project<T, number>): this;

  defined(): Project<T, boolean>;
  defined(defined: boolean): this;
  defined(defined: Project<T, boolean>): this;
}

export default series;
export function series<T>(): Series<T> {
  let x: Project<T, number> = d => (d as any).x,
      y: typeof x = d => (d as any).y,
      defined: Project<T, boolean> = () => true;

  const line = shape.line<Point<T>>()
    .x(d => d.x)
    .y(d => d.y)
    .defined(defined);

  const series = ((rows: T[]): SeriesOutput<T> => {
    rows.forEach((row, i) => {
      (row as Point<T>).x = x(row, i);
      (row as Point<T>).y = y(row, i);
    });

    return {
      line: line(rows as Point<T>[]),
      points: (rows as Point<T>[]).filter(defined),
    };
  }) as Series<T>;

  series.x = seriesX;
  series.y = seriesY;
  series.defined = seriesDefined;

  return series;

  function seriesX(): Project<T, number>;
  function seriesX(x: number): Series<T>;
  function seriesX(x: Project<T, number>): Series<T>;
  function seriesX(val?: number | Project<T, number>): Project<T, number> | Series<T> {
    if (arguments.length) {
      x = typeof val === 'function' ? val : (() => val) as Project<T, number>;
      return series;
    }

    return x;
  }

  function seriesY(): Project<T, number>;
  function seriesY(y: number): Series<T>;
  function seriesY(y: Project<T, number>): Series<T>;
  function seriesY(val?: number | Project<T, number>): Project<T, number> | Series<T> {
    if (arguments.length) {
      y = typeof val === 'function' ? val : (() => val) as Project<T, number>;
      return series;
    }

    return y;
  }

  function seriesDefined(): Project<T, boolean>;
  function seriesDefined(defined: boolean): Series<T>;
  function seriesDefined(defined: Project<T, boolean>): Series<T>;
  function seriesDefined(val?: boolean | Project<T, boolean>): Project<T, boolean> | Series<T> {
    if (arguments.length) {
      defined = typeof val === 'function' ? val : (() => val) as Project<T, boolean>;
      line.defined(defined);
      return series;
    }

    return defined;
  }
}
