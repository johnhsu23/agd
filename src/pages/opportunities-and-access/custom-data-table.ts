import {Model, EventsHash} from 'backbone';
import {LayoutView} from 'backbone.marionette';

import context from 'models/context';

import * as musicDataTable from 'text!templates/custom-data-table-music.html';
import * as visualArtsDataTable from 'text!templates/custom-data-table-visual-arts.html';

export default class DataTablesView extends LayoutView<Model> {
  template = () => (context.subject === 'music') ? musicDataTable : visualArtsDataTable;

  events(): EventsHash {
    return {
      'click a.button--custom': 'customTable',
    };
  }

  protected customTable(event: JQueryMouseEventObject): void {
    event.preventDefault();

    // URL variables specific for Music
    const grade = 'p=2',
          subject = (context.subject === 'music') ? 'MUS' : 'VIS',
          framework = '2',
          years = '20163,20083',
          subscale = (context.subject === 'music') ? 'MUSRP' : 'VISRP',
          question = this.$('select[name=question]').val(),
          variable = this.$('select[name=variable]').val(),
          // full variable should look like 'QUESTION,VARIABLE'
          fullVariable = question + ',' + variable,
          jurisdiction = 'NT',
          statistic = 'MN_MN,RP_RP',
          layout = variable === 'TOTAL' ? 'Y_J-0-0-5' : '1_Y_J-0-0-37';

    // set parameters in correct order: p=2-MUS-2-20163,20083-MUSRP-BM80024,GENDER-NT-MN_MN,RP_RP-1_Y_J-0-0-37
    const parameters = [grade, subject, framework, years, subscale, fullVariable, jurisdiction, statistic, layout];
    const url = 'http://nces.ed.gov/nationsreportcard/nationsreportcard/naepdata/report.aspx?' + parameters.join('-');

    // open the URL in a new window
    window.open(url);
  }
}
