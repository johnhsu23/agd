import TextLegend from 'models/legend/text';

export default function legend(): TextLegend {
  return new TextLegend({
    marker: '\u2014', // em dash
    description: 'Not available.',
  });
}
