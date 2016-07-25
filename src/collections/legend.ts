import {Collection} from 'backbone';
import Legend from 'legends/model';

import configure from 'util/configure';

@configure({
  model: Legend as new(...args: any[]) => Legend,
})
export default class LegendCollection extends Collection<Legend> {

}
