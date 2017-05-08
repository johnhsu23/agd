import {select, Selection, EnterElement} from 'd3-selection';
import * as $ from 'jquery';

export default function exportTable<T, U>(figure: Selection<Element, T, null, U>): void {
  let csv = '';

  // Get header rows.
  const hRows = figure
    .selectAll('.table thead tr')
    .nodes();
  const header = buildHeader(hRows);

  // Get data rows.
  const bRows = figure
    .selectAll('.table tbody tr')
    .nodes();
  const data = buildRows(bRows);

  csv += header.join(',') + '\n';
  for (const datum of data) {
    csv += datum.join(',') + '\n';
  }

  csv += '\n';

  // Now factor in the legend.
  const legend = figure
    .selectAll('.legend__item')
    .nodes();
  for (const item of legend) {
    // Only show the text items since they don't use colors.
    const selectItem = select(item);
    const textItem = selectItem
      .select('.legend__marker--text')
      .node();
    if (textItem) {
      csv += selectItem.select('.legend__marker').text() + ' ' +
          selectItem.select('.legend__description').text() + '\n';
    }
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const filename = 'testing.csv';
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    const url = URL.createObjectURL(blob);
    const link = $('<a>', {
      href: url,
      download: filename,
      style: 'visibility: hidden',
    });
    // Browsers that support HTML5 download attribute.
    if (link.attr('download') !== undefined) {
      link.appendTo('body');
      link[0].click();
      link.remove();
    }
  }
}

function buildHeader(rows: EnterElement[]): string[] {
  const labels = buildRows(rows);

  // Merge this down into one row of labels.
  const header: string[] = [];
  for (const row of labels) {
    row.forEach((d, i) => {
      if (!header[i]) {
        header[i] = '';
      }
      header[i] += ' ' + d;
      header[i] = header[i].trim();
    });
  }

  return header;
}

function buildRows(rows: EnterElement[]): string[][] {
  const rowValues: string[][] = [];

  rows.forEach((row, index) => {
    const cells = select(row)
      .selectAll('th, td')
      .nodes();
    if (!rowValues[index]) {
      rowValues[index] = [];
    }

    for (const cell of cells) {
      const cellSelect = select(cell),
          label = cellSelect.text(),
          cellColspan = parseInt(cellSelect.attr('colspan'), 10);

      rowValues[index].push(label);

      // Add additional duplicate labels if this has a colspan since we
      // can't really do colspan in csv.
      if (cellColspan) {
        for (let i = 1; i < cellColspan; i++) {
          rowValues[index].push(label);
        }
      }
    }
  });

  return rowValues;
}
