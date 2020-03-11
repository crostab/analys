import { Pivot } from '@analys/pivot';
import { Cubic } from '@analys/cubic';
import { CrosTab } from '@analys/crostab';
import { slice } from '@analys/table-init';
import { tableFilter } from '@analys/table-filter';
import * as Mapper from '@vect/vector-mapper';
import { iterate as iterate$1, mutate as mutate$2, mapper as mapper$4 } from '@vect/vector-mapper';
import { parseCell, parseFieldSet } from '@analys/tablespec';
import { tableFind } from '@analys/table-find';
import { isMatrix } from '@vect/matrix';
import { FUN, SYM, UND, BOO, BIG, NUM as NUM$1, OBJ as OBJ$1, STR as STR$1, SET, MAP, OBJECT, ARRAY } from '@typen/enums';
import { mutate as mutate$3 } from '@vect/entries-mapper';

/**
 *
 * @param {TableObject} table
 * @param {str} side
 * @param {str} banner
 * @param {CubeCell|CubeCell[]} [cell]
 * @param {Filter|Filter[]} [filter]
 * @param {function():number} formula - formula is valid only when cell is CubeCell array.
 * @returns {CrosTab}
 */

const pivotDev = (table, {
  side,
  banner,
  cell,
  filter,
  formula
}) => {
  if (filter) {
    var _table;

    table = tableFilter.call((_table = table, slice(_table)), filter);
  }

  const {
    head,
    rows
  } = table,
        [x, y] = [head.indexOf(side), head.indexOf(banner)];
  let pivotter;
  const pivot = Array.isArray(cell = parseCell(cell, side)) ? (pivotter = true, Cubic.build(x, y, (iterate$1(cell, appendIndex.bind(head)), cell))) : (pivotter = false, Pivot.build(x, y, head.indexOf(cell.field), cell.mode));
  const crostab = CrosTab.from(pivot.spread(rows).toJson());
  if (pivotter && formula) crostab.map(ar => formula.apply(null, ar));
  return crostab;
};

const appendIndex = function (cell) {
  cell.index = this.indexOf(cell.field);
};

const isNumeric = x => !!(x = +x) || x === 0; // from x => typeof x

// let protoType = function (it) {
//   const raw = typeof it;
//   if (raw === "object") {
//     switch (true) {
//       case (it instanceof Array):
//         return "array";
//       case (it instanceof Map):
//         return "map";
//       case (it instanceof Set):
//         return "set";
//       case (it instanceof Function):
//         return "function";
//       default:
//         return raw;
//     }
//   } else {
//     return raw
//   }
// };
const oc = Object.prototype.toString;
/**
 * const rxObj = /^\[object (.*)]$/
 * Equivalent to: Object.prototype.stringify.call(o).match(rxObj)[1]
 * @param {*} o
 * @return {string}
 */

const otype = o => oc.call(o).slice(8, -1);
const NUM = 'number';
const STR = 'string';
const OBJ = 'object';
/**
 * validate
 * @param x
 * @param y
 * @returns {number}
 */


const vdt = (x, y) => isNaN(x - y) ? NaN : y;

class Num {
  // Angular 4.3
  static isNumeric(x) {
    return !isNaN(x - parseFloat(x));
  }

  static numeric(x) {
    return vdt(x, parseFloat(x));
  }

  static inferData(x) {
    const t = typeof x;
    return t === STR ? isNaN(x - parseFloat(x)) ? STR : NUM : t === OBJ ? otype(x).toLowerCase() : t;
  }

}

const check = x => !!x || x === 0;

class NumLoose {
  static isNumeric(x) {
    return check(+x);
  }

  static numeric(x) {
    x = +x;
    return check(x) ? x : NaN;
  }
  /**
   *
   * @param {*} x
   * @return {string}
   */


  static inferData(x) {
    const t = typeof x;
    return t === STR ? check(+x) ? NUM : STR : t === OBJ ? otype(x).toLowerCase() : t;
  }

}
const STRING = 'string';

/**
 *
 * @param {number} x
 * @returns {number}
 */
/**
 *
 * @param {number} x
 * @returns {number}
 */


const round = x => x + (x > 0 ? 0.5 : -0.5) << 0;

const rgbToInt = ([r, g, b]) => ((r & 0xFF) << 16) + ((g & 0xFF) << 8) + (b & 0xFF);
/**
 * @param {[number,number,number]} rgb
 * @returns {string}
 */


const rgbToHex = rgb => '#' + rgbToInt(rgb).toString(16).toUpperCase().padStart(6, '0');

const hue = (r, g, b, max, dif) => {
  if (dif === 0) return 0;

  switch (max) {
    case r:
      return ((g - b) / dif + (g < b ? 6 : 0)) % 6;

    case g:
      return (b - r) / dif + 2;

    case b:
      return (r - g) / dif + 4;
  }
};

const bound = ([r, g, b]) => {
  let ma = r,
      mi = r;

  if (g > r) {
    ma = g;
  } else {
    mi = g;
  }

  if (b > ma) ma = b;
  if (b < mi) mi = b;
  return {
    max: ma,
    sum: ma + mi,
    dif: ma - mi
  };
};

const THSD = 1000;
/**
 * !dif: dif===0
 * @param {number} r - [0,255]
 * @param {number} g - [0,255]
 * @param {number} b - [0,255]
 * @returns {[number,number,number]} [Hue([0,360]), Saturation([0,100]), Lightness([0,100])]
 */

function rgbToHsl([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;
  const {
    max,
    sum,
    dif
  } = bound([r, g, b]);
  let h = hue(r, g, b, max, dif) * 60,
      s = !dif ? 0 : sum > 1 ? dif / (2 - sum) : dif / sum,
      l = sum / 2;
  return [round(h), round(s * THSD) / 10, round(l * THSD) / 10];
}

const diluteHex = (hex, hi) => {
  hi = hi || hex.length;
  let x = '';

  for (let i = 0, el; i < hi; i++) {
    el = hex[i];
    x += el + el;
  } // for (let c of hex) x += c + c


  return x;
};
/**
 *
 * @param {string} hex
 * @returns {number}
 */


function hexToInt(hex) {
  if (hex.charAt(0) === '#') hex = hex.substring(1);
  if (!hex[3]) hex = diluteHex(hex);
  return parseInt(hex, 16);
}
/**
 *
 * @param {string} hex
 * @returns {number[]}
 */


function hexToRgb(hex) {
  const int = hexToInt(hex);
  return [int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF];
}

const hexToHsl = hex => {
  var _ref, _hex;

  return _ref = (_hex = hex, hexToRgb(_hex)), rgbToHsl(_ref);
};
/**
 *
 * @param {number} n
 * @param {number} h
 * @param {number} a
 * @param {number} l
 * @returns {number}
 */


const hf = (n, h, a, l) => {
  const k = (n + h / 30) % 12;
  return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
};
/**
 *
 * @param {number} h
 * @param {number} s
 * @param {number} l
 * @returns {number[]}
 */


function hslToRgb([h, s, l]) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l),
        r = hf(0, h, a, l),
        g = hf(8, h, a, l),
        b = hf(4, h, a, l);
  return [round(r * 0xFF), round(g * 0xFF), round(b * 0xFF)]; // return [r * 0xFF & 0xFF, g * 0xFF & 0xFF, b * 0xFF & 0xFF]
}

const hslToHex = hsl => {
  var _ref, _hsl;

  return _ref = (_hsl = hsl, hslToRgb(_hsl)), rgbToHex(_ref);
};

const ESC = '\u001b';
const L = ESC + '[';
const R = 'm';
const SC = ';';
const FORE = '38;2';
const CLR_FORE = '39';
//   black: 30,
//   Red: 31,
//   Green: 32,
//   Yellow: 33,
//   Blue: 34,
//   magenta: 35,
//   Cyan: 36,
//   white: 37,
//   Grey: 90,
// }

const BOLD = '1';
const ITALIC = '3';
const UNDERLINE = '4';
const INVERSE = '7';
const CLR_BOLD = '22';
const CLR_ITALIC = '23';
const CLR_UNDERLINE = '24';
const CLR_INVERSE = '27';
const Effects = {
  bold: [BOLD, CLR_BOLD],
  italic: [ITALIC, CLR_ITALIC],
  underline: [UNDERLINE, CLR_UNDERLINE],
  inverse: [INVERSE, CLR_INVERSE]
};
/**
 *
 * @param {string} code
 * @returns {string}
 */


const brt = code => L + code + R;
/**
 *
 * @param {number[]} rgb - array of three integers, each from 0 to 255
 * @returns {string}
 */


const rgbToAnsi = rgb => FORE + SC + rgb[0] + SC + rgb[1] + SC + rgb[2];

/**
 *
 * @param {string} tx
 * @returns {string}
 */

function codedDyer(tx) {
  const {
    h,
    t
  } = this;
  return brt(h) + tx + brt(t);
}

const parseEffects = effects => {
  let h = '',
      t = '';

  if (effects.length) {
    let l, r;

    for (let e of effects) if (e in Effects && ([l, r] = Effects[e])) h += SC + l, t += SC + r;
  }

  return {
    h,
    t
  };
};
/***
 *
 * @param {number[]} rgb
 * @param {...string} [effects]
 * @returns {function(string):string}
 */


const Dye = (rgb, ...effects) => {
  const config = parseEffects(effects);
  config.h += SC + rgbToAnsi(rgb), config.t += SC + CLR_FORE;
  return codedDyer.bind(config);
};

const PrepDye = function (...effects) {
  const config = parseEffects(effects);
  return RgbDyerCreator.bind(config);
};

const RgbDyerCreator = function (rgb) {
  let {
    h,
    t
  } = this;
  h += SC + rgbToAnsi(rgb), t += SC + CLR_FORE;
  return codedDyer.bind({
    h,
    t
  });
};

const STAT_BOUND_CONFIG = {
  dif: true,
  level: 2
};
const {
  isNumeric: isNumeric$1
} = Num;
/**
 * Create a dye from a hsl array
 * @param {[number,number,number]} hsl
 * @returns {function}
 */

const hslToDye = hsl => {
  var _ref, _hsl;

  return _ref = (_hsl = hsl, hslToRgb(_hsl)), Dye(_ref);
};

const leverage = ([h, s, l], base) => [h / base, s / base, l / base];

const amp = (x, min, lever, base) => (x - min) * lever + base;

const dyeBlender = function (x) {
  var _ref;

  const {
    min: m,
    lever: [rH, rS, rL],
    base: [mH, mS, mL]
  } = this;
  return _ref = [amp(x, m, rH, mH), amp(x, m, rS, mS), amp(x, m, rL, mL)], hslToDye(_ref);
};
/**
 *
 * @param {{min:number,dif:number}} valueLeap
 * @param {{min:number[],dif:number[]}} colorLeap
 * @returns {function(*):function}
 * @constructor
 */


const BlendDye = (valueLeap, colorLeap) => dyeBlender.bind({
  min: valueLeap.min,
  lever: leverage(colorLeap.dif, valueLeap.dif),
  base: colorLeap.min
});

const parseHsl = color => {
  var _color;

  return typeof color === STRING ? (_color = color, hexToHsl(_color)) : color;
};
/**
 *
 * @param max
 * @param min
 * @returns {{dif: [number,number,number], min: [number,number,number]}}
 */


const colorBound = ([maxH, maxS, maxL], [minH, minS, minL]) => ({
  min: [minH, minS, minL],
  dif: [maxH - minH, maxS - minS, maxL - minL]
});

const presetToLeap = ({
  max,
  min
}) => {
  var _max, _min;

  return colorBound((_max = max, parseHsl(_max)), (_min = min, parseHsl(_min)));
};

const presetToFlatDye = ({
  na
}) => {
  var _ref, _na;

  return _ref = (_na = na, parseHsl(_na)), hslToDye(_ref);
};
/**
 *
 * @param {*[]} vec
 * @param {*[]} values
 * @param {function(*[],function(*):*):*[]} mapper
 * @param {function} primeDye
 * @param {{dif:number,min:number}} valueLeap
 * @param {{dif:number[],min:number[]}} colorLeap
 * @param {boolean} colorant
 * @returns {function[]|*[]}
 */


const dyeMap = (vec, {
  mapper,
  primeDye,
  valueLeap,
  colorLeap,
  colorant
}) => {
  var _colorLeap$min;

  let blendDye;
  return valueLeap.dif && colorLeap.dif.some(n => !!n) ? (blendDye = BlendDye(valueLeap, colorLeap), colorant ? mapper(vec, x => isNumeric$1(x) ? blendDye(x) : primeDye) : mapper(vec, x => {
    var _x, _x2;

    return isNumeric$1(x) ? (_x = x, blendDye(x)(_x)) : (_x2 = x, primeDye(_x2));
  })) : (blendDye = (_colorLeap$min = colorLeap.min, hslToDye(_colorLeap$min)), colorant ? mapper(vec, x => isNumeric$1(x) ? blendDye : primeDye) : mapper(vec, x => {
    var _x3, _x4;

    return isNumeric$1(x) ? (_x3 = x, blendDye(_x3)) : (_x4 = x, primeDye(_x4));
  }));
};
/**
 *
 * @param {*[]} keys
 * @param {*[]} values
 * @param {function(*[],function(*)):*[]} mapper
 * @param {function(*[],*[],function(*,*)):*[]} zipper
 * @param {function(*):string} primeDye
 * @param {{dif:number,min:number}} valueLeap
 * @param {{dif:number[],min:number[]}} colorLeap
 * @param {boolean} colorant
 * @returns {function[]|*[]}
 */


const dyeZip = (keys, {
  values,
  mapper,
  zipper,
  primeDye,
  valueLeap,
  colorLeap,
  colorant
}) => {
  var _colorLeap$min;

  if (!values) return dyeMap(keys, {
    mapper,
    primeDye,
    valueLeap,
    colorLeap,
    colorant
  });
  let blendDye;
  const fn = valueLeap.dif && colorLeap.dif.some(n => !!n) ? (blendDye = BlendDye(valueLeap, colorLeap), colorant ? (x, v) => isNumeric$1(v) ? blendDye(v) : primeDye : (x, v) => {
    var _x, _x2;

    return isNumeric$1(v) ? (_x = x, blendDye(v)(_x)) : (_x2 = x, primeDye(_x2));
  }) : (blendDye = (_colorLeap$min = colorLeap.min, hslToDye(_colorLeap$min)), colorant ? (x, v) => isNumeric$1(v) ? blendDye : primeDye : (x, v) => {
    var _x3, _x4;

    return isNumeric$1(v) ? (_x3 = x, blendDye(_x3)) : (_x4 = x, primeDye(_x4));
  });
  return zipper(keys, values, fn);
};
/**
 *
 * @param {*[]} keys
 * @param {*[]} values
 * @param {function(*[],function(*)):*[]} mapper
 * @param {function(*[],*[],function(*,*)):*[]} zipper
 * @param {function(*[],{dif:boolean,level:number}):{min:number,dif:number}} bound
 * @param {{max:string,min:string,na:string}} preset
 * @param {boolean} colorant
 * @returns {function[]|*[]}
 */


const fluoZip = (keys, {
  values,
  mapper,
  zipper,
  bound,
  preset,
  colorant = false
} = {}) => {
  var _preset, _preset2;

  return dyeZip(keys, {
    values,
    mapper,
    zipper,
    primeDye: (_preset = preset, presetToFlatDye(_preset)),
    colorLeap: (_preset2 = preset, presetToLeap(_preset2)),
    valueLeap: bound(values || keys, STAT_BOUND_CONFIG),
    colorant
  });
};

const Red = {
  base: '#F44336',
  lighten_5: '#FFEBEE',
  lighten_4: '#FFCDD2',
  lighten_3: '#EF9A9A',
  lighten_2: '#E57373',
  lighten_1: '#EF5350',
  darken_1: '#E53935',
  darken_2: '#D32F2F',
  darken_3: '#C62828',
  darken_4: '#B71C1C',
  accent_1: '#FF8A80',
  accent_2: '#FF5252',
  accent_3: '#FF1744',
  accent_4: '#D50000'
};
const Pink = {
  base: '#E91E63',
  lighten_5: '#FCE4EC',
  lighten_4: '#F8BBD0',
  lighten_3: '#F48FB1',
  lighten_2: '#F06292',
  lighten_1: '#EC407A',
  darken_1: '#D81B60',
  darken_2: '#C2185B',
  darken_3: '#AD1457',
  darken_4: '#880E4F',
  accent_1: '#FF80AB',
  accent_2: '#FF4081',
  accent_3: '#F50057',
  accent_4: '#C51162'
};
const Purple = {
  base: '#9C27B0',
  lighten_5: '#F3E5F5',
  lighten_4: '#E1BEE7',
  lighten_3: '#CE93D8',
  lighten_2: '#BA68C8',
  lighten_1: '#AB47BC',
  darken_1: '#8E24AA',
  darken_2: '#7B1FA2',
  darken_3: '#6A1B9A',
  darken_4: '#4A148C',
  accent_1: '#EA80FC',
  accent_2: '#E040FB',
  accent_3: '#D500F9',
  accent_4: '#AA00FF'
};
const DeepPurple = {
  base: '#673AB7',
  lighten_5: '#EDE7F6',
  lighten_4: '#D1C4E9',
  lighten_3: '#B39DDB',
  lighten_2: '#9575CD',
  lighten_1: '#7E57C2',
  darken_1: '#5E35B1',
  darken_2: '#512DA8',
  darken_3: '#4527A0',
  darken_4: '#311B92',
  accent_1: '#B388FF',
  accent_2: '#7C4DFF',
  accent_3: '#651FFF',
  accent_4: '#6200EA'
};
const Indigo = {
  base: '#3F51B5',
  lighten_5: '#E8EAF6',
  lighten_4: '#C5CAE9',
  lighten_3: '#9FA8DA',
  lighten_2: '#7986CB',
  lighten_1: '#5C6BC0',
  darken_1: '#3949AB',
  darken_2: '#303F9F',
  darken_3: '#283593',
  darken_4: '#1A237E',
  accent_1: '#8C9EFF',
  accent_2: '#536DFE',
  accent_3: '#3D5AFE',
  accent_4: '#304FFE'
};
const Blue = {
  base: '#2196F3',
  lighten_5: '#E3F2FD',
  lighten_4: '#BBDEFB',
  lighten_3: '#90CAF9',
  lighten_2: '#64B5F6',
  lighten_1: '#42A5F5',
  darken_1: '#1E88E5',
  darken_2: '#1976D2',
  darken_3: '#1565C0',
  darken_4: '#0D47A1',
  accent_1: '#82B1FF',
  accent_2: '#448AFF',
  accent_3: '#2979FF',
  accent_4: '#2962FF'
};
const LightBlue = {
  base: '#03A9F4',
  lighten_5: '#E1F5FE',
  lighten_4: '#B3E5FC',
  lighten_3: '#81D4FA',
  lighten_2: '#4FC3F7',
  lighten_1: '#29B6F6',
  darken_1: '#039BE5',
  darken_2: '#0288D1',
  darken_3: '#0277BD',
  darken_4: '#01579B',
  accent_1: '#80D8FF',
  accent_2: '#40C4FF',
  accent_3: '#00B0FF',
  accent_4: '#0091EA'
};
const Cyan = {
  base: '#00BCD4',
  lighten_5: '#E0F7FA',
  lighten_4: '#B2EBF2',
  lighten_3: '#80DEEA',
  lighten_2: '#4DD0E1',
  lighten_1: '#26C6DA',
  darken_1: '#00ACC1',
  darken_2: '#0097A7',
  darken_3: '#00838F',
  darken_4: '#006064',
  accent_1: '#84FFFF',
  accent_2: '#18FFFF',
  accent_3: '#00E5FF',
  accent_4: '#00B8D4'
};
const Teal = {
  base: '#009688',
  lighten_5: '#E0F2F1',
  lighten_4: '#B2DFDB',
  lighten_3: '#80CBC4',
  lighten_2: '#4DB6AC',
  lighten_1: '#26A69A',
  darken_1: '#00897B',
  darken_2: '#00796B',
  darken_3: '#00695C',
  darken_4: '#004D40',
  accent_1: '#A7FFEB',
  accent_2: '#64FFDA',
  accent_3: '#1DE9B6',
  accent_4: '#00BFA5'
};
const Green = {
  base: '#4CAF50',
  lighten_5: '#E8F5E9',
  lighten_4: '#C8E6C9',
  lighten_3: '#A5D6A7',
  lighten_2: '#81C784',
  lighten_1: '#66BB6A',
  darken_1: '#43A047',
  darken_2: '#388E3C',
  darken_3: '#2E7D32',
  darken_4: '#1B5E20',
  accent_1: '#B9F6CA',
  accent_2: '#69F0AE',
  accent_3: '#00E676',
  accent_4: '#00C853'
};
const LightGreen = {
  base: '#8BC34A',
  lighten_5: '#F1F8E9',
  lighten_4: '#DCEDC8',
  lighten_3: '#C5E1A5',
  lighten_2: '#AED581',
  lighten_1: '#9CCC65',
  darken_1: '#7CB342',
  darken_2: '#689F38',
  darken_3: '#558B2F',
  darken_4: '#33691E',
  accent_1: '#CCFF90',
  accent_2: '#B2FF59',
  accent_3: '#76FF03',
  accent_4: '#64DD17'
};
const Lime = {
  base: '#CDDC39',
  lighten_5: '#F9FBE7',
  lighten_4: '#F0F4C3',
  lighten_3: '#E6EE9C',
  lighten_2: '#DCE775',
  lighten_1: '#D4E157',
  darken_1: '#C0CA33',
  darken_2: '#AFB42B',
  darken_3: '#9E9D24',
  darken_4: '#827717',
  accent_1: '#F4FF81',
  accent_2: '#EEFF41',
  accent_3: '#C6FF00',
  accent_4: '#AEEA00'
};
const Yellow = {
  base: '#FFEB3B',
  lighten_5: '#FFFDE7',
  lighten_4: '#FFF9C4',
  lighten_3: '#FFF59D',
  lighten_2: '#FFF176',
  lighten_1: '#FFEE58',
  darken_1: '#FDD835',
  darken_2: '#FBC02D',
  darken_3: '#F9A825',
  darken_4: '#F57F17',
  accent_1: '#FFFF8D',
  accent_2: '#FFFF00',
  accent_3: '#FFEA00',
  accent_4: '#FFD600'
};
const Amber = {
  base: '#FFC107',
  lighten_5: '#FFF8E1',
  lighten_4: '#FFECB3',
  lighten_3: '#FFE082',
  lighten_2: '#FFD54F',
  lighten_1: '#FFCA28',
  darken_1: '#FFB300',
  darken_2: '#FFA000',
  darken_3: '#FF8F00',
  darken_4: '#FF6F00',
  accent_1: '#FFE57F',
  accent_2: '#FFD740',
  accent_3: '#FFC400',
  accent_4: '#FFAB00'
};
const Orange = {
  base: '#FF9800',
  lighten_5: '#FFF3E0',
  lighten_4: '#FFE0B2',
  lighten_3: '#FFCC80',
  lighten_2: '#FFB74D',
  lighten_1: '#FFA726',
  darken_1: '#FB8C00',
  darken_2: '#F57C00',
  darken_3: '#EF6C00',
  darken_4: '#E65100',
  accent_1: '#FFD180',
  accent_2: '#FFAB40',
  accent_3: '#FF9100',
  accent_4: '#FF6D00'
};
const DeepOrange = {
  base: '#FF5722',
  lighten_5: '#FBE9E7',
  lighten_4: '#FFCCBC',
  lighten_3: '#FFAB91',
  lighten_2: '#FF8A65',
  lighten_1: '#FF7043',
  darken_1: '#F4511E',
  darken_2: '#E64A19',
  darken_3: '#D84315',
  darken_4: '#BF360C',
  accent_1: '#FF9E80',
  accent_2: '#FF6E40',
  accent_3: '#FF3D00',
  accent_4: '#DD2C00'
};
const Brown = {
  base: '#795548',
  lighten_5: '#EFEBE9',
  lighten_4: '#D7CCC8',
  lighten_3: '#BCAAA4',
  lighten_2: '#A1887F',
  lighten_1: '#8D6E63',
  darken_1: '#6D4C41',
  darken_2: '#5D4037',
  darken_3: '#4E342E',
  darken_4: '#3E2723',
  accent_1: '#D2BEB6',
  accent_2: '#B59387',
  accent_3: '#A27767',
  accent_4: '#855F51'
};
const BlueGrey = {
  base: '#607D8B',
  lighten_5: '#ECEFF1',
  lighten_4: '#CFD8DC',
  lighten_3: '#B0BEC5',
  lighten_2: '#90A4AE',
  lighten_1: '#78909C',
  darken_1: '#546E7A',
  darken_2: '#455A64',
  darken_3: '#37474F',
  darken_4: '#263238',
  accent_1: '#B7C9D1',
  accent_2: '#89A5B3',
  accent_3: '#6A8EA0',
  accent_4: '#547383'
};
const Grey = {
  base: '#9E9E9E',
  lighten_5: '#FAFAFA',
  lighten_4: '#F5F5F5',
  lighten_3: '#EEEEEE',
  lighten_2: '#E0E0E0',
  lighten_1: '#BDBDBD',
  darken_1: '#757575',
  darken_2: '#616161',
  darken_3: '#424242',
  darken_4: '#212121',
  accent_1: '#C4C4C4',
  accent_2: '#9E9E9E',
  accent_3: '#858585',
  accent_4: '#6B6B6B'
};
/**
 * @type {Object.<string,Object<string,Object>>}
 * @property {string[]} colors
 * @property {string[]} degrees
 */

const Cards = {
  red: Red,
  pink: Pink,
  purple: Purple,
  deepPurple: DeepPurple,
  indigo: Indigo,
  blue: Blue,
  lightBlue: LightBlue,
  cyan: Cyan,
  teal: Teal,
  green: Green,
  lightGreen: LightGreen,
  lime: Lime,
  yellow: Yellow,
  amber: Amber,
  orange: Orange,
  deepOrange: DeepOrange,
  brown: Brown,
  blueGrey: BlueGrey,
  grey: Grey
};
Reflect.defineProperty(Cards, 'colors', {
  get() {
    return Object.keys(Cards);
  },

  enumerable: false
});
Reflect.defineProperty(Cards, 'degrees', {
  get() {
    for (let color in Cards) return Object.keys(Cards[color]);
  },

  enumerable: false
});

const AQUA = {
  max: Cards.cyan.accent_2,
  min: Cards.green.darken_1,
  na: Cards.grey.lighten_4
};
const AURORA = {
  max: Cards.green.accent_4,
  min: Cards.deepPurple.darken_2,
  na: Cards.grey.darken_2
};
const FRESH = {
  max: Cards.lightGreen.accent_3,
  min: Cards.deepOrange.accent_3,
  na: Cards.blue.lighten_3
};
const JUNGLE = {
  max: Cards.lime.accent_4,
  min: Cards.lightGreen.darken_1,
  na: Cards.blue.accent_1
};
const LAVA = {
  max: Cards.amber.accent_4,
  min: Cards.red.base,
  na: Cards.grey.accent_2
};
const OCEAN = {
  max: Cards.lightBlue.accent_2,
  min: Cards.indigo.base,
  na: Cards.pink.lighten_3
};
const PLANET = {
  max: Cards.teal.accent_2,
  min: Cards.blue.darken_3,
  na: Cards.cyan.lighten_4
};
const METRO = {
  max: Cards.pink.lighten_1,
  min: Cards.blueGrey.lighten_4,
  na: Cards.teal.lighten_3
};
const SUBTLE = {
  max: Cards.grey.lighten_5,
  min: Cards.grey.darken_1,
  na: Cards.indigo.lighten_3
};

function duozipper(a, b) {
  let {
    fn,
    lo,
    hi
  } = this;
  lo = lo || 0;
  const vec = Array(hi = hi || a && a.length);

  for (--hi; hi >= lo; hi--) vec[hi] = fn(a[hi], b[hi], hi);

  return vec;
}

function trizipper(a, b, c) {
  let {
    fn,
    lo,
    hi
  } = this;
  lo = lo || 0;
  const vec = Array(hi = hi || a && a.length);

  for (--hi; hi >= lo; hi--) vec[hi] = fn(a[hi], b[hi], c[hi], hi);

  return vec;
}

function quazipper(a, b, c, d) {
  let {
    fn,
    lo,
    hi
  } = this;
  lo = lo || 0;
  const vec = Array(hi = hi || a && a.length);

  for (--hi; hi >= lo; hi--) vec[hi] = fn(a[hi], b[hi], c[hi], d[hi], hi);

  return vec;
}

const Duozipper = (fn, {
  lo,
  hi
} = {}) => duozipper.bind({
  fn,
  lo,
  hi
});

const Trizipper = (fn, {
  lo,
  hi
} = {}) => trizipper.bind({
  fn,
  lo,
  hi
});

const Quazipper = (fn, {
  lo,
  hi
} = {}) => quazipper.bind({
  fn,
  lo,
  hi
});
/**
 * zip two arrays, return the zipped array
 * @param {Array} a
 * @param {Array} b
 * @param {function(*,*,number?):*} fn
 * @param {number} [l]
 * @returns {*[]}
 */


const zipper = (a, b, fn, l) => duozipper.call({
  fn,
  hi: l
}, a, b);

const mutazip = (va, vb, fn, l) => {
  l = l || va && va.length;

  for (--l; l >= 0; l--) va[l] = fn(va[l], vb[l], l);

  return va;
};

var Zipper = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Duozipper: Duozipper,
  Quazipper: Quazipper,
  Trizipper: Trizipper,
  mutazip: mutazip,
  zipper: zipper
});

const indicatorByInitVal = function (vec, l) {
  l = l || vec.length;
  const {
    init,
    pile,
    pick
  } = this;
  let lo = 0,
      body = init !== null && init !== void 0 ? init : (lo++, vec[0]);

  for (let i = lo, fn = pile.bind(body); i < l; i++) fn(vec[i], i);

  return pick ? pick(body, l) : body;
};

const indicatorByInitFun = function (vec, l) {
  l = l || vec.length;
  const {
    init,
    pile,
    pick
  } = this;
  let body = init(vec, l);

  for (let i = 0, fn = pile.bind(body); i < l; i++) fn(vec[i], i);

  return pick ? pick(body, l) : body;
};
/**
 *
 * @param {*|Function|function(*[],number?):*} init - create a container to hold pileByInitVal
 * @param {Function|function(*,number?):*} pile - method to add current value to container when iterating
 * @param {Function|function(*,number?):*} pick - method to pick pileByInitVal value from the container
 * @returns {Function|function(*[],number?):*}
 * @constructor
 */


const Indicator = ({
  init,
  pile,
  pick
}) => typeof init === FUN ? indicatorByInitFun.bind({
  init,
  pile,
  pick
}) : indicatorByInitVal.bind({
  init,
  pile,
  pick
});

/**
 * Create an array.
 * @param {number} size Integer starts at zero.
 * @param {function(number):*|*} [fn] Defines the how index i decides value(i).
 * @returns {number[]} The
 */


const init = (size, fn) => {
  if (size === (size & 0x7f)) {
    let arr = [];

    for (let i = 0; i < size; i++) arr[i] = fn(i);

    return arr;
  }

  return Array(size).fill(null).map((_, i) => fn(i));
};

const {
  iterate,
  reviter,
  mapper,
  mutate
} = Mapper;
const {
  zipper: zipper$1,
  mutazip: mutazip$1,
  Duozipper: Duozipper$1,
  Trizipper: Trizipper$1,
  Quazipper: Quazipper$1
} = Zipper;

/**
 *
 * @param {*[]} ar
 * @param {function(*,*):number} comparer Compare 'prev' & 'next' element in an array. If return < 0, 'prev' comes first. If return > 0, 'next' comes first.
 * @param {function(*):boolean} [filter]
 * @return {number[]} Rank order array, where 0 denote the first.
 */
const rank = (ar, comparer, filter) => {
  const sorted = (!filter ? ar.slice() : ar.filter(filter)).sort(comparer);
  return ar.map(x => sorted.indexOf(x));
};
/**
 *
 * @param {*[]} ar
 * @param {number[]} ranks array of the same length as 'arr', containing rank order of 'arr', 0 comes first.
 * @return {*[]}
 */


const reorderBy = (ar, ranks) => {
  const ve = Array(ar.length);

  for (let [i, ord] of ranks.entries()) ve[ord] = ar[i];

  return ve;
};

var RankVector = /*#__PURE__*/Object.freeze({
  __proto__: null,
  rank: rank,
  reorderBy: reorderBy
});

const STR_ASC = (a, b) => a.localeCompare(b);

const STR_DESC = (a, b) => b.localeCompare(a);

const NUM_ASC = (a, b) => a - b;

const NUM_DESC = (a, b) => b - a;

const max = (a, b) => a > b ? a : b;

const min = (a, b) => a < b ? a : b;

var ComparerCollection = /*#__PURE__*/Object.freeze({
  __proto__: null,
  NUM_ASC: NUM_ASC,
  NUM_DESC: NUM_DESC,
  STR_ASC: STR_ASC,
  STR_DESC: STR_DESC,
  max: max,
  min: min
});

const {
  NUM_ASC: NUM_ASC$1,
  NUM_DESC: NUM_DESC$1,
  STR_ASC: STR_ASC$1,
  STR_DESC: STR_DESC$1
} = ComparerCollection;
const {
  rank: rankVector
} = RankVector;

const NUM_LEVEL_NONE = 0;

const IsNum = (level = 0) => {
  switch (level) {
    case 0:
      return x => !isNaN(x);

    case 1:
      return NumLoose.isNumeric;

    case 2:
    default:
      return Num.isNumeric;
  }
};

const ToNum = (level = 0) => {
  switch (level) {
    case 0:
      return x => x;

    case 1:
      return NumLoose.numeric;

    case 2:
    default:
      return Num.numeric;
  }
};

function boundOutput(max, min) {
  const {
    dif
  } = this;
  return dif ? {
    min,
    dif: max - min
  } : {
    max,
    min
  };
}

const BoundOutput = dif => boundOutput.bind({
  dif
});

const iniNumEntry = (ar, lo, hi, {
  level = 0
} = {}) => {
  for (let el, isNum = IsNum(level); lo < hi; lo++) if (isNum(el = ar[lo])) return [lo, el];

  return [hi, NaN];
};
/**
 *
 * @param {*[]} arr
 * @param {boolean} [dif=false]
 * @param {number} [level=0] 0:no check, 1:loose, 2:strict
 * @returns {{min: *, max: *}|{min: *, dif: *}}}
 */


function bound$1(arr, {
  dif = false,
  level = NUM_LEVEL_NONE
} = {}) {
  const bo = BoundOutput(dif),
        toNum = ToNum(level);
  let l = arr && arr.length;
  if (!l) return bo(NaN, NaN);
  let [i, x] = iniNumEntry(arr, 0, l, {
    level
  });
  let min,
      max = min = toNum(x);

  for (++i; i < l; i++) {
    var _arr$i;

    if ((x = (_arr$i = arr[i], toNum(_arr$i))) < min) {
      min = x;
    } else if (x > max) {
      max = x;
    }
  }

  return bo(max, min);
}

const someNumeric = ar => ar.some(isNumeric$1);

const allString = ar => ar.every(x => typeof x === 'string');

const allNAString = ar => Array.isArray(ar) && !someNumeric(ar) && allString(ar); // if (!(ar |> Array.isArray)) return false
// if (ar |> someNumeric) return false
// return (ar |> allString)

/**
 *
 * @param {*[]} arr
 * @param {{max:string|number[],min:string|number[],na:string|number[]}} [preset]
 * @param {{max:string|number[],min:string|number[],na:string|number[]}} [stringPreset]
 * @param {boolean} [mutate=true]
 * @param {boolean} [colorant=false]
 */


const fluoVector = (arr, {
  preset = FRESH,
  stringPreset = JUNGLE,
  mutate: mutate$1 = false,
  colorant = false
} = {}) => {
  let values;
  if (allNAString(arr)) values = rankVector(arr, STR_ASC$1), preset = stringPreset || preset;
  const [mapper$1, zipper$1$1] = mutate$1 ? [mutate, mutazip$1] : [mapper, zipper$1];
  return fluoZip(arr, {
    values,
    mapper: mapper$1,
    zipper: zipper$1$1,
    bound: bound$1,
    preset,
    colorant
  });
};

const Red$1 = {
  base: '#F44336',
  lighten_5: '#FFEBEE',
  lighten_4: '#FFCDD2',
  lighten_3: '#EF9A9A',
  lighten_2: '#E57373',
  lighten_1: '#EF5350',
  darken_1: '#E53935',
  darken_2: '#D32F2F',
  darken_3: '#C62828',
  darken_4: '#B71C1C',
  accent_1: '#FF8A80',
  accent_2: '#FF5252',
  accent_3: '#FF1744',
  accent_4: '#D50000'
};
const Pink$1 = {
  base: '#E91E63',
  lighten_5: '#FCE4EC',
  lighten_4: '#F8BBD0',
  lighten_3: '#F48FB1',
  lighten_2: '#F06292',
  lighten_1: '#EC407A',
  darken_1: '#D81B60',
  darken_2: '#C2185B',
  darken_3: '#AD1457',
  darken_4: '#880E4F',
  accent_1: '#FF80AB',
  accent_2: '#FF4081',
  accent_3: '#F50057',
  accent_4: '#C51162'
};
const Purple$1 = {
  base: '#9C27B0',
  lighten_5: '#F3E5F5',
  lighten_4: '#E1BEE7',
  lighten_3: '#CE93D8',
  lighten_2: '#BA68C8',
  lighten_1: '#AB47BC',
  darken_1: '#8E24AA',
  darken_2: '#7B1FA2',
  darken_3: '#6A1B9A',
  darken_4: '#4A148C',
  accent_1: '#EA80FC',
  accent_2: '#E040FB',
  accent_3: '#D500F9',
  accent_4: '#AA00FF'
};
const DeepPurple$1 = {
  base: '#673AB7',
  lighten_5: '#EDE7F6',
  lighten_4: '#D1C4E9',
  lighten_3: '#B39DDB',
  lighten_2: '#9575CD',
  lighten_1: '#7E57C2',
  darken_1: '#5E35B1',
  darken_2: '#512DA8',
  darken_3: '#4527A0',
  darken_4: '#311B92',
  accent_1: '#B388FF',
  accent_2: '#7C4DFF',
  accent_3: '#651FFF',
  accent_4: '#6200EA'
};
const Indigo$1 = {
  base: '#3F51B5',
  lighten_5: '#E8EAF6',
  lighten_4: '#C5CAE9',
  lighten_3: '#9FA8DA',
  lighten_2: '#7986CB',
  lighten_1: '#5C6BC0',
  darken_1: '#3949AB',
  darken_2: '#303F9F',
  darken_3: '#283593',
  darken_4: '#1A237E',
  accent_1: '#8C9EFF',
  accent_2: '#536DFE',
  accent_3: '#3D5AFE',
  accent_4: '#304FFE'
};
const Blue$1 = {
  base: '#2196F3',
  lighten_5: '#E3F2FD',
  lighten_4: '#BBDEFB',
  lighten_3: '#90CAF9',
  lighten_2: '#64B5F6',
  lighten_1: '#42A5F5',
  darken_1: '#1E88E5',
  darken_2: '#1976D2',
  darken_3: '#1565C0',
  darken_4: '#0D47A1',
  accent_1: '#82B1FF',
  accent_2: '#448AFF',
  accent_3: '#2979FF',
  accent_4: '#2962FF'
};
const LightBlue$1 = {
  base: '#03A9F4',
  lighten_5: '#E1F5FE',
  lighten_4: '#B3E5FC',
  lighten_3: '#81D4FA',
  lighten_2: '#4FC3F7',
  lighten_1: '#29B6F6',
  darken_1: '#039BE5',
  darken_2: '#0288D1',
  darken_3: '#0277BD',
  darken_4: '#01579B',
  accent_1: '#80D8FF',
  accent_2: '#40C4FF',
  accent_3: '#00B0FF',
  accent_4: '#0091EA'
};
const Cyan$1 = {
  base: '#00BCD4',
  lighten_5: '#E0F7FA',
  lighten_4: '#B2EBF2',
  lighten_3: '#80DEEA',
  lighten_2: '#4DD0E1',
  lighten_1: '#26C6DA',
  darken_1: '#00ACC1',
  darken_2: '#0097A7',
  darken_3: '#00838F',
  darken_4: '#006064',
  accent_1: '#84FFFF',
  accent_2: '#18FFFF',
  accent_3: '#00E5FF',
  accent_4: '#00B8D4'
};
const Teal$1 = {
  base: '#009688',
  lighten_5: '#E0F2F1',
  lighten_4: '#B2DFDB',
  lighten_3: '#80CBC4',
  lighten_2: '#4DB6AC',
  lighten_1: '#26A69A',
  darken_1: '#00897B',
  darken_2: '#00796B',
  darken_3: '#00695C',
  darken_4: '#004D40',
  accent_1: '#A7FFEB',
  accent_2: '#64FFDA',
  accent_3: '#1DE9B6',
  accent_4: '#00BFA5'
};
const Green$1 = {
  base: '#4CAF50',
  lighten_5: '#E8F5E9',
  lighten_4: '#C8E6C9',
  lighten_3: '#A5D6A7',
  lighten_2: '#81C784',
  lighten_1: '#66BB6A',
  darken_1: '#43A047',
  darken_2: '#388E3C',
  darken_3: '#2E7D32',
  darken_4: '#1B5E20',
  accent_1: '#B9F6CA',
  accent_2: '#69F0AE',
  accent_3: '#00E676',
  accent_4: '#00C853'
};
const LightGreen$1 = {
  base: '#8BC34A',
  lighten_5: '#F1F8E9',
  lighten_4: '#DCEDC8',
  lighten_3: '#C5E1A5',
  lighten_2: '#AED581',
  lighten_1: '#9CCC65',
  darken_1: '#7CB342',
  darken_2: '#689F38',
  darken_3: '#558B2F',
  darken_4: '#33691E',
  accent_1: '#CCFF90',
  accent_2: '#B2FF59',
  accent_3: '#76FF03',
  accent_4: '#64DD17'
};
const Lime$1 = {
  base: '#CDDC39',
  lighten_5: '#F9FBE7',
  lighten_4: '#F0F4C3',
  lighten_3: '#E6EE9C',
  lighten_2: '#DCE775',
  lighten_1: '#D4E157',
  darken_1: '#C0CA33',
  darken_2: '#AFB42B',
  darken_3: '#9E9D24',
  darken_4: '#827717',
  accent_1: '#F4FF81',
  accent_2: '#EEFF41',
  accent_3: '#C6FF00',
  accent_4: '#AEEA00'
};
const Yellow$1 = {
  base: '#FFEB3B',
  lighten_5: '#FFFDE7',
  lighten_4: '#FFF9C4',
  lighten_3: '#FFF59D',
  lighten_2: '#FFF176',
  lighten_1: '#FFEE58',
  darken_1: '#FDD835',
  darken_2: '#FBC02D',
  darken_3: '#F9A825',
  darken_4: '#F57F17',
  accent_1: '#FFFF8D',
  accent_2: '#FFFF00',
  accent_3: '#FFEA00',
  accent_4: '#FFD600'
};
const Amber$1 = {
  base: '#FFC107',
  lighten_5: '#FFF8E1',
  lighten_4: '#FFECB3',
  lighten_3: '#FFE082',
  lighten_2: '#FFD54F',
  lighten_1: '#FFCA28',
  darken_1: '#FFB300',
  darken_2: '#FFA000',
  darken_3: '#FF8F00',
  darken_4: '#FF6F00',
  accent_1: '#FFE57F',
  accent_2: '#FFD740',
  accent_3: '#FFC400',
  accent_4: '#FFAB00'
};
const Orange$1 = {
  base: '#FF9800',
  lighten_5: '#FFF3E0',
  lighten_4: '#FFE0B2',
  lighten_3: '#FFCC80',
  lighten_2: '#FFB74D',
  lighten_1: '#FFA726',
  darken_1: '#FB8C00',
  darken_2: '#F57C00',
  darken_3: '#EF6C00',
  darken_4: '#E65100',
  accent_1: '#FFD180',
  accent_2: '#FFAB40',
  accent_3: '#FF9100',
  accent_4: '#FF6D00'
};
const DeepOrange$1 = {
  base: '#FF5722',
  lighten_5: '#FBE9E7',
  lighten_4: '#FFCCBC',
  lighten_3: '#FFAB91',
  lighten_2: '#FF8A65',
  lighten_1: '#FF7043',
  darken_1: '#F4511E',
  darken_2: '#E64A19',
  darken_3: '#D84315',
  darken_4: '#BF360C',
  accent_1: '#FF9E80',
  accent_2: '#FF6E40',
  accent_3: '#FF3D00',
  accent_4: '#DD2C00'
};
const Brown$1 = {
  base: '#795548',
  lighten_5: '#EFEBE9',
  lighten_4: '#D7CCC8',
  lighten_3: '#BCAAA4',
  lighten_2: '#A1887F',
  lighten_1: '#8D6E63',
  darken_1: '#6D4C41',
  darken_2: '#5D4037',
  darken_3: '#4E342E',
  darken_4: '#3E2723',
  accent_1: '#D2BEB6',
  accent_2: '#B59387',
  accent_3: '#A27767',
  accent_4: '#855F51'
};
const BlueGrey$1 = {
  base: '#607D8B',
  lighten_5: '#ECEFF1',
  lighten_4: '#CFD8DC',
  lighten_3: '#B0BEC5',
  lighten_2: '#90A4AE',
  lighten_1: '#78909C',
  darken_1: '#546E7A',
  darken_2: '#455A64',
  darken_3: '#37474F',
  darken_4: '#263238',
  accent_1: '#B7C9D1',
  accent_2: '#89A5B3',
  accent_3: '#6A8EA0',
  accent_4: '#547383'
};
const Grey$1 = {
  base: '#9E9E9E',
  lighten_5: '#FAFAFA',
  lighten_4: '#F5F5F5',
  lighten_3: '#EEEEEE',
  lighten_2: '#E0E0E0',
  lighten_1: '#BDBDBD',
  darken_1: '#757575',
  darken_2: '#616161',
  darken_3: '#424242',
  darken_4: '#212121',
  accent_1: '#C4C4C4',
  accent_2: '#9E9E9E',
  accent_3: '#858585',
  accent_4: '#6B6B6B'
};
/**
 * @type {Object.<string,Object<string,Object>>}
 * @property {string[]} colors
 * @property {string[]} degrees
 */

const Cards$1 = {
  red: Red$1,
  pink: Pink$1,
  purple: Purple$1,
  deepPurple: DeepPurple$1,
  indigo: Indigo$1,
  blue: Blue$1,
  lightBlue: LightBlue$1,
  cyan: Cyan$1,
  teal: Teal$1,
  green: Green$1,
  lightGreen: LightGreen$1,
  lime: Lime$1,
  yellow: Yellow$1,
  amber: Amber$1,
  orange: Orange$1,
  deepOrange: DeepOrange$1,
  brown: Brown$1,
  blueGrey: BlueGrey$1,
  grey: Grey$1
};
Reflect.defineProperty(Cards$1, 'colors', {
  get() {
    return Object.keys(Cards$1);
  },

  enumerable: false
});
Reflect.defineProperty(Cards$1, 'degrees', {
  get() {
    for (let color in Cards$1) return Object.keys(Cards$1[color]);
  },

  enumerable: false
});

const AQUA$1 = {
  max: Cards$1.cyan.accent_2,
  min: Cards$1.green.darken_1,
  na: Cards$1.grey.lighten_4
};
const AURORA$1 = {
  max: Cards$1.green.accent_4,
  min: Cards$1.deepPurple.darken_2,
  na: Cards$1.grey.darken_2
};
const FRESH$1 = {
  max: Cards$1.lightGreen.accent_3,
  min: Cards$1.deepOrange.accent_3,
  na: Cards$1.blue.lighten_3
};
const JUNGLE$1 = {
  max: Cards$1.lime.accent_4,
  min: Cards$1.lightGreen.darken_1,
  na: Cards$1.blue.accent_1
};
const LAVA$1 = {
  max: Cards$1.amber.accent_4,
  min: Cards$1.red.base,
  na: Cards$1.grey.accent_2
};
const OCEAN$1 = {
  max: Cards$1.lightBlue.accent_2,
  min: Cards$1.indigo.base,
  na: Cards$1.pink.lighten_3
};
const PLANET$1 = {
  max: Cards$1.teal.accent_2,
  min: Cards$1.blue.darken_3,
  na: Cards$1.cyan.lighten_4
};
const METRO$1 = {
  max: Cards$1.pink.lighten_1,
  min: Cards$1.blueGrey.lighten_4,
  na: Cards$1.teal.lighten_3
};
const SUBTLE$1 = {
  max: Cards$1.grey.lighten_5,
  min: Cards$1.grey.darken_1,
  na: Cards$1.indigo.lighten_3
};

const hue$1 = (r, g, b, max, dif) => {
  if (dif === 0) return 0;

  switch (max) {
    case r:
      return ((g - b) / dif + (g < b ? 6 : 0)) % 6;

    case g:
      return (b - r) / dif + 2;

    case b:
      return (r - g) / dif + 4;
  }
};

const bound$2 = ([r, g, b]) => {
  let ma = r,
      mi = r;

  if (g > r) {
    ma = g;
  } else {
    mi = g;
  }

  if (b > ma) ma = b;
  if (b < mi) mi = b;
  return {
    max: ma,
    sum: ma + mi,
    dif: ma - mi
  };
};

const THSD$1 = 1000;
/**
 * !dif: dif===0
 * @param {number} r - [0,255]
 * @param {number} g - [0,255]
 * @param {number} b - [0,255]
 * @returns {[number,number,number]} [Hue([0,360]), Saturation([0,100]), Lightness([0,100])]
 */

function rgbToHsl$1([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;
  const {
    max,
    sum,
    dif
  } = bound$2([r, g, b]);
  let h = hue$1(r, g, b, max, dif) * 60,
      s = !dif ? 0 : sum > 1 ? dif / (2 - sum) : dif / sum,
      l = sum / 2;
  return [round(h), round(s * THSD$1) / 10, round(l * THSD$1) / 10];
}

const diluteHex$1 = (hex, hi) => {
  hi = hi || hex.length;
  let x = '';

  for (let i = 0, el; i < hi; i++) {
    el = hex[i];
    x += el + el;
  } // for (let c of hex) x += c + c


  return x;
};
/**
 *
 * @param {string} hex
 * @returns {number}
 */


function hexToInt$1(hex) {
  if (hex.charAt(0) === '#') hex = hex.substring(1);
  if (!hex[3]) hex = diluteHex$1(hex);
  return parseInt(hex, 16);
}
/**
 *
 * @param {string} hex
 * @returns {number[]}
 */


function hexToRgb$1(hex) {
  const int = hexToInt$1(hex);
  return [int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF];
}

const hexToHsl$1 = hex => {
  var _ref, _hex;

  return _ref = (_hex = hex, hexToRgb$1(_hex)), rgbToHsl$1(_ref);
};
/**
 *
 * @param {number} n
 * @param {number} h
 * @param {number} a
 * @param {number} l
 * @returns {number}
 */


const hf$1 = (n, h, a, l) => {
  const k = (n + h / 30) % 12;
  return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
};
/**
 *
 * @param {number} h
 * @param {number} s
 * @param {number} l
 * @returns {number[]}
 */


function hslToRgb$1([h, s, l]) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l),
        r = hf$1(0, h, a, l),
        g = hf$1(8, h, a, l),
        b = hf$1(4, h, a, l);
  return [round(r * 0xFF), round(g * 0xFF), round(b * 0xFF)]; // return [r * 0xFF & 0xFF, g * 0xFF & 0xFF, b * 0xFF & 0xFF]
}

const ESC$1 = '\u001b';
const L$1 = ESC$1 + '[';
const R$1 = 'm';
const SC$1 = ';';
const FORE$1 = '38;2';
const CLR_FORE$1 = '39';
//   black: 30,
//   Red: 31,
//   Green: 32,
//   Yellow: 33,
//   Blue: 34,
//   magenta: 35,
//   Cyan: 36,
//   white: 37,
//   Grey: 90,
// }

const BOLD$1 = '1';
const ITALIC$1 = '3';
const UNDERLINE$1 = '4';
const INVERSE$1 = '7';
const CLR_BOLD$1 = '22';
const CLR_ITALIC$1 = '23';
const CLR_UNDERLINE$1 = '24';
const CLR_INVERSE$1 = '27';
const Effects$1 = {
  bold: [BOLD$1, CLR_BOLD$1],
  italic: [ITALIC$1, CLR_ITALIC$1],
  underline: [UNDERLINE$1, CLR_UNDERLINE$1],
  inverse: [INVERSE$1, CLR_INVERSE$1]
};
/**
 *
 * @param {string} code
 * @returns {string}
 */


const brt$1 = code => L$1 + code + R$1;
/**
 *
 * @param {number[]} rgb - array of three integers, each from 0 to 255
 * @returns {string}
 */


const rgbToAnsi$1 = rgb => FORE$1 + SC$1 + rgb[0] + SC$1 + rgb[1] + SC$1 + rgb[2];

/**
 *
 * @param {string} tx
 * @returns {string}
 */

function codedDyer$1(tx) {
  const {
    h,
    t
  } = this;
  return brt$1(h) + tx + brt$1(t);
}

const parseEffects$1 = effects => {
  let h = '',
      t = '';

  if (effects.length) {
    let l, r;

    for (let e of effects) if (e in Effects$1 && ([l, r] = Effects$1[e])) h += SC$1 + l, t += SC$1 + r;
  }

  return {
    h,
    t
  };
};
/***
 *
 * @param {number[]} rgb
 * @param {...string} [effects]
 * @returns {function(string):string}
 */


const Dye$1 = (rgb, ...effects) => {
  const config = parseEffects$1(effects);
  config.h += SC$1 + rgbToAnsi$1(rgb), config.t += SC$1 + CLR_FORE$1;
  return codedDyer$1.bind(config);
};

const STAT_BOUND_CONFIG$1 = {
  dif: true,
  level: 2
};
const {
  isNumeric: isNumeric$2
} = Num;
/**
 * Create a dye from a hsl array
 * @param {[number,number,number]} hsl
 * @returns {function}
 */

const hslToDye$1 = hsl => {
  var _ref, _hsl;

  return _ref = (_hsl = hsl, hslToRgb$1(_hsl)), Dye$1(_ref);
};

const leverage$1 = ([h, s, l], base) => [h / base, s / base, l / base];

const amp$1 = (x, min, lever, base) => (x - min) * lever + base;

const dyeBlender$1 = function (x) {
  var _ref;

  const {
    min: m,
    lever: [rH, rS, rL],
    base: [mH, mS, mL]
  } = this;
  return _ref = [amp$1(x, m, rH, mH), amp$1(x, m, rS, mS), amp$1(x, m, rL, mL)], hslToDye$1(_ref);
};
/**
 *
 * @param {{min:number,dif:number}} valueLeap
 * @param {{min:number[],dif:number[]}} colorLeap
 * @returns {function(*):function}
 * @constructor
 */


const BlendDye$1 = (valueLeap, colorLeap) => dyeBlender$1.bind({
  min: valueLeap.min,
  lever: leverage$1(colorLeap.dif, valueLeap.dif),
  base: colorLeap.min
});

const parseHsl$1 = color => {
  var _color;

  return typeof color === STRING ? (_color = color, hexToHsl$1(_color)) : color;
};
/**
 *
 * @param max
 * @param min
 * @returns {{dif: [number,number,number], min: [number,number,number]}}
 */


const colorBound$1 = ([maxH, maxS, maxL], [minH, minS, minL]) => ({
  min: [minH, minS, minL],
  dif: [maxH - minH, maxS - minS, maxL - minL]
});

const presetToLeap$1 = ({
  max,
  min
}) => {
  var _max, _min;

  return colorBound$1((_max = max, parseHsl$1(_max)), (_min = min, parseHsl$1(_min)));
};

const presetToFlatDye$1 = ({
  na
}) => {
  var _ref, _na;

  return _ref = (_na = na, parseHsl$1(_na)), hslToDye$1(_ref);
};
/**
 *
 * @param {*[]} vec
 * @param {*[]} values
 * @param {function(*[],function(*):*):*[]} mapper
 * @param {function} primeDye
 * @param {{dif:number,min:number}} valueLeap
 * @param {{dif:number[],min:number[]}} colorLeap
 * @param {boolean} colorant
 * @returns {function[]|*[]}
 */


const dyeMap$1 = (vec, {
  mapper,
  primeDye,
  valueLeap,
  colorLeap,
  colorant
}) => {
  var _colorLeap$min;

  let blendDye;
  return valueLeap.dif && colorLeap.dif.some(n => !!n) ? (blendDye = BlendDye$1(valueLeap, colorLeap), colorant ? mapper(vec, x => isNumeric$2(x) ? blendDye(x) : primeDye) : mapper(vec, x => {
    var _x, _x2;

    return isNumeric$2(x) ? (_x = x, blendDye(x)(_x)) : (_x2 = x, primeDye(_x2));
  })) : (blendDye = (_colorLeap$min = colorLeap.min, hslToDye$1(_colorLeap$min)), colorant ? mapper(vec, x => isNumeric$2(x) ? blendDye : primeDye) : mapper(vec, x => {
    var _x3, _x4;

    return isNumeric$2(x) ? (_x3 = x, blendDye(_x3)) : (_x4 = x, primeDye(_x4));
  }));
};
/**
 *
 * @param {*[]} keys
 * @param {*[]} values
 * @param {function(*[],function(*)):*[]} mapper
 * @param {function(*[],*[],function(*,*)):*[]} zipper
 * @param {function(*):string} primeDye
 * @param {{dif:number,min:number}} valueLeap
 * @param {{dif:number[],min:number[]}} colorLeap
 * @param {boolean} colorant
 * @returns {function[]|*[]}
 */


const dyeZip$1 = (keys, {
  values,
  mapper,
  zipper,
  primeDye,
  valueLeap,
  colorLeap,
  colorant
}) => {
  var _colorLeap$min;

  if (!values) return dyeMap$1(keys, {
    mapper,
    primeDye,
    valueLeap,
    colorLeap,
    colorant
  });
  let blendDye;
  const fn = valueLeap.dif && colorLeap.dif.some(n => !!n) ? (blendDye = BlendDye$1(valueLeap, colorLeap), colorant ? (x, v) => isNumeric$2(v) ? blendDye(v) : primeDye : (x, v) => {
    var _x, _x2;

    return isNumeric$2(v) ? (_x = x, blendDye(v)(_x)) : (_x2 = x, primeDye(_x2));
  }) : (blendDye = (_colorLeap$min = colorLeap.min, hslToDye$1(_colorLeap$min)), colorant ? (x, v) => isNumeric$2(v) ? blendDye : primeDye : (x, v) => {
    var _x3, _x4;

    return isNumeric$2(v) ? (_x3 = x, blendDye(_x3)) : (_x4 = x, primeDye(_x4));
  });
  return zipper(keys, values, fn);
};
/**
 *
 * @param {*[]} keys
 * @param {*[]} values
 * @param {function(*[],function(*)):*[]} mapper
 * @param {function(*[],*[],function(*,*)):*[]} zipper
 * @param {function(*[],{dif:boolean,level:number}):{min:number,dif:number}} bound
 * @param {{max:string,min:string,na:string}} preset
 * @param {boolean} colorant
 * @returns {function[]|*[]}
 */


const fluoZip$1 = (keys, {
  values,
  mapper,
  zipper,
  bound,
  preset,
  colorant = false
} = {}) => {
  var _preset, _preset2;

  return dyeZip$1(keys, {
    values,
    mapper,
    zipper,
    primeDye: (_preset = preset, presetToFlatDye$1(_preset)),
    colorLeap: (_preset2 = preset, presetToLeap$1(_preset2)),
    valueLeap: bound(values || keys, STAT_BOUND_CONFIG$1),
    colorant
  });
};

const someNumeric$1 = ar => ar.some(isNumeric$2);

const allString$1 = ar => ar.every(x => typeof x === 'string');

const allNAString$1 = ar => Array.isArray(ar) && !someNumeric$1(ar) && allString$1(ar); // if (!(ar |> Array.isArray)) return false
// if (ar |> someNumeric) return false
// return (ar |> allString)

/**
 *
 * @param {*[]} arr
 * @param {{max:string|number[],min:string|number[],na:string|number[]}} [preset]
 * @param {{max:string|number[],min:string|number[],na:string|number[]}} [stringPreset]
 * @param {boolean} [mutate=true]
 * @param {boolean} [colorant=false]
 */


const fluoVector$1 = (arr, {
  preset = FRESH$1,
  stringPreset = JUNGLE$1,
  mutate: mutate$1 = false,
  colorant = false
} = {}) => {
  let values;
  if (allNAString$1(arr)) values = rankVector(arr, STR_ASC$1), preset = stringPreset || preset;
  const [mapper$1, zipper$1$1] = mutate$1 ? [mutate, mutazip$1] : [mapper, zipper$1];
  return fluoZip$1(arr, {
    values,
    mapper: mapper$1,
    zipper: zipper$1$1,
    bound: bound$1,
    preset,
    colorant
  });
};

const unwind = (entries, h) => {
  h = h || entries && entries.length;
  let keys = Array(h),
      values = Array(h);

  for (let r; --h >= 0 && (r = entries[h]);) {
    keys[h] = r[0];
    values[h] = r[1];
  }

  return [keys, values];
};

/**
 *
 * @param {[*,*][]} ea
 * @param {[*,*][]} eb
 * @param {function} keyMap
 * @param {function} [valMap]
 * @param {number} [l]
 * @returns {[*,*][]}
 */


const mutazip$2 = (ea, eb, keyMap, valMap, l) => {
  l = l || ea && ea.length, valMap = valMap || keyMap;

  for (let a, b, i = 0; i < l && (a = ea[i]) && (b = eb[i]); i++) a[0] = keyMap(a[0], b[0], i), a[1] = valMap(a[1], b[1], i);

  return ea;
};

/**
 *
 * @param {*[]} entries
 * @param {{max:string,min:string,na:string}} [preset]
 * @param {{max:string,min:string,na:string}} [stringPreset]
 * @param {boolean} [mutate=true]
 * @param {boolean} [colorant=false]
 */

const fluoEntries = (entries, {
  preset = FRESH$1,
  stringPreset = JUNGLE$1,
  mutate = false,
  colorant = false
} = {}) => {
  var _entries;

  let [keys, items] = (_entries = entries, unwind(_entries));
  fluoVector$1(keys, {
    preset,
    stringPreset,
    mutate: true,
    colorant
  });
  fluoVector$1(items, {
    preset,
    stringPreset,
    mutate: true,
    colorant
  });
  const rendered = mutazip$1(keys, items, (k, v) => [k, v]);
  return mutate ? mutazip$2(entries, rendered, (a, b) => b, (a, b) => b) : rendered;
};

const OptS = Object.prototype.toString;
/**
 * const rxObj = /^\[object (.*)]$/
 * Equivalent to: Object.prototype.stringify.call(o).match(rxObj)[1]
 * @param {*} o
 * @return {string}
 */

const typ = o => OptS.call(o).slice(8, -1);

const mapper$1 = (o, fn) => {
  const ob = {};

  for (let k in o) if (Object.hasOwnProperty.call(o, k)) ob[k] = fn(o[k]);

  return ob;
};

const ansi = ['[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)', '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'];
const astral = ['[\uD800-\uDBFF][\uDC00-\uDFFF]'];
const ansiReg = new RegExp(ansi.join('|'), 'g');
const astralReg = new RegExp(astral.join('|'), 'g');
/**
 *
 * @param {string} tx
 * @returns {number}
 */

const lange = tx => tx.replace(ansiReg, '').replace(astralReg, '_').length;

const hasAnsi = tx => ansiReg.test(tx);

const max$1 = (a, b) => a > b ? a : b;

const fixpad = (tx, pd) => hasAnsi(tx) ? tx.length + pd - lange(tx) : pd;

const lpad = String.prototype.padStart;

const LPad = ({
  ansi = true,
  fill
} = {}) => ansi ? (tx, pd) => lpad.call(tx, fixpad(tx, pd), fill) : (tx, pd) => lpad.call(tx, pd, fill);

function columnMutate(mx, fn, l) {
  l = l || mx && mx.length;

  for (let i = 0, r, {
    y
  } = this; i < l && (r = mx[i]); i++) r[y] = fn(r[y], i);

  return mx;
}

const mutate$1 = (mx, y, fn, l) => columnMutate.call({
  y
}, mx, fn, l);

const isTab = c => c === '\t' || c === ' ';

const deNaTab = tx => {
  let i = 0;

  for (let {
    length
  } = tx; i < length; i++) if (!isTab(tx.charAt(i))) return i;

  return i;
};
const LF = '\n';
const TB = '  ';

var _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;

const L$2 = '{ ',
      R$2 = ' }';
const Tubes = {
  0: Dye((_ref = [45, 100, 53], hslToRgb(_ref))),
  1: Dye((_ref2 = [44, 100, 59], hslToRgb(_ref2))),
  2: Dye((_ref3 = [43, 100, 64], hslToRgb(_ref3))),
  3: Dye((_ref4 = [42, 100, 70], hslToRgb(_ref4))),
  4: Dye((_ref5 = [41, 100, 74], hslToRgb(_ref5))),
  5: Dye((_ref6 = [40, 100, 78], hslToRgb(_ref6))),
  6: Dye((_ref7 = [39, 100, 82], hslToRgb(_ref7))),
  7: Dye((_ref8 = [37, 100, 86], hslToRgb(_ref8)))
};
const Puncs = mapper$1(Tubes, hsl => {
  var _L, _R;

  return [(_L = L$2, hsl(_L)), (_R = R$2, hsl(_R))];
});
const BRC = mapper$1(Puncs, ([L, R]) => content => L + content + R);

const brc = content => L$2 + content + R$2;

var _ref$1, _ref2$1, _ref3$1, _ref4$1, _ref5$1, _ref6$1, _ref7$1, _ref8$1;

const L$1$1 = '[ ',
      R$1$1 = ' ]';
const Tubes$1 = {
  0: Dye((_ref$1 = [199, 100, 63], hslToRgb(_ref$1))),
  1: Dye((_ref2$1 = [201, 100, 68], hslToRgb(_ref2$1))),
  2: Dye((_ref3$1 = [203, 100, 72], hslToRgb(_ref3$1))),
  3: Dye((_ref4$1 = [205, 100, 76], hslToRgb(_ref4$1))),
  5: Dye((_ref5$1 = [207, 100, 84], hslToRgb(_ref5$1))),
  4: Dye((_ref6$1 = [209, 100, 80], hslToRgb(_ref6$1))),
  6: Dye((_ref7$1 = [211, 100, 88], hslToRgb(_ref7$1))),
  7: Dye((_ref8$1 = [214, 100, 90], hslToRgb(_ref8$1)))
};
const Puncs$1 = mapper$1(Tubes$1, dye => {
  var _L, _R;

  return [(_L = L$1$1, dye(_L)), (_R = R$1$1, dye(_R))];
});
const BRK = mapper$1(Puncs$1, ([L, R]) => content => L + content + R);

const brk = content => L$1$1 + content + R$1$1;

var _Cards$brown$lighten_, _Cards$lightGreen$acc, _Cards$deepOrange$acc, _Cards$teal$lighten_, _Cards$brown$lighten_2, _Cards$blue$accent_, _Cards$amber$base, _Cards$green$accent_;
/**
 *
 * @type {Object<string,function>}
 */


const PAL = {
  IDX: Dye((_Cards$brown$lighten_ = Cards.brown.lighten_5, hexToRgb(_Cards$brown$lighten_))),
  STR: Dye((_Cards$lightGreen$acc = Cards.lightGreen.accent_2, hexToRgb(_Cards$lightGreen$acc))),
  NUM: Dye((_Cards$deepOrange$acc = Cards.deepOrange.accent_2, hexToRgb(_Cards$deepOrange$acc))),
  BOO: Dye((_Cards$teal$lighten_ = Cards.teal.lighten_2, hexToRgb(_Cards$teal$lighten_))),
  UDF: Dye((_Cards$brown$lighten_2 = Cards.brown.lighten_3, hexToRgb(_Cards$brown$lighten_2))),
  BRK: Dye((_Cards$blue$accent_ = Cards.blue.accent_2, hexToRgb(_Cards$blue$accent_))),
  BRC: Dye((_Cards$amber$base = Cards.amber.base, hexToRgb(_Cards$amber$base))),
  FNC: Dye((_Cards$green$accent_ = Cards.green.accent_4, hexToRgb(_Cards$green$accent_)))
};

var _ref$2, _ref2$2, _ref3$2, _ref4$2, _ref5$2, _ref6$2, _ref7$2, _ref8$2;

const IDXSigns = {
  0: Dye((_ref$2 = [20, 16, 93], hslToRgb(_ref$2))),
  1: Dye((_ref2$2 = [18, 18, 88], hslToRgb(_ref2$2))),
  2: Dye((_ref3$2 = [17, 20, 83], hslToRgb(_ref3$2))),
  3: Dye((_ref4$2 = [16, 22, 78], hslToRgb(_ref4$2))),
  4: Dye((_ref5$2 = [15, 24, 73], hslToRgb(_ref5$2))),
  5: Dye((_ref6$2 = [14, 26, 69], hslToRgb(_ref6$2))),
  6: Dye((_ref7$2 = [14, 28, 65], hslToRgb(_ref7$2))),
  7: Dye((_ref8$2 = [13, 28, 61], hslToRgb(_ref8$2)))
};
const IDX = {
  0: {
    max: hslToHex([75, 90, 85]),
    min: hslToHex([89, 99, 72]),
    na: Cards.grey.lighten_4
  },
  1: {
    max: hslToHex([80, 88, 87]),
    min: hslToHex([83, 98, 71]),
    na: Cards.grey.lighten_4
  },
  2: {
    max: hslToHex([93, 87, 82]),
    min: hslToHex([93, 97, 70]),
    na: Cards.grey.lighten_3
  },
  3: {
    max: hslToHex([103, 86, 82]),
    min: hslToHex([103, 96, 69]),
    na: Cards.grey.lighten_2
  },
  4: {
    max: hslToHex([113, 85, 82]),
    min: hslToHex([113, 95, 68]),
    na: Cards.grey.lighten_1
  },
  5: {
    max: hslToHex([123, 84, 82]),
    min: hslToHex([123, 94, 68]),
    na: Cards.grey.base
  },
  6: {
    max: hslToHex([133, 83, 82]),
    min: hslToHex([133, 93, 68]),
    na: Cards.grey.darken_1
  },
  7: {
    max: hslToHex([143, 82, 82]),
    min: hslToHex([143, 92, 68]),
    na: Cards.grey.darken_2
  }
};

const joinVector = (list, lv) => {
  const rn = LF + TB.repeat(lv);
  return `${rn}  ${list.join(`,${rn + TB}`)}${rn}`;
};

const lpad$1 = LPad({
  ansi: true
});

const stringifyEntries = function (entries, lv) {
  const {
    vo
  } = this,
        {
    pad,
    wrap
  } = wrapInfo.call(this, entries);
  if (wrap || lv < vo) mutate$1(entries, 0, k => lpad$1(k, pad));
  mutate$2(entries, ([k, v]) => `${k}: ${v}`);
  return (wrap || lv < vo) && entries.length > 1 ? joinVector(entries, lv) : entries.join(', ');
};

const wrapInfo = function (entries) {
  const {
    wo
  } = this;
  let w = 0,
      wrap = false,
      pad = 0;
  iterate$1(entries, ([k, v]) => {
    k = lange(k), v = lange(v), pad = max$1(k, pad);
    if (!wrap && (w += k + v) > wo) wrap = true;
  });
  return {
    pad,
    wrap
  };
};

const stringifyVector = function (vector, lv) {
  const {
    va,
    wa
  } = this;
  if (lv < va) return joinVector(vector, lv);
  let rows = [],
      w = 0,
      row = [];
  iterate$1(vector, item => {
    row.push(item), w += lange(item);
    if (w > wa) rows.push(row.join(', ')), row = [], w = 0;
  });
  return rows.length > 1 ? joinVector(rows, lv) : vector.join(', ');
};

const deFn = function (fn) {
  let {
    wf,
    color
  } = this,
      des = `${fn}`;
  if (wf <= 128) des = des.replace(/\s+/g, ' ');
  if (des.startsWith(FUN)) des = des.slice(9);
  des = toLambda(des);
  if (des.length > wf) des = Object.prototype.toString.call(fn);
  return color ? PAL.FNC(des) : des;
};

const LB = '{ return',
      RB = '}',
      ARROW = '=>';

const toLambda = des => {
  const li = des.indexOf(LB),
        ri = des.lastIndexOf(RB);
  return li && ri ? des.slice(0, li) + ARROW + des.slice(li + LB.length, ri) : des;
};
/**
 *
 * @param {*} node
 * @param {number} [lv]
 * @return {string}
 */


function deNode(node, lv = 0) {
  if (!this.color) return deNodePlain.call(this, node, lv);

  switch (typeof node) {
    case STR$1:
      return isNumeric(node) ? node : PAL.STR(node);

    case OBJ$1:
      return deOb.call(this, node, lv);

    case NUM$1:
    case BIG:
      return node;

    case FUN:
      return deFn.call(this, node);

    case BOO:
      return PAL.BOO(node);

    case UND:
    case SYM:
      return PAL.UDF(node);
  }
}

const deOb = function (node, lv) {
  var _node, _deVe$call, _deEn$call, _deEn$call2;

  const {
    hi
  } = this;

  switch (_node = node, typ(_node)) {
    case ARRAY:
      return lv >= hi ? '[array]' : (_deVe$call = deVe.call(this, node.slice(), lv), BRK[lv & 7](_deVe$call));

    case OBJECT:
      return lv >= hi ? '{object}' : (_deEn$call = deEn.call(this, Object.entries(node), lv), BRC[lv & 7](_deEn$call));

    case MAP:
      return lv >= hi ? '(map)' : (_deEn$call2 = deEn.call(this, [...node.entries()], lv), BRK[lv & 7](_deEn$call2));

    case SET:
      return lv >= hi ? '(set)' : `set:[${deVe.call(this, [...node], lv)}]`;

    default:
      return `${node}`;
  }
};
/**
 *
 * @param {*} node
 * @param {number} [lv]
 * @return {string}
 */


function deNodePlain(node, lv = 0) {
  const t = typeof node;

  if (t === OBJ$1) {
    var _node2, _deVe$call2, _deEn$call3, _deEn$call4;

    const {
      hi
    } = this,
          pt = (_node2 = node, typ(_node2));
    if (pt === ARRAY) return lv >= hi ? '[array]' : (_deVe$call2 = deVe.call(this, node.slice(), lv), brk(_deVe$call2));
    if (pt === OBJECT) return lv >= hi ? '{object}' : (_deEn$call3 = deEn.call(this, Object.entries(node), lv), brc(_deEn$call3));
    if (pt === MAP) return lv >= hi ? '(map)' : (_deEn$call4 = deEn.call(this, [...node.entries()], lv), brk(_deEn$call4));
    if (pt === SET) return lv >= hi ? '(set)' : `set:[${deVe.call(this, [...node], lv)}]`;
    return `${node}`;
  }

  if (t === FUN) return deFn.call(this, node);
  return node;
}

let deVe = function (vector, lv) {
  mutate$2(vector, v => String(deNode.call(this, v, lv + 1)));
  if (this.color) fluoVector(vector, {
    mutate: true
  });
  return stringifyVector.call(this, vector, lv);
};

let deEn = function (entries, lv) {
  mutate$3(entries, k => String(k), v => String(deNode.call(this, v, lv + 1)));
  if (this.color) fluoEntries(entries, {
    stringPreset: IDX[lv & 7],
    mutate: true
  });
  return stringifyEntries.call(this, entries, lv);
};
/**
 *
 * @param {*} ob
 * @param {number} [hi] - maximum level of object to show detail
 * @param {number} [va] - maximum level to force vertical for array, root level = 0
 * @param {number} [vo] - maximum level to force vertical for object, root level = 0
 * @param {number} [wa] - maximum string length to hold array contents without wrap
 * @param {number} [wo] - maximum string length to hold object contents without wrap
 * @param {number} [wf] - maximum string length to hold function contents
 * @param {boolean} [color=true]
 * @returns {string|number}
 */


const deco = (ob, {
  hi = 8,
  va = 0,
  vo = 0,
  wa = 32,
  wo = 64,
  wf = 64,
  color = true
} = {}) => deNode.call({
  hi,
  va,
  vo,
  wa,
  wo,
  wf,
  color
}, ob);

const delogger = x => {
  var _x;

  return void console.log((_x = x, deco(_x)));
};

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = privateMap.get(receiver);

  if (!descriptor) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }

  return descriptor.value;
}

function _classPrivateFieldDestructureSet(receiver, privateMap) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to set private field on non-instance");
  }

  var descriptor = privateMap.get(receiver);

  if (descriptor.set) {
    if (!("__destrObj" in descriptor)) {
      descriptor.__destrObj = {
        set value(v) {
          descriptor.set.call(receiver, v);
        }

      };
    }

    return descriptor.__destrObj;
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }

    return descriptor;
  }
}

var _Cards$blueGrey$base, _Cards$orange$lighten, _Cards$indigo$lighten;

const bm = Dye((_Cards$blueGrey$base = Cards.blueGrey.base, hexToRgb(_Cards$blueGrey$base)));
const br = Dye((_Cards$orange$lighten = Cards.orange.lighten_3, hexToRgb(_Cards$orange$lighten)));
const pr = Dye((_Cards$indigo$lighten = Cards.indigo.lighten_1, hexToRgb(_Cards$indigo$lighten)));

const bracket = tx => br('[') + tx + br(']');

const parenthesis = tx => pr('(') + tx + pr(')');

const bracket$1 = tx => '[' + tx + ']';

const parenthesis$1 = tx => '(' + tx + ')';
/**
 *
 * @param {*} [text]
 * @param {number} indent
 * @param {string[]} queue
 * @returns {string}
 */


const render = (text, {
  indent,
  queue
}) => {
  if (text === null || text === void 0 ? void 0 : text.length) queue.push(text);
  return ' '.repeat(indent << 1) + queue.join(' ');
};

const toQueue = t => {
  let queue = [],
      l,
      d;

  if (t && (t = String(t)) && (l = t.length) && (d = deNaTab(t)) < l) {
    queue.push(t.slice(d));
  }

  return {
    indent: d,
    queue
  };
};

let _Symbol$toPrimitive;

class Callable extends Function {
  constructor(f) {
    super();
    Reflect.setPrototypeOf(f, new.target.prototype);
    return f;
  }

}
/**
 * @type {Object<string,string>}
 */


_Symbol$toPrimitive = Symbol.toPrimitive;

class Inka extends Callable {
  /** @type {number} */

  /** @type {string[]} */

  /** @type {Function} */

  /** @type {Function} */
  constructor(word, color = true) {
    var _word;

    super(word => render(word, this));

    _defineProperty(this, "indent", void 0);

    _defineProperty(this, "queue", void 0);

    _brk.set(this, {
      writable: true,
      value: void 0
    });

    _prn.set(this, {
      writable: true,
      value: void 0
    });

    Object.assign(this, (_word = word, toQueue(_word)));
    [_classPrivateFieldDestructureSet(this, _brk).value, _classPrivateFieldDestructureSet(this, _prn).value] = color ? [bracket, parenthesis] : [bracket$1, parenthesis$1];
    return new Proxy(this, {
      get(target, p, receiver) {
        var _String;

        if (p in target) {
          return target[p];
        }

        const {
          queue
        } = target;
        queue.push((_String = String(p), _classPrivateFieldGet(target, _brk)(_String)));
        return (...items) => {
          var _items$map$join;

          return queue.push((_items$map$join = items.map(String).join(', '), _classPrivateFieldGet(target, _prn)(_items$map$join))), receiver;
        };
      }

    });
  }

  cr(word) {
    var _word2;

    return Object.assign(this, (_word2 = word, toQueue(_word2))), this;
  }

  asc() {
    return this.indent++, this;
  }

  desc() {
    return this.indent--, this;
  }

  p(...items) {
    return this.queue.push(...items), this;
  }

  br(...items) {
    return this.queue.push(items.map(parenthesis$1).join(',')), this;
  }

  toString() {
    return render(null, this);
  }

  [_Symbol$toPrimitive](h) {
    switch (h) {
      case 'string':
      case 'default':
        return render(null, this);

      case 'number':
        return this.indent;

      default:
        throw new Error('inka Symbol.toPrimitive error');
    }
  }

}

var _brk = new WeakMap();

var _prn = new WeakMap();

const ink = new Inka();

/**
 * Transpose a 2d-array.
 * @param {*[][]} mx
 * @param {number} [h]
 * @param {number} [w]
 * @returns {*[][]}
 */

const transpose = (mx, h, w) => {
  var _mx$;

  h = h || (mx === null || mx === void 0 ? void 0 : mx.length), w = w || h && ((_mx$ = mx[0]) === null || _mx$ === void 0 ? void 0 : _mx$.length);
  const cols = Array(w);

  for (--w; w >= 0; w--) cols[w] = mapper$4(mx, r => r[w], h);

  return cols;
};

const RGB = 'rgb',
      HSL = 'hsl',
      HEX = 'hex';

const selectValues = function (o, keys) {
  const l = keys.length,
        ve = Array(l);

  for (let i = 0; i < l; i++) ve[i] = o[keys[i]];

  return ve;
};

/**
 *
 * @param {*[][]} mx
 * @param {function} fn
 * @param {number} [h]
 * @param {number} [w]
 * @returns {undefined}
 */
/**
 * Iterate through elements on each (x of rows,y of columns) coordinate of a 2d-array.
 * @param {*[][]} mx
 * @param {function} fn
 * @param {number} [h]
 * @param {number} [w]
 * @returns {*[]}
 */


const mapper$2 = (mx, fn, h, w) => {
  var _mx$;

  h = h || (mx === null || mx === void 0 ? void 0 : mx.length), w = w || h && ((_mx$ = mx[0]) === null || _mx$ === void 0 ? void 0 : _mx$.length);
  const tx = Array(h);

  for (let i = 0, j, r, tr; i < h; i++) for (tx[i] = tr = Array(w), r = mx[i], j = 0; j < w; j++) tr[j] = fn(r[j], i, j);

  return tx;
};

const columns = function (y, h) {
  return mapper$4(this, r => r[y], h);
};

const Columns = mx => columns.bind(mx);

const mapper$3 = (mx, mapOnColumns, h, w) => {
  var _mx$;

  h = h || (mx === null || mx === void 0 ? void 0 : mx.length), w = w || h && ((_mx$ = mx[0]) === null || _mx$ === void 0 ? void 0 : _mx$.length);
  const tcol = Array(w);

  for (let j = 0, cols = Columns(mx); j < w; j++) tcol[j] = mapOnColumns(cols(j, h), j);

  return tcol;
};

const ITALIC$2 = 'italic';
const INVERSE$2 = 'inverse';

/**
 * @param {number} x
 * @returns {number}
 */


const round$1 = x => x + (x > 0 ? 0.5 : -0.5) << 0;

const CAMEL = /[A-Z]+|[0-9]+/g;
/**
 * Camel case phrase -> Lowercase dashed phrase
 * @example 'TheWallstreetJournal2025WSJ' -> 'the wallstreet journal 2025 wsj'
 * @param {string} camel camel-case phrase
 * @param {string} de
 * @returns {string} lowercase dashed phrase
 */

const camelToLowerDashed = (camel, de = ' ') => camel.replace(CAMEL, it => de + it.toLowerCase()).trim();

const RED = 'red',
      PINK = 'pink',
      PURPLE = 'purple',
      DEEPPURPLE = 'deepPurple',
      INDIGO = 'indigo',
      BLUE = 'blue',
      LIGHTBLUE = 'lightBlue',
      CYAN = 'cyan',
      TEAL = 'teal',
      GREEN = 'green',
      LIGHTGREEN = 'lightGreen',
      LIME = 'lime',
      YELLOW = 'yellow',
      AMBER = 'amber',
      ORANGE = 'orange',
      DEEPORANGE = 'deepOrange',
      BROWN = 'brown',
      BLUEGREY = 'blueGrey',
      GREY = 'grey';

const Formatter = (space, color = false) => {
  const Dye = SelectDye(space);

  if (space === RGB || space === HSL) {
    const formatter = rgb => mapper$4(rgb, x => String(round$1(x)).padStart(3));

    return color ? rgb => {
      var _ref, _rgb;

      return _ref = (_rgb = rgb, formatter(_rgb)), Dye(rgb)(_ref);
    } : formatter;
  }

  if (space === HEX) return color ? hex => {
    var _hex;

    return _hex = hex, Dye(hex)(_hex);
  } : hex => hex;
};

function SelectDye(space) {
  const prepDye = PrepDye(INVERSE$2);
  if (space === RGB) return prepDye;
  if (space === HSL) return hsl => {
    var _hsl;

    return prepDye((_hsl = hsl, hslToRgb(_hsl)));
  };
  if (space === HEX) return hex => {
    var _hex2;

    return prepDye((_hex2 = hex, hexToRgb(_hex2)));
  };
}
/**
 *
 * @param {string} name
 * @returns {string}
 */


const readify = name => camelToLowerDashed(name, '.').replace('light', 'l').replace('deep', 'd');

const accents = init(4, i => `accent_${i + 1}`).reverse(),
      lightens = init(5, i => `lighten_${i + 1}`).reverse(),
      darkens = init(4, i => `darken_${i + 1}`);
const Degrees = {
  entire: [...accents, ...lightens, 'base', ...darkens],
  base: ['base'],
  lightens: lightens,
  darkens: darkens,
  accents: accents,
  readable: [...accents.slice(-3), ...lightens.slice(-3), 'base']
};
const red = [RED, PINK];
const purple = [PURPLE, DEEPPURPLE];
const blue = [INDIGO, BLUE, LIGHTBLUE, CYAN];
const green = [TEAL, GREEN];
const yellowGreen = [LIGHTGREEN, LIME, YELLOW];
const orange = [AMBER, ORANGE, DEEPORANGE];
const grey = [BROWN, BLUEGREY, GREY];
const rainbow = [].concat(red, purple, blue, green, yellowGreen, orange);
const entire = rainbow.concat(grey);
const ColorGroups = {
  red,
  purple,
  blue,
  green,
  yellowGreen,
  orange,
  grey,
  rainbow,
  entire
};

const ColorPicker = colorSpace => {
  if (colorSpace === RGB) return x => {
    var _x;

    return _x = x, hexToRgb(_x);
  };
  if (colorSpace === HSL) return x => {
    var _x2;

    return _x2 = x, hexToHsl(_x2);
  };
  if (colorSpace === HEX) return x => x;
};

function VectorAverage(space) {
  if (space === RGB || space === HSL) return Indicator({
    init: () => [0, 0, 0],

    pile(rgb) {
      this[0] += rgb[0], this[1] += rgb[1], this[2] += rgb[2];
    },

    pick: (rgb, l) => mutate$2(rgb, x => round$1(x / l), 3)
  });
  if (space === HEX) return vec => {
    var _ref, _vec$map;

    return _ref = (_vec$map = vec.map(hexToRgb), VectorAverage(RGB)(_vec$map)), rgbToHex(_ref);
  };
}

const AVERAGE = 'average';
/**
 *
 * @param {string} [space='hex]
 * @param {string[]} [degrees=Degrees.entire]
 * @param {string[]} [colors=ColorGroups.entire]
 * @param {boolean} [average=false]
 * @param {boolean} [cellColor=false]
 * @returns {CrosTab|{side:string,banner:string,matrix:*[][]}}
 */

function degreesByColors({
  space = HEX,
  degrees = Degrees.entire,
  colors = ColorGroups.entire,
  average = false,
  cellColor = false
} = {}) {
  const h = degrees.length,
        w = colors.length;
  const formatter = Formatter(space, cellColor),
        colorPicker = ColorPicker(space);
  const columns = mapper$4(selectValues(Cards, colors), card => mapper$4(selectValues(card, degrees), colorPicker, h), w);
  const side = degrees,
        head = mapper$4(colors, readify),
        rows = transpose(columns),
        crostab = new CrosTab(side, head, mapper$2(rows, formatter));

  if (average) {
    const vecAv = VectorAverage(space);

    const stat_format = row => {
      var _ref, _row;

      return _ref = (_row = row, vecAv(_row)), formatter(_ref);
    };

    crostab.unshiftRow(AVERAGE, mapper$3(rows, stat_format), w).unshiftColumn(AVERAGE, [''].concat(mapper$4(rows, stat_format, h)));
  }

  return crostab;
}

const {
  random
} = Math;

const rand = l => ~~(random() * l);
/**
 * From [min, max] return a random integer.
 * Of [min, max], both min and max are inclusive.
 * @param {number} lo(inclusive) - int
 * @param {number} hi(inclusive) - int
 * @returns {number} int
 */


const randIntBetw = (lo, hi) => rand(++hi - lo) + lo;

const flopIndex = ar => rand(ar.length);

const flop = ar => ar[flopIndex(ar)];

const swap = function (i, j) {
  const temp = this[i];
  this[i] = this[j];
  return this[j] = temp;
};

const sortBy = function (indicator, comparer) {
  const vec = this,
        kvs = mutate$2(vec, (x, i) => [indicator(x, i), x]).sort(toKeyComparer(comparer));
  return mutate$2(kvs, ([, value]) => value);
};

const toKeyComparer = comparer => (a, b) => comparer(a[0], b[0]); // accent  15 -3


const LIGHTEN = 'lighten',
      ACCENT = 'accent',
      DARKEN = 'darken';

const degreeToIndice = degree => {
  let i = degree.indexOf('_');
  if (i < 0) return randIntBetw(14, 16);
  let cate = degree.slice(0, i),
      order = degree.slice(++i);
  if (cate === LIGHTEN) return 15 - --order * 3;
  if (cate === ACCENT) return 14 - --order * 3;
  if (cate === DARKEN) return 13 - --order * 3;
  return rand(16);
};

function* palettFlopper({
  degrees = Degrees.entire,
  colors = ColorGroups.rainbow,
  space = HEX,
  defaultColor = Grey.lighten_1,
  exhausted = true
} = {}) {
  var _defaultColor, _palett$head;

  const palett = degreesByColors({
    degrees,
    colors,
    space
  });
  degrees = sortBy.call(degrees.slice(), degreeToIndice, NUM_DESC$1);
  let h = degrees.length,
      w = colors.length;

  for (let i = 0; i < h; i++) {
    for (let j = w - 1, side = degrees[i], head = palett.head.slice(), banner; j >= 0; j--) {
      banner = swap.call(head, rand(j), j);
      yield {
        hue: banner,
        degree: side,
        color: palett.cell(side, banner)
      };
    }
  }

  defaultColor = (_defaultColor = defaultColor) !== null && _defaultColor !== void 0 ? _defaultColor : palett.cell(degrees[0], (_palett$head = palett.head, flop(_palett$head)));

  while (!exhausted) yield {
    color: defaultColor
  };

  return {
    color: defaultColor
  };
}

function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _classPrivateFieldGet$1(receiver, privateMap) {
  var descriptor = privateMap.get(receiver);

  if (!descriptor) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }

  return descriptor.value;
}

function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = privateMap.get(receiver);

  if (!descriptor) {
    throw new TypeError("attempted to set private field on non-instance");
  }

  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }

    descriptor.value = value;
  }

  return value;
}

const tab = ind => ' '.repeat(ind << 1);

const logger = (text, {
  title,
  indent,
  keywords
}) => {
  if (typeof text !== STR$1) text += '';
  return void console.log(`${tab(indent)}[${title}]`, text.includes(LF) ? (LF + text).replace(/\n/g, LF + tab(++indent)) : text);
};

class Callable$1 extends Function {
  constructor(f) {
    super();
    Reflect.setPrototypeOf(f, new.target.prototype);
    return f;
  }

}
/** @type {function} */


class Pal extends Callable$1 {
  /** @type {string} */

  /** @type {number} */
  constructor(title, {
    indent = 0
  } = {}) {
    super(text => logger(text, this));

    _defineProperty$1(this, "title", '');

    _defineProperty$1(this, "indent", 0);

    if (title) this.title = title;
    if (indent) this.indent = indent;
  }

  get asc() {
    return this.indent++, this;
  }

  get desc() {
    return this.indent && this.indent--, this;
  }
  /**
   * @param title
   * @param indent
   * @returns {Pal|function}
   */


  static build(title, {
    indent = 0
  } = {}) {
    return new Pal(title, {
      indent
    });
  }

}

class Says {
  /** @type {Object<string,Pal|function>} */

  /** @type {Generator<{color:*}>} */

  /** @type {Function} */
  constructor(roster, effects) {
    _roster.set(this, {
      writable: true,
      value: {}
    });

    _pool.set(this, {
      writable: true,
      value: palettFlopper({
        exhausted: false
      })
    });

    _Dye.set(this, {
      writable: true,
      value: void 0
    });

    if (roster) _classPrivateFieldSet(this, _roster, roster);

    _classPrivateFieldSet(this, _Dye, PrepDye.apply(null, effects || []));

    return new Proxy(this, {
      /** @returns {Pal|function} */
      get(tar, p) {
        var _p, _color;

        if (p in tar) return typeof (p = tar[p]) === FUN ? p.bind(tar) : p;
        if (p in _classPrivateFieldGet$1(tar, _roster)) return _classPrivateFieldGet$1(tar, _roster)[p];

        const {
          value: {
            color
          }
        } = _classPrivateFieldGet$1(tar, _pool).next();

        return _classPrivateFieldGet$1(tar, _roster)[p] = Pal.build((_p = p, _classPrivateFieldGet$1(tar, _Dye).call(tar, (_color = color, hexToRgb(_color)))(_p)));
      }

    });
  }

  aboard(name, color) {
    var _name, _color2;

    if (!color) ({
      value: {
        color
      }
    } = _classPrivateFieldGet$1(this, _pool).next());
    return _classPrivateFieldGet$1(this, _roster)[name] = Pal.build((_name = name, _classPrivateFieldGet$1(this, _Dye).call(this, (_color2 = color, hexToRgb(_color2)))(_name)));
  }

  roster(name) {
    var _classPrivateFieldGet2;

    if (name) return (_classPrivateFieldGet2 = _classPrivateFieldGet$1(this, _roster)[name]) === null || _classPrivateFieldGet2 === void 0 ? void 0 : _classPrivateFieldGet2.title;
    return mapper$1(_classPrivateFieldGet$1(this, _roster), ({
      title
    }) => title);
  }
  /**
   *
   * @param roster
   * @param effects
   * @returns {Says|Object<string,function>}
   */


  static build({
    roster,
    effects = [ITALIC$2]
  } = {}) {
    return new Says(roster, effects);
  }

}

var _roster = new WeakMap();

var _pool = new WeakMap();

var _Dye = new WeakMap();
/** @type {Function|Says} */


const says = new Says();

/** @function */

const says$1 = says;

/**
 *
 * @param {TableObject} table
 * @param {string|number} side
 * @param {string|number} banner
 * @param {Object|*[]|string|number} [field]
 * @param {Object|Object<str,function(*?):boolean>} [filter]
 * @param {function():number} [formula] - formula is valid only when cell is CubeCell array.
 * @returns {CrosTab}
 */

const pivotEdge = (table, {
  side,
  banner,
  field,
  filter,
  formula
}) => {
  var _ref, _fieldSet, _pivot$configs;

  if (filter) {
    var _table;

    table = tableFind.call((_table = table, slice(_table)), filter);
  }

  const {
    head,
    rows
  } = table,
        [x, y] = [head.indexOf(side), head.indexOf(banner)];
  let cube, mode;
  const fieldSet = parseFieldSet(field, side);
  _ref = (_fieldSet = fieldSet, deco(_fieldSet)), says$1['fieldSet'](_ref);
  const pivot = isMatrix(fieldSet) ? (cube = true, Cubic.build(x, y, makeBand.call(head, fieldSet))) : (cube = false, [field, mode] = fieldSet, Pivot.build(x, y, head.indexOf(field), mode));
  _pivot$configs = pivot.configs, delogger(_pivot$configs);
  const crostab = CrosTab.from(pivot.spread(rows).toJson());
  if (cube && formula) crostab.map(ar => formula.apply(null, ar));
  return crostab;
};

const makeBand = function (fieldSet) {
  const head = this;
  return mapper$4(fieldSet, ([field, mode]) => ({
    index: head.indexOf(field),
    mode
  }));
};

export { pivotDev, pivotEdge, pivotEdge as tablePivot };
