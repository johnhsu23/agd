import {defaults} from 'underscore';

import {TableView, TableViewOptions} from 'views/table';
import configure from 'util/configure';

import HeatModel from 'pages/opportunities-and-access/heat-model';
import HeatHeader from 'pages/opportunities-and-access/heat-header';
import HeatRow from 'pages/opportunities-and-access/heat-row';
import {Variable} from 'data/variables';
import {ContextualVariable} from 'data/contextual-variables';

interface HeatTableOptions extends TableViewOptions<HeatModel> {
  variableName: string;
  contextualVariable: ContextualVariable;
}

@configure({
  className: 'table table--heat',
  childView: HeatRow as { new(...args: any[]): HeatRow },
})
export default class HeatTable extends TableView<HeatModel, HeatRow> {
  protected tableHeader: HeatHeader;

  constructor(options: HeatTableOptions) {
    options = defaults(options, { headerClass: HeatHeader});

    super(options);

    this.tableHeader = new HeatHeader({
      variableName: options.variableName,
      contextualVariable: options.contextualVariable,
    });

    this.header = this.tableHeader;
  }

  delegateEvents(): this {
    super.delegateEvents();

    this.on('variable:select', this.updateHeader);

    return this;
  }

  protected updateHeader(variable: Variable): void {
    this.tableHeader.updateHeader(variable.name);
  }
}
