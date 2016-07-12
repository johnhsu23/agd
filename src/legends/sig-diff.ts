import Model from 'legends/model';

export default function legend(): Model {
  return new Model({
    type: 'text',
    marker: '*',
    description: 'Significantly different (<var>p</var> &lt; .05) from 2015.',
  });
}
