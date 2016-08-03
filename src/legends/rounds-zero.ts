import Model from 'legends/model';

export default function legend(): Model {
  return new Model({
    type: 'text',
    marker: '#',
    description: 'Rounds to zero.',
  });
}
