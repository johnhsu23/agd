import {Selection, mouse, event} from 'd3';
import Dialog from 'views/dialog';

const width = 95,
      height = 30,
      halfHeight = height / 2,
      backgroundOffset = 10,
      imageRadius = 10;

const foreground = `M0,0`
                 + `l${halfHeight},${halfHeight}`
                 + `h${width}`
                 + `v${-height}`
                 + `h${-width}`
                 + 'z';

const background = `M${width + halfHeight},${halfHeight}`
                 + `l${-halfHeight},${backgroundOffset}`
                 + `v${-halfHeight}`
                 + `z`;

export type Cutpoint = {
  value: number;
  label: string;
}

type Position = (position: number) => number;

export interface Cutpoints {
  <T>(selection: Selection<T>): void;

  image(): boolean;
  image(image: boolean): this;

  position(): Position;
  position(position: Position): this;

  cutpoints(): Cutpoint[];
  cutpoints(cutpoints: Cutpoint[]): this;
}

export default cutpoints;
export function cutpoints(): Cutpoints {
  type Setter<T> = {
    (): T;
    (value: T): Cutpoints;
  }

  let position: Position = x => x,
      points: Cutpoint[],
      showImage = true;

  const cutpoints = function <T>(selection: Selection<T>) {
    const cutpoints = selection.classed('cutpoints', true)
      .selectAll('.cutpoint')
      .data(points, point => point.label);

    cutpoints
      .interrupt()
      .transition()
      .duration(250)
      .attr('transform', d => `translate(0, ${position(d.value)})`);

    const enter = cutpoints.enter()
      .append('g')
      .classed('cutpoint', true)
      .attr('transform', d => `translate(0, ${position(d.value)})`);

    enter.append('path')
      .classed('cutpoint__background', true)
      .attr('d', background);

    enter.append('path')
      .classed('cutpoint__foreground', true)
      .attr('d', foreground);

    if (showImage) {
      const diameter = imageRadius * 2;
      enter.append('svg:a')
        .classed('cutpoint__link', true)
        .attr({
          'xlink:href': '#',
          transform: `translate(${width})`,
        })
        .on('click', function (acl) {
          const dialog = new Dialog;
          let [left, top] = mouse(document.body);

          (event as Event).preventDefault();

          // If this click event is synthetic, both offset values are 0
          // Which means that we'll just "borrow" the offset of the clicked element instead
          // in order to set the position of the overlay
          if (left === 0 && top === 0) {
            ({left, top} = $(this).offset());
          }

          dialog
            .position([left, top])
            .render()
            .$('.dialog__contents')
            .html(`<em>${acl.label}</em> (${acl.value})`);
        })
        .append('svg:image')
        .attr({
          'xlink:href': 'img/question.svg',
          width: diameter,
          height: diameter,
          transform: `translate(${-imageRadius}, ${-imageRadius})`,
        });
    }

    enter.append('text')
      .classed('cutpoint__text', true)
      .text(d => d.label)
      .attr('x', halfHeight)
      .attr('dy', '0.37em');

    cutpoints.exit()
      .remove();
  } as Cutpoints;

  cutpoints.position = function (value?: Position): Cutpoints | Position {
    if (arguments.length) {
      position = value;
      return cutpoints;
    }

    return position;
  } as Setter<Position>;

  cutpoints.image = function (value?: boolean): Cutpoints | boolean {
    if (arguments.length) {
      showImage = value;
      return cutpoints;
    }

    return showImage;
  } as Setter<boolean>;

  cutpoints.cutpoints = function (value?: Cutpoint[]): Cutpoints | Cutpoint[] {
    if (arguments.length) {
      points = value;
      return cutpoints;
    }

    return points;
  } as Setter<Cutpoint[]>;

  return cutpoints;
}
