import {ItemView} from 'backbone.marionette';
import Model from 'pages/average-scores/subscale-model';
import configure from 'util/configure';
import {formatValue} from 'codes';

interface Data {
  year: number;
  SRPS1: string;
  SRPS2: string;
  SRPS3: string;
}

function format(datum: typeof Model.prototype.SRPS1): string {
  const {targetvalue, sig, TargetErrorFlag} = datum;

  return formatValue(targetvalue, sig, TargetErrorFlag);
}

@configure({
  tagName: 'tr',
})
export default class SubscaleRow extends ItemView<Model> {
  template = (data: Data) => `<th scope="row">${data.year}</th>
<td>${data.SRPS1}</td>
<td>${data.SRPS2}</td>
<td>${data.SRPS3}</td>`;

  serializeData(): Data {
    const {year, SRPS1, SRPS2, SRPS3} = this.model;

    return {
      year,
      SRPS1: format(SRPS1),
      SRPS2: format(SRPS2),
      SRPS3: format(SRPS3),
    };
  }
}
