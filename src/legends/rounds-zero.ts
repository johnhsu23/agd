import TextLegend from 'legends/models/text';

export default function legend(): TextLegend {
  return new TextLegend({
    marker: '#',
    description: 'Rounds to zero.',
  });
}
