type Offset = {
  top: number;
  left: number;
};

export function node(parent: Element, child: Element): Offset {
  return rect(parent.getBoundingClientRect(), child.getBoundingClientRect());
}

export function rect(parent: ClientRect, child: ClientRect): Offset {
  const top = child.top - parent.top;
  const left = child.left - parent.left;

  return {top, left};
}
