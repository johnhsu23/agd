import {select, Selection, EnterElement} from 'd3-selection';
//import {csvFormat} from 'd3-dsv';

export default function exportTable<T, U>(figure: Selection<Element, T, null, U>): void {
  let csv = 'data:text/csv;charset=utf-8,';

  // Get header rows.
  const hRows = figure.selectAll('.table thead tr').nodes();
  const header = buildHeader(hRows);

  // Get data rows.
  const bRows = figure.selectAll('.table tbody tr').nodes();
  const data = buildRows(bRows);

  csv += header.join(',') + '\n';
  for (const datum of data) {
    csv += datum.join(',') + '\n';
  }

  csv += '\n';

  // Now factor in the legend.
  const legend = figure.selectAll('.legend__item').nodes();
  for (const item of legend) {
    // Filter our heat items since we won't be able to display colors.
    const selectItem = select(item);
    if (selectItem.select('.legend__marker--text').node()) {
      csv += selectItem.select('.legend__marker').text() + ' ' +
          selectItem.select('.legend__description').text() + '\n';
    }
  }

  const encoded = encodeURI(csv);
  window.open(encoded);
}

/**
 * This is uglier than sin, but it works. If you're reading this and can make it
 * better, do it!
 */
function buildHeader(rows: EnterElement[]): string[] {
  const labels = buildRows(rows),
      colspan = labels[0].length;

  const header = [];
  for (const row of labels) {
    for (let i = 0; i < colspan; i++) {
      if (!header[i]) {
        header[i] = '';
      }
      header[i] += ' ' + row[i];
      header[i] = header[i].trim();
    }
  }

  return header;
}

function buildRows(rows: EnterElement[]): string[][] {
  const rowValues: string[][] = [];

  rows.forEach((row, index) => {
    const cells = select(row).selectAll('th, td').nodes();
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
