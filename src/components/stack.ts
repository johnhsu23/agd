import {functor} from 'd3';

export type Bar<T> = T & {
  /**
   * The initial position of this bar.
   */
  offset: number;
  /**
   * The height (or width) of this bar.
   */
  size: number;
};

export interface Stack<T> {
  (values: T[]): Bar<T>[];

  defined(): (datum: T, index: number) => boolean;
  defined(defined: boolean): this;
  defined(defined: (datum: T, index: number) => boolean): this;

  size(): (datum: T, index: number) => number;
  size(value: number): this;
  size(value: (datum: T, index: number) => number): this;
}

export default stack;
export function stack<T>(): Stack<T> {
  type Projection<Val> = (datum: T, index: number) => Val;
  type Property<Val> = {
    (): (datum: T, index: number) => Val;
    (value: Val): Stack<T>;
    (value: Projection<Val>): Stack<T>;
  }

  let defined: Projection<boolean> = functor(true),
      size: Projection<number> = Number;

  const stack = function (values: T[]) {
    const output: Bar<T>[] = [];

    let offset = 0;
    for (let i = 0; i < values.length; i++) {
      const value = values[i],
            obj = Object(value) as Bar<T>;
      if (defined(value, i)) {
        const sz = +size(value, i);
        obj.size = sz;
        obj.offset = offset;

        offset += sz;
        output.push(obj);
      }
    }

    return output;
  } as Stack<T>;

  stack.defined = function (value?: boolean | Projection<boolean>): Stack<T> | Projection<boolean> {
    if (arguments.length) {
      defined = functor(value as boolean);
      return stack;
    }

    return defined;
  } as Property<boolean>;

  stack.size = function (val?: number | Projection<number>): Stack<T> | Projection<number> {
    if (arguments.length) {
      size = functor(val as number);
      return stack;
    }

    return size;
  } as Property<number>;

  return stack;
}
