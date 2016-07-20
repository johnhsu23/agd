import Figure from 'views/figure';
import significant from 'legends/sig-diff';
import LegendView from 'views/legend';
import {Collection} from 'backbone';

import load from 'pages/average-scores/subscale-data';
import * as Promise from 'bluebird';

import context from 'models/grade';

import nth from 'util/nth';
import formatList from 'util/format-list';
import {yearsForGrade, targetYearsForGrade} from 'data/assessment-years';

import Table from 'views/table';
import DefaultHeader from 'views/default-header';
import RowView from 'pages/average-scores/subscale-row';
import RowModel from 'pages/average-scores/subscale-model';

export default class SubscaleFigure extends Figure {
  collection = new Collection([significant()]);
  protected table: Table<RowModel, RowView>;
  protected promise = Promise.resolve(void 0);

  delegateEvents(): this {
    super.delegateEvents();

    this.listenTo(context, 'change:grade', this.showTable);

    return this;
  }

  undelegateEvents(): this {
    this.stopListening(context);

    return super.undelegateEvents();
  }

  protected showTable(): void {
    if (!this.table) {
      const table = new Table<RowModel, RowView>({
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

      table.childView = RowView;
      table.$el.addClass('table--full-width');

      this.table = table;
    }

    this.setTitle(this.makeTitle());
    this.populateTable();
  }

  protected populateTable(): void {
    const {grade} = context,
          years = targetYearsForGrade(grade);

    this.promise = this.promise.then(() => load('science', grade, years))
      .then(models => this.table.collection.reset(models))
      .then(() => this.showChildView('inner', this.table));

    this.promise.done();
  }

  protected makeTitle(): string {
    const {grade} = context;
    const years = formatList(yearsForGrade(grade));

    return `Average scores for ${nth(grade)}-grade students assessed in NAEP science, by content area: ${years}`;
  }

  onBeforeShow(): void {
    this.showChildView('legend', new LegendView({
      collection: this.collection,
    }));

    this.showTable();
  }
}
