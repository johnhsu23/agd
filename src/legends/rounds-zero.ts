import TextLegend from 'models/legend/text';

export default function legend(): TextLegend {
  return new TextLegend({
    marker: '#',
    description: 'Rounds to zero.',
  });
}
