import {scale, Scale} from 'components/scale';

export {Scale};

export function score(): Scale {
  return scale()
    .interval(10)
    .intervalSize(30);
}

export function year(): Scale {
  return scale()
    .interval(1)
    .intervalSize(40);
}

/**
 * Returns a percentage scale that encompasses the domain [-100, 100].
 */
export function fullPercent(): Scale {
  return scale()
    .bounds([-100, 100])
    .interval(10)
    .intervalSize(25);
}

/**
 * Returns a percentage scale only for the domain [0, 100].
 */
export function percent(): Scale {
  return scale()
    .bounds([0, 100])
    .interval(10)
    .intervalSize(50);
}
