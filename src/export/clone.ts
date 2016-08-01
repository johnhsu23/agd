import applicableStyles from 'export/styles';

/**
 * Clones an SVG element, inlining and preserving all CSS styles.
 */
export default function clone(node: SVGSVGElement): SVGSVGElement {
  const clone = node.cloneNode(true) as SVGSVGElement;

  const styles = applicableStyles(node);
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = styles.join('\n');
  clone.insertBefore(style, clone.firstElementChild);

  return clone;
}
