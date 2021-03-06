import {Selection} from 'd3-selection';

import wrap from 'util/wrap';

// Minimum interface needed for ordinal scales
interface OrdinalScale<Domain> {
  (value: Domain): number;

  domain(): Domain[];

  bandwidth(): number;
}

export interface Axis<Domain> {
  /**
   * Draw an axis on this container element. Because this uses the `wrap` utility internally, it is best to draw this
   * axis when the container is attached and visible on the page.
   */
  <T, U>(selection: Selection<SVGGElement | SVGSVGElement, T, null, U>): void;

  /**
   * Returns the ordinal scale associated with this axis.
   */
  scale(): OrdinalScale<Domain>;

  /**
   * Sets the ordinal scale associated with this axis.
   */
  scale(scale: OrdinalScale<Domain>): this;

  /**
   * Returns the labels used by this axis. If `null`, then the scale's own domain will be used.
   */
  categories(): string[];

  /**
   * Override the category labels used by this axis. If set to `null`, the scale's domain will be used.
   */
  categories(categories: string[]): this;

  /*
   * Returns the wrap width used by this scale.
   */
  wrap(): number;

  /**
   * Set the wrap width for this scale. Category labels are automatically wrapped to the specified width; if set to a
   * falsey value, the scale's band width is used instead.
   */
  wrap(wrap: number): this;

  title(): string[];

  /**
   * Set the title of this axis.
   */
  title(title: string | string[]): this;
}

type AxisArgs = {
  vertical: boolean;
  length: number;
  title: {
    x: number;
    y: number;
  }
};

function makeAxis<Domain>(args: AxisArgs): Axis<Domain> {
  type Setter<T> = {
    (): T;
    (value: T): Axis<Domain>;
  }

  const {vertical, length} = args,
        modifier = vertical ? 'vertical-left' : 'horizontal-bottom',
        x = vertical ? -5 : 0,
        y = vertical ? 0 : '1.37em',
        position = vertical ? verticalPosition : horizontalPosition;

  let categories: string[],
      // The custom wrapping width -- if falsey, use the scale's bandwidth instead
      wrapWidth = 0,
      scale: OrdinalScale<Domain>;

  let title: string[] = [];

  const axis = function <T, U>(selection: Selection<SVGGElement | SVGSVGElement, T, null, U>): void {
    selection.classed(`axis axis--${modifier}`, true);

    const direction = (vertical) ? 'y' : 'x';
    let axisLine = selection.select('.axis__line');
    if (axisLine.empty()) {
      axisLine = selection.append('line')
        .classed('axis__line', true);
    }

    axisLine
      .attr(direction + '1', 0)
      .attr(direction + '2', length);

    const bandWidth = scale.bandwidth(),
          domain = scale.domain();

    const tickUpdate = selection.selectAll<SVGGElement, string>('.axis__tick')
      .data(domain);

    tickUpdate.exit()
      .remove();

    const tickEnter = tickUpdate.enter()
      .append<SVGGElement>('g')
      .classed('axis__tick', true);

    const label = categories
                // Overridden category labels
                ? (_: Domain, i: number) => categories[i]
                // Assume the scale's domain is valid when stringified
                : (d: Domain) => (d as any);

    tickEnter.append('text')
      .classed('axis__label', true)
      .attr('x', x)
      .attr('y', y)
      .merge(tickUpdate.select('.axis__label'))
      .text(label);

    const merged = tickUpdate.merge(tickEnter);

    // Wrap category labels
    merged.select('.axis__label')
      .call(wrap, wrapWidth || bandWidth);

    // Update the position of each axis tick. We do this after wrap is called because it lets the verticalPosition()
    // function use the computed metrics of the labels to do some nice vertical centering.
    merged.call(position);

    let axisTitle = selection.select('.axis__title');
    if (axisTitle.empty()) {
      axisTitle = selection.append('text')
        .classed('axis__title', true);
    }

    const titleArgs = args.title,
          titleLength = title.length - 1;

    const tspanUpdate = axisTitle.selectAll('tspan')
          .data(title);

    tspanUpdate.enter()
      .append('tspan')
      .attr('x', titleArgs.x)
      .attr('y', titleArgs.y)
      .attr('dy', (_, index) => (titleLength - index) * -1.1 + 'em')
      .merge(tspanUpdate)
      .text(d => d);
  } as Axis<Domain>;

  axis.categories = function (value?: string[]): Axis<Domain> | string[] {
    if (arguments.length) {
      categories = value;
      return axis;
    }

    return categories;
  } as Setter<string[]>;

  axis.scale = function (value?: OrdinalScale<Domain>): Axis<Domain> | OrdinalScale<Domain> {
    if (arguments.length) {
      scale = value;
      return axis;
    }

    return scale;
  } as Setter<OrdinalScale<Domain>>;

  axis.wrap = function (value?: number): Axis<Domain> | number {
    if (arguments.length) {
      wrapWidth = +value;

      return axis;
    }

    // if wrapWidth is falsey, we use bandWidth instead
    return wrapWidth || scale.bandwidth();
  } as Setter<number>;

  axis.title = function (value?: string | string[]): string | string[] | Axis<Domain> {
    if (arguments.length) {
      if (typeof value === 'string') {
        title = [value];
      } else {
        title = value;
      }
      return axis;
    }
    return title;
  } as Setter<string[]>;

  return axis;

  function horizontalPosition(selection: Selection<SVGGElement, Domain, null, null>): void {
    const offset = scale.bandwidth() / 2;

    selection.attr('transform', d => `translate(${scale(d) + offset})`);
  }

  function verticalPosition(selection: Selection<SVGGElement, Domain, null, null>): void {
    const offset = scale.bandwidth() / 2;

    // For each axis tick (the <g> element), vertically center the labels
    selection.each(function (d) {
      // First, determine the y-coordinate of the center of this scale band
      const position = scale(d) + offset;

      // Now, get the metrics of this element
      const {y, height} = this.getBBox();

      // Now that we have the metrics, we can figure out the amount we need to translate up in order to center the
      // bounding box around the center of the scale band.
      // Put another way, `adjust' is the value that we need to use in order to "solve" y + height/2 - adjust == offset.
      const adjust = height / 2 + y;

      const transform = this.ownerSVGElement.createSVGTransform();
      transform.setTranslate(0, position - adjust); // SVG coordinates: negative y moves up

      this.transform.baseVal.initialize(transform);
    });
  }
}

export function verticalLeft(length: number): Axis<string>;
export function verticalLeft<Domain>(length: number): Axis<Domain>;
export function verticalLeft<Domain>(length: number): Axis<Domain> {
  return makeAxis<Domain>({
    vertical: true,
    length,
    title: {
      x: -95,
      y: -15,
    },
  });
}
export function horizontalBottom(length: number): Axis<string>;
export function horizontalBottom<Domain>(length: number): Axis<Domain>;
export function horizontalBottom<Domain>(length: number): Axis<Domain> {
  return makeAxis<Domain>({
    vertical: false,
    length,
    title: {
      x: 0,
      y: 40,
    },
  });
}
