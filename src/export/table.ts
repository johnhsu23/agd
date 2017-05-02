import {select, Selection, EnterElement} from 'd3-selection';

export default function exportTable<T, U>(figure: Selection<Element, T, null, U>): void {
  let csv = 'data:text/csv;charset=utf-8,';

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

  const encoded = encodeURI(csv);
  window.open(encoded);
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
