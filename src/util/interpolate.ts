export function interpolate(v0: number, v1: number, t: number): number {
  return (1 - t) * v0 + t * v1;
}

export function deinterpolate(v0: number, v1: number, v: number): number {
  // http://www.wolframalpha.com/input/?i=solve+v+%3D+(1+-+t)*v0+%2B+t*v1+for+t
  // Thanks, Wolfram Alpha!
  if (v0 === v1) {
    return v0;
  }

  return (v0 - v) / (v0 - v1);
}
