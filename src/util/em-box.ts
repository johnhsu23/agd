import {rect as offsetRect} from 'util/offset';

/**
 * Determines the size of an em box for the given node.
 */
export default function emBox(node: HTMLElement): number {
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
