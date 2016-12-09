import {ItemView} from 'backbone.marionette';
import {Model} from 'backbone';

import configure from 'util/configure';

const template = `<tr>
  <th scope="col" rowspan="2">Student Group</th>
  <th scope="col" colspan="2">Scale Scores</th>
  <th scope="col" colspan="2">Percentages</th>
</tr>
<tr>
  <th scope="col">2008</th>
  <th scope="col">2016</th>
  <th scope="col">2008</th>
  <th scope="col">2016</th>
</tr>
`;

@configure({
  tagName: 'thead',
})
export default class GroupsHeader extends ItemView<Model> {
  template = () => template;
}
