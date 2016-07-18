import {functor} from 'd3';

const TAN30 = Math.tan(30 * Math.PI / 180),
      SQRT2 = Math.sqrt(2),
      POW3_14 = Math.pow(3, 0.25),
      POW3_34 = Math.pow(3, 0.75);

interface Symbol<T> {
  (datum: T, index: number): string;

  type(): (datum: T, index: number) => string;
  type(value: string): Symbol<T>;
  type(value: (datum: T, index: number) => string): Symbol<T>;

  size(): (datum: T, index: number) => number;
  size(value: number): Symbol<T>;
  size(value: (datum: T, index: number) => number): Symbol<T>;
}

export default symbol;
export function symbol<T>(): Symbol<T> {
  type Functor<Out> = (datum: T, index: number) => Out;
  type Setter<Value> = {
    (): Functor<Value>;
    (value: Value): Symbol<T>;
    (value: Functor<Value>): Symbol<T>;
  }

  let type: Functor<string> = functor('circle'),
      size: Functor<number> = functor(64);

  const symbol = function (datum: T, index: number): string {
    const t = symbols[type.call(this, datum, index)] || symbols['circle'],
          sz = size.call(this, datum, index);

    return t(sz);
  } as Symbol<T>;

  symbol.type = function (value?: string | Functor<string>): Symbol<T> | Functor<string> {
    if (arguments.length) {
      type = functor(value as string);
      return symbol;
    }

    return type;
  } as Setter<string>;

  symbol.size = function (value?: number | Functor<number>): Symbol<T> | Functor<number>  {
    if (arguments.length) {
      size = functor(value as number);
      return symbol;
    }

    return size;
  } as Setter<number>;

  return symbol;
}

type Symbols = { [name: string]: (size: number) => string };

const symbols: Symbols = {
  circle(size) {
    const r = Math.sqrt(size / Math.PI);

    return `M0,${r}`
         + `A${r},${r} 0 1,1 0,${-r}`
         + `A${r},${r} 0 1,1 0,${r}`
         + 'Z';
  },
  cross(size) {
    const r = Math.sqrt(size / 5) / 2;

    return `M${-3 * r},${-r}`
         + `H${-r}`
         + `V${-3 * r}`
         + `H${r}`
         + `V${-r}`
         + `H${3 * r}`
         + `V${r}`
         + `H${r}`
         + `V${3 * r}`
         + `H${-r}`
         + `V${r}`
         + `H${-3 * r}`
         + 'z';
  },
  diamond(size) {
    const ry = Math.sqrt(size / (2 * TAN30)),
          rx = ry * TAN30;

    return `M0,${-ry}`
         + `L${rx},0 0,${ry} ${-rx},0`
         + 'z';
  },
  square(size) {
    const r = Math.sqrt(size) / 2;

    return `M${-r},${-r}`
         + `L${r},${-r} ${r},${r} ${-r},${r}`
         + 'z';
  },
  hexagon(size) {
    const r = Math.sqrt(size),
          s = SQRT2 / POW3_34 * r,
          h = SQRT2 / POW3_14 * r;

    return `M${s},0`
         + `L${s / 2},${-h / 2}`
         + ` ${-s / 2},${-h / 2}`
         + ` ${-s},0`
         + ` ${-s / 2},${h / 2}`
         + ` ${s / 2},${h / 2}`
         + 'z';
  },
};

export const types = Object.freeze(Object.keys(symbols));
