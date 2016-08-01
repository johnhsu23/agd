// import * as Promise from 'bluebird';
import {select, Selection} from 'd3';

import renderTitle from 'render/figure-title';

import ensureAttached from 'util/ensure-attached';
import save from 'export/save';

const figureWidth = 1024;

function metrics(node: Element): ClientRect {
  return ensureAttached(node, node => node.getBoundingClientRect());
}

export default function render<T>(figure: Selection<T>): void {
  const title = renderTitle(figure.select('.figure__title')),
        chart = figure.select('.chart').node().cloneNode(true) as SVGSVGElement,
        legend = renderLegend(figure.select('.legend'));

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  const offset = metrics(title).height;

  const {width: chartWidth, height: chartHeight} = metrics(chart),
        chartOffset = (768 - chartWidth) / 2;

  chart.x.baseVal.value = chartOffset;
  chart.y.baseVal.value = offset;

  const {width: legendWidth, height: legendHeight} = metrics(legend);

  const x = figureWidth - legendWidth;
  legend.x.baseVal.value = figureWidth - legendWidth;
  legend.y.baseVal.value = offset;

  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.x.baseVal.value = x - 1;
  rect.y.baseVal.value = offset - 1;
  rect.width.baseVal.value = legendWidth + 2;
  rect.height.baseVal.value = legendHeight + 2;
  rect.style.setProperty('stroke', 'black');
  rect.style.setProperty('stroke-width', '1px');
  rect.style.setProperty('fill', 'none');

  svg.appendChild(title);
  svg.appendChild(chart);
  svg.appendChild(rect);
  svg.appendChild(legend);

  svg.setAttribute('width', '' + (figureWidth + 1)); // +1 to account for the legend border
  svg.setAttribute('height', '' + (offset + chartHeight));

  save(svg).done();
}

function renderLegend<T>(legend: Selection<T>): SVGSVGElement {
  const legendNode = legend.node() as Element;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const sel = select(svg);

  const {width, height} = legendNode.getBoundingClientRect();

  sel.attr('class', legend.attr('class'))
    .attr('width', width)
    .attr('height', height);

  legend.selectAll('.legend__item')
    .each(renderItem);
  return svg;

  function renderItem(): void {
    const item = select(this);

    const {top} = offset(this.parentNode, this);

    const row = sel.append('g')
      .attr('class', item.attr('class'))
      .attr('transform', `translate(0, ${top})`);

    item.select('.legend__marker')
      .call(renderMarker, row);

    item.select('.legend__description')
      .call(renderDescription, row);
  }

  function renderMarker<T, U>(marker: Selection<T>, row: Selection<U>): void {
    if (marker.classed('legend__marker--text')) {
      renderTextMarker(marker, row);
    } else if (marker.classed('legend__marker--path')) {
      renderPathMarker(marker, row);
    } else {
      throw new Error(`Don't know how to handle marker with classes "${marker.attr('class')}"`);
    }
  }

  function renderTextMarker<T, U>(marker: Selection<T>, row: Selection<U>): void {
    const node = marker.node() as Element;

    // Our x-position will be computed based on existing display (since we want to center it inside a table-cell box)
    const width = node.getBoundingClientRect().width;

    row.append('text')
      .attr('dominant-baseline', 'text-after-edge')
      .attr('class', marker.attr('class'))
      .attr('x', width / 2)
      .attr('y', baseline(node))
      .attr('text-anchor', 'middle')
      .text(marker.text());
  }

  function renderPathMarker<T, U>(marker: Selection<T>, row: Selection<U>): void {
    const node = marker.node() as SVGSVGElement,
          svg = node.cloneNode(true) as SVGSVGElement,
          bounds = node.getBoundingClientRect();

    svg.setAttribute('width', '' + bounds.width);
    svg.setAttribute('height', '' + bounds.height);

    row.node().appendChild(svg);
  }

  function renderDescription<T, U>(description: Selection<T>, row: Selection<U>): void {
    const node = description.node() as Element;
    const {left} = offset(legendNode, node);

    const text = row.append('text')
      // text-after-edge lets us use the bottom of the em-box (see `baseline()`) for text alignment
      // (unfortunately, this isn't supported by IE so text there will be off by a few pixels.)
      .attr('dominant-baseline', 'text-after-edge')
      .attr('class', description.attr('class'))
      .attr('x', left)
      .attr('y', baseline(description.node() as Element));

    const nodes = description.node().childNodes;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes.item(i);
      if (node instanceof Text) {
        text.append(() => node.cloneNode(true));
      } else if (node instanceof Element) {
        text.append('tspan')
          .attr('class', node.getAttribute('class'))
          .text(node.textContent);
      }
    }

    breakText(text.node() as SVGTextElement, node.getBoundingClientRect().width);
  }

  function breakText(parent: SVGTextElement, width: number): void {
    parent.normalize();

    // Remove all child nodes and put them in the `boxes' array
    // (So called because CSS and TeX both use the `box' as the smallest unit of positioning)
    const boxes: Node[] = [];
    while (parent.firstChild) {
      const node = parent.firstChild;

      // If we've found a raw text node, we need to split it on whitespace
      if (node instanceof Text) {
        let text = node,
            result: RegExpMatchArray;

        // But the easiest way to do it for text nodes is to call the splitText() method,
        // hence this inner loop here: we look for whitespace preceding a non-space character
        // (Note that it's safe to just use /\s/ because normalized the node above.)
        while ((result = text.textContent.match(/\s/)) !== null) {
          text = text.splitText(result.index + 1);

          // splitText() returns the newly-created node, which means that we can take the previous sibling and
          // remove it from the parent node
          const previous = text.previousSibling;
          parent.removeChild(previous);
          boxes.push(previous);
        }

        // Un-parent the last text node and push it to the array
        parent.removeChild(text);
        boxes.push(text);
      } else {
        // Assume that all other nodes are black boxes
        boxes.push(node);
        parent.removeChild(node);
      }
    }

    // Save the parent's x- and y-positions for copying into its child <tspan>s
    const x = parent.x.baseVal,
          y = parent.y.baseVal;

    // We need to save both the parent and sibling of `parent' in order to restore its place in the DOM.
    // If `sibling' is not null, we can restore the position of `parent' exactly by calling insertBefore().
    const saved = parent.parentNode,
          sibling = parent.nextSibling,
          svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    saved.removeChild(parent);
    svg.appendChild(parent);
    document.body.appendChild(svg);

    let current = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    parent.appendChild(current);

    // Copy `x' and `y' attributes into the newly-created element
    for (let i = 0; i < x.numberOfItems; i++) {
      current.x.baseVal.appendItem(x.getItem(i));
    }

    for (let i = 0; i < y.numberOfItems; i++) {
      current.y.baseVal.appendItem(y.getItem(i));
    }

    const lineHeight = 1.1;
    let lineno = 0;

    // This algorithm is blitheringly naive. It simply tries to put every node (text or element) on the same line
    // If the line exceeds the maximum width, then we create a new line, 1.1ems lower than the previous.
    for (const box of boxes) {
      current.appendChild(box);

      if (current.getComputedTextLength() > width) {
        current.removeChild(box);
        lineno++;

        current = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        current.appendChild(box);

        // Simulate a carriage return
        current.setAttribute('dy', (lineno * lineHeight) + 'em');

        for (let i = 0; i < x.numberOfItems; i++) {
          current.x.baseVal.appendItem(x.getItem(i));
        }

        for (let i = 0; i < y.numberOfItems; i++) {
          current.y.baseVal.appendItem(y.getItem(i));
        }
      }
    }

    if (!current.parentNode) {
      parent.appendChild(current);
    }

    svg.removeChild(parent);
    saved.insertBefore(parent, sibling);
    document.body.removeChild(svg);
  }

  /**
   * Determines the bottom of the em-box of the passed-in node.
   */
  function baseline(node: Element): number {
    const span = document.createElement('span');
    span.textContent = 'M';
    node.insertBefore(span, node.firstChild);

    const rect = span.getBoundingClientRect();
    const parent = node.getBoundingClientRect();
    const offset = offsetRect(parent, rect);

    const baseline = rect.height + offset.top;

    node.removeChild(span);

    return baseline;
  }

  /**
   * Determines the offset of a child element relative to some parent element.
   */
  function offset(parent: Element, child: Element): { top: number; left: number } {
    return offsetRect(parent.getBoundingClientRect(), child.getBoundingClientRect());
  }

  /**
   * Determines the offset of a child element's ClientRect relative to some parent element's ClientRect.
   */
  function offsetRect(parent: ClientRect, child: ClientRect): { top: number; left: number } {
    const top = child.top - parent.top;
    const left = child.left - parent.left;

    return {top, left};
  }
}
