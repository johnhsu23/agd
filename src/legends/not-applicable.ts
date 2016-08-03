import Model from 'legends/model';

export default function legend(): Model {
  return new Model({
    type: 'text',
    marker: '\u2021',
    description: 'Reporting standards not met. Sample size insufficient to permit a reliable estimate.',
  });
}
