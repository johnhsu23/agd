import Model from 'legends/model';

export default function legend(): Model {
  return new Model({
    type: 'text',
    marker: '\u2014', // em dash
    description: 'Not available.',
  });
}
