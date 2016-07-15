import {ItemView} from 'backbone.marionette';
import Model from 'pages/average-scores/subscale-model';
import configure from 'util/configure';

interface Data {
  year: number;
  SRPS1: string;
  SRPS2: string;
  SRPS3: string;
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
    console.log(this);

    const {year, SRPS1, SRPS2, SRPS3} = this.model;

    return {
      year,
      SRPS1: '' + Math.round(SRPS1.targetvalue),
      SRPS2: '' + Math.round(SRPS2.targetvalue),
      SRPS3: '' + Math.round(SRPS3.targetvalue),
    };
  }
}
