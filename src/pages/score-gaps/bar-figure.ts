import {Collection, EventsHash} from 'backbone';
import * as $ from 'jquery';

import Figure from 'views/figure';
import Chart from 'pages/score-gaps/bar-chart';
import VariableSelector from 'views/variable-selector';
import LegendView from 'views/legend';
import {all as gatherNotes} from 'legends/gather';
import * as vars from 'data/variables';

import {groupedData} from 'pages/score-gaps/bar-data';

export default class TaskBar extends Figure {
  protected variable: vars.Variable = vars.SDRACE;
  protected legendCollection = new Collection;

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.setTitle(this.makeTitle());
    this.showContents(new Chart);

    const studentGroups = vars.studentGroups.map(group => {
      switch (group.id) {
        case 'SLUNCH3':
          return vars.SLUNCH1;
        case 'SCHTYPE':
          return vars.SCHTYP1;
        default:
          return group;
      }
    });
    this.showControls(new VariableSelector({ variables: studentGroups }));

    this.showLegend(new LegendView({
      collection: this.legendCollection,
    }));
    this.updateLegend();
  }

  childEvents(): EventsHash {
    const events = {
      'variable:select': 'onChildVariableSelect',
    };
    $.extend(events, super.childEvents());

    return events;
  }

  onChildVariableSelect(_view: VariableSelector, variable: vars.Variable): void {
    this.variable = variable;
    this.getChildView('contents')
      .trigger('variable:select', variable);
    this.setTitle(this.makeTitle());
    this.updateLegend();
  }

  protected makeTitle(): string {
    return 'Average creating task scores for eighth-grade students assessed in NAEP ' +
      `visual arts, by ${this.variable.title}: 2016`;
  }

  protected updateLegend(): void {
    const legends = gatherNotes(groupedData[this.variable.id], row => row.errorFlag, () => '');
    this.legendCollection.reset(legends);
  }
}
