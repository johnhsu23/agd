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
