import {functor, svg as gen} from 'd3';

type Project<T, Out> = (datum: T, index: number) => Out;

type Point<T> = T & {
  x: number;
  y: number;
};

type Output<T> = {
  line: string;
  points: Point<T>[];
};

interface Series<T> {
  (rows: T[]): Output<T>;

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

function series<T>(): Series<T> {
  let x: Project<T, number> = d => (d as any).x,
      y: typeof x = d => (d as any).y,
      defined: Project<T, boolean> = functor(true);

  const line = gen.line<Point<T>>()
    .x(d => d.x)
    .y(d => d.y)
    .defined(defined);

  const series = ((rows: T[]): Output<T> => {
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
      x = functor(val as number);
      return series;
    }

    return x;
  }

  function seriesY(): Project<T, number>;
  function seriesY(y: number): Series<T>;
  function seriesY(y: Project<T, number>): Series<T>;
  function seriesY(val?: number | Project<T, number>): Project<T, number> | Series<T> {
    if (arguments.length) {
      y = functor(val as number);
      return series;
    }

    return y;
  }

  function seriesDefined(): Project<T, boolean>;
  function seriesDefined(defined: boolean): Series<T>;
  function seriesDefined(defined: Project<T, boolean>): Series<T>;
  function seriesDefined(val?: boolean | Project<T, boolean>): Project<T, boolean> | Series<T> {
    if (arguments.length) {
      line.defined(defined = functor(val as boolean));
      return series;
    }

    return defined;
  }
}

export default series;
export {Series, series};
