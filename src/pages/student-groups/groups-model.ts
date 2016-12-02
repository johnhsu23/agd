import {Model} from 'backbone';

import {Variable} from 'data/variables';
import modelProperty from 'util/model-property';

import {Data} from 'pages/student-groups/groups-data';

export default class GroupsModel extends Model {
  @modelProperty()
  variable: Variable;

  @modelProperty()
  category: number;

  @modelProperty('2008-MN')
  MN_2008: Data;

  @modelProperty('2016-MN')
  MN_2016: Data;

  @modelProperty('2008-RP')
  RP_2008: Data;

  @modelProperty('2016-RP')
  RP_2016: Data;
}
