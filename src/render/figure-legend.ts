import {select, Selection, BaseType} from 'd3-selection';

import ensureAttached from 'util/ensure-attached';
import * as offset from 'util/offset';
import emBox from 'util/em-box';
import wrap from 'util/wrap';

// Shorthand since we don't really care about the element types
type Sel<T, U> = Selection<BaseType, T, null, U>;

export default function render<T, U>(legend: Sel<T, U>): SVGSVGElement {
  const legendNode = legend.node() as Element;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const sel = select(svg);

  const {width, height} = legendNode.getBoundingClientRect();

  sel.attr('class', legend.attr('class'))
    .attr('width', width)
    .attr('height', height);

  legend.selectAll<HTMLDivElement, {}>('.legend__item')
    .each(function () {
      const {top} = offset.node(legendNode, this);

      const item = select(this);
      const row = sel.append('g')
        .attr('class', item.attr('class'))
        .attr('transform', `translate(0, ${top})`);

      item.call(renderItem, row);
    });

  return svg;
}

function renderItem<T1, T2, U1, U2>(item: Sel<T1, T2>, row: Sel<U1, U2>): void {
  item.select('.legend__marker')
    .call(renderMarker, row);

  item.select('.legend__description')
    .call(renderDescription, row);
}

function renderMarker<T1, T2, U1, U2>(marker: Sel<T1, T2>, row: Sel<U1, U2>): void {
  if (marker.classed('legend__marker--text')) {
    renderTextMarker(marker, row);
  } else if (marker.classed('legend__marker--path')) {
    renderPathMarker(marker, row);
  } else {
    throw new Error(`Don't know how to handle marker with classes "${marker.attr('class')}"`);
  }
}

function renderTextMarker<T1, T2, U1, U2>(marker: Sel<T1, T2>, row: Sel<U1, U2>): void {
  const node = marker.node() as HTMLElement;

  // Our x-position will be computed based on existing display (since we want to center it inside a table-cell box)
  const width = node.getBoundingClientRect().width;

  row.append('text')
    .attr('dominant-baseline', 'text-after-edge')
    .attr('class', marker.attr('class'))
    .attr('x', width / 2)
    .attr('y', emBox(node))
    .attr('text-anchor', 'middle')
    .text(marker.text());
}

function renderPathMarker<T1, T2, U1, U2>(marker: Sel<T1, T2>, row: Sel<U1, U2>): void {
  const node = marker.node() as SVGSVGElement,
        svg = node.cloneNode(true) as SVGSVGElement,
        bounds = node.getBoundingClientRect();

  svg.setAttribute('width', '' + bounds.width);
  svg.setAttribute('height', '' + bounds.height);

  row.append(() => svg);
}

function renderDescription<T1, T2, U1, U2>(description: Sel<T1, T2>, row: Sel<U1, U2>): void {
  const node = description.node() as HTMLElement;
  const metrics = node.getBoundingClientRect();
  const {left} = offset.rect(node.parentElement.getBoundingClientRect(), metrics);

  const text = row.append<SVGTextElement>('text')
    .attr('class', description.attr('class'))
    .attr('dominant-baseline', 'text-after-edge')
    .attr('x', left)
    .attr('y', emBox(node));

  const nodes = node.childNodes;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes.item(i);

    if (node instanceof Text) {
      text.append(() => node.cloneNode() as Element);
    } else if (node instanceof Element) {
      text.append('tspan')
        .attr('class', node.getAttribute('class'))
        .text(node.textContent);
    }
  }

  const textNode = text.node() as SVGTextElement,
        parent = textNode.parentNode,
        sibling = textNode.nextSibling,
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  parent.removeChild(textNode);
  svg.appendChild(textNode);

  ensureAttached(svg, () => {
    wrap(text, metrics.width);
  });

  svg.removeChild(textNode);
  parent.insertBefore(textNode, sibling);
}
