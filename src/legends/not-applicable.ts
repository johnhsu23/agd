import TextLegend from 'legends/models/text';

export default function legend(): TextLegend {
  return new TextLegend({
    marker: '\u2021',
    description: 'Reporting standards not met. Sample size insufficient to permit a reliable estimate.',
  });
}
