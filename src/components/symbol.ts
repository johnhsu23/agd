import {symbol, SymbolType, symbols} from 'd3-shape';

const SQRT2 = Math.sqrt(2),
      POW3_14 = Math.pow(3, 0.25),
      POW3_34 = Math.pow(3, 0.75);

export default symbol;

export const hexagon: SymbolType = {
  draw(context, size) {
    const r = Math.sqrt(size),
          s = SQRT2 / POW3_34 * r,
          h = SQRT2 / POW3_14 * r;

    context.moveTo(s, 0);
    context.lineTo(s / 2, -h / 2);
    context.lineTo(-s / 2, -h / 2);
    context.lineTo(-s, 0);
    context.lineTo(-s / 2, h / 2);
    context.lineTo(s / 2, h / 2);
    context.closePath();
  },
};

export const gapDiamond: SymbolType = {
  draw(context, size) {
    const a = Math.sqrt(size),
          d = (SQRT2 * a) / 2;

    context.moveTo(0, -d);
    context.lineTo(d, 0);
    context.lineTo(0, d);
    context.lineTo(-d, 0);
    context.closePath();
  },
};

export const semicircle: SymbolType = {
  draw(context, size) {
    const r = Math.sqrt((size * 2) / Math.PI),
          y = r / 2;

    context.arc(0, y, r, 0, Math.PI, true);
    context.closePath();
  },
};

export const types = [
  symbols[0], // circle
  symbols[1], // cross
  symbols[2], // diamond
  symbols[3], // square
  hexagon,
  semicircle,
];
export {symbol};
