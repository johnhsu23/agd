import Figure from 'views/figure';
import significant from 'legends/sig-diff';
import LegendView from 'views/legend';
import {Collection} from 'backbone';

import load from 'pages/average-scores/subscale-data';

import Table from 'views/table';
import DefaultHeader from 'views/default-header';
import RowView from 'pages/average-scores/subscale-row';
import RowModel from 'pages/average-scores/subscale-model';

export default class SubscaleFigure extends Figure {
  collection = new Collection([significant()]);
  protected table: Table<RowModel, RowView>;

  protected showTable(): void {
    if (!this.table) {
      this.table = new Table<RowModel, RowView>({
        collection: new Collection,
        sort: false,
        header: new DefaultHeader({
          labels: [
            'Year',
            'SRPS1',
            'SRPS2',
            'SRPS3',
          ],
        }),
      });

      this.table.childView = RowView;
    }

    this.populateTable();
  }

  protected populateTable(): void {
    load('science', 4, ['2009R3', '2015R3'])
      .then(models => this.table.collection.reset(models))
      .then(() => this.showChildView('inner', this.table))
      .done();
  }

  onBeforeShow(): void {
    this.setTitle('scores by subscale');

    this.showChildView('legend', new LegendView({
      collection: this.collection,
    }));

    this.showTable();
  }
}
