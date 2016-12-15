import TextLegend from 'legends/models/text';

export default function legend(): TextLegend {
  return new TextLegend({
    marker: '*',
    description: 'Significantly different (<var>p</var> &lt; .05) from 2016.',
  });
}
