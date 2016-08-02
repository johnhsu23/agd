import {interpolateArray} from 'd3';

type Interpolator = (t: number) => string;

export default function interpolate(d0: string, d1: string, precision = 4): Interpolator {
  const path0 = document.createElementNS('http://www.w3.org/2000/svg', 'path'),
        path1 = path0.cloneNode(true) as typeof path0;

  path0.setAttribute('d', d0);
  path1.setAttribute('d', d1);

  const n0 = path0.getTotalLength(),
        n1 = path1.getTotalLength(),
        distances: number[] = [],
        dt = precision / Math.max(n0, n1);

  for (let i = 0; i < 1; i += dt) {
    distances.push(i);
  }
  distances.push(1);

  const points = distances.map(t => {
    const p0 = path0.getPointAtLength(t * n0),
          p1 = path1.getPointAtLength(t * n1);

    return interpolateArray([p0.x, p0.y], [p1.x, p1.y]);
  });

  return t => {
    if (t < 1) {
      return 'M' + points.map(p => p(t)).join('L');
    }

    return d1;
  };
}
