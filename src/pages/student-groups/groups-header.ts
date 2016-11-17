import {ItemView} from 'backbone.marionette';
import {Model} from 'backbone';

import configure from 'util/configure';

const template = `<tr>
  <th scope="col" rowspan="2">Student Group</th>
  <th scope="col" colspan="2">2008</th>
  <th scope="col" colspan="2">2016</th>
</tr>
<tr>
  <th scope="col">Scale Score</th>
  <th scope="col">Percentage</th>
  <th scope="col">Scale Score</th>
  <th scope="col">Percentage</th>
</tr>
`;

@configure({
  tagName: 'thead',
})
export default class GroupsHeader extends ItemView<Model> {
  template = () => template;
}
