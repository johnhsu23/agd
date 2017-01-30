import {Model, EventsHash} from 'backbone';
import {ItemView} from 'backbone.marionette';
import * as $ from 'jquery';

import * as template from 'text!templates/footer.html';
import * as customTableHtml from 'text!templates/custom-data-table.html';
import * as summaryTableHtml from 'text!templates/summary-data-table.html';

export default class SiteFooter extends ItemView<Model> {
  template = () => template;

  events(): EventsHash {
    return {
      'click [data-footer-tab]': 'footerTab',
      'click a.button--custom': 'customTable',
    };
  }

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    // set active data table link
    this.$('a[data-footer-tab="summary"]').addClass('active');

    // populate data tables
    this.$('.js-data-table-summary')
      .html(summaryTableHtml);
    this.$('.js-data-table-custom')
      .html(customTableHtml)
      // hide the custom table data by default
      .addClass('is-hidden');
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
    const url = 'http://nces.ed.gov/nationsreportcard/nationsreportcard/naepdata/report.aspx?' + parameters.join('-');

    // open the URL in a new window
    window.open(url);
  }
}
