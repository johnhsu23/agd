import {Model, EventsHash} from 'backbone';
import {ItemView} from 'backbone.marionette';
import {radio} from 'backbone.wreqr';
import * as $ from 'jquery';

import * as template from 'text!templates/footer.html';
import * as customTableHtml from 'text!templates/custom-data-table.html';
import * as customTableMusicHtml from 'text!templates/custom-data-table-music.html';
import * as customTableVisualArtsHtml from 'text!templates/custom-data-table-visual-arts.html';
import * as summaryTableHtml from 'text!templates/summary-data-table.html';

export default class SiteFooter extends ItemView<Model> {
  template = () => template;

  protected subject: 'music' | 'visual arts';

  delegateEvents(): this {
    super.delegateEvents();

    const {vent} = radio.channel('page');

    this.listenTo(vent, 'page', this.onPageChanged);

    return this;
  }

  events(): EventsHash {
    return {
      'click [data-footer-tab]': 'footerTab',
      'click a.button--custom': 'customTable',
      'click a.button--custom--opps': 'customTableOpps',
    };
  }

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    // set active data table link
    this.$('a[data-footer-tab="summary"]').addClass('active');

    // populate summary data table
    this.$('.js-data-table-summary')
      .html(summaryTableHtml);

    // hide the custom table data by default (it'll be populated elsewhere)
    this.$('.js-data-table-custom')
      .addClass('is-hidden');
  }

  protected onPageChanged(page: string, subject?: 'music' | 'visual arts'): void {
    this.subject = subject;

    let tableHtml = customTableHtml;
    // we need to display a different custom data table for the Opportunities & Access pages
    if (page === 'pages/opportunities-and-access') {
      tableHtml = (subject === 'music') ? customTableMusicHtml : customTableVisualArtsHtml;
    }

    // populate the data table
    this.$('.js-data-table-custom')
      .html(tableHtml);
  }

  protected footerTab(event: JQueryMouseEventObject): void {
    event.preventDefault();

    const target = event.target;
    let tableId: string;
    this.$('.footer-header__link').each((_, element) => {
      const $element = $(element);

      // update active link
      if (element === target) {
        $element.addClass('active');
        // set the ID of the table that we want to show
        tableId = $element.data('footer-tab');
      } else {
        $element.removeClass('active');
      }
    });

    this.$('.footer-content__tables__table').each((_, element) => {
      // hide the table NOT selected
      $(element).toggleClass('is-hidden', !$(element).hasClass(`js-data-table-${tableId}`));
    });
  }

  protected customTable(event: JQueryMouseEventObject): void {
    event.preventDefault();

    // URL variables
    const grade = 'p=2',
          subject = this.$('select[name=subject]').val(),
          framework = '2',
          years = '20163,20083',
          subscale = (subject === 'MUS') ? 'MUSRP' : 'VISRP',
          variable = this.$('select[name=variable]').val(),
          jurisdiction = 'NT',
          statistic = this.$('select[name=statistic]').val(),
          // only crosstab variables include commas, so check for that
          layout = variable.indexOf(',') === -1 ? 'Y_J-0-0-5' : '1_Y_J-0-0-37';

    // set parameters in correct order: p=2-MUS-2-20163,20083-MUSRP-TOTAL-NT-MN_MN-Y_J-0-0-5
    const parameters = [grade, subject, framework, years, subscale, variable, jurisdiction, statistic, layout];
    const url = this.generateUrl(parameters);

    // open the URL in a new window
    window.open(url);
  }

  protected customTableOpps(event: JQueryMouseEventObject): void {
    event.preventDefault();

    // URL variables specific for Music
    const grade = 'p=2',
          subject = (this.subject === 'music') ? 'MUS' : 'VIS',
          framework = '2',
          years = '20163,20083',
          subscale = (this.subject === 'music') ? 'MUSRP' : 'VISRP',
          question = this.$('select[name=question]').val(),
          variable = this.$('select[name=variable]').val(),
          // full variable should look like 'QUESTION,VARIABLE'
          fullVariable = question + ',' + variable,
          jurisdiction = 'NT',
          statistic = 'MN_MN,RP_RP',
          layout = variable === 'TOTAL' ? 'Y_J-0-0-5' : '1_Y_J-0-0-37';

    // set parameters in correct order: p=2-MUS-2-20163,20083-MUSRP-BM80024,GENDER-NT-MN_MN,RP_RP-1_Y_J-0-0-37
    const parameters = [grade, subject, framework, years, subscale, fullVariable, jurisdiction, statistic, layout];
    const url = this.generateUrl(parameters);

    // open the URL in a new window
    window.open(url);
  }

  protected generateUrl(params: string[]): string {
    return 'http://nces.ed.gov/nationsreportcard/nationsreportcard/naepdata/report.aspx?' + params.join('-');
  }
}
