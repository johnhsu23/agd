/**
 * Utility function: ensure the passed-in `node` is attached to the document.
 * It is attached directly to the <body> temporarily if need be.
 *
 * This is especially useful in the case of handling SVG elements, which have no metrics (i.e., bounding boxes) unless
 * they are attached to the document and visible.
 */
export default function ensureAttached<NodeType extends Node, T>(node: NodeType, callback: (node: NodeType) => T): T {
  const needsDetach = !node.parentNode;
  if (needsDetach) {
    document.body.appendChild(node);
  }

  try {
    return callback(node);
  } finally {
    if (needsDetach) {
      document.body.removeChild(node);
    }
  }
}
