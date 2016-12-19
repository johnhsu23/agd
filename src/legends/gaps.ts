import GapLegend from 'models/legend/gap';

export function significant(): GapLegend {
  return new GapLegend({
    significant: true,
  });
}

export function notSignificant(): GapLegend {
  return new GapLegend({
    significant: false,
  });
}
