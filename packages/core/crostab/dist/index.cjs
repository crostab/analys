'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var crostabInit = require('@analys/crostab-init');
var crostabLookup = require('@analys/crostab-lookup');
var keyedRows = require('@analys/keyed-rows');
var tabular = require('@analys/tabular');
var comparer = require('@aryth/comparer');
var Mapper = require('@vect/vector-mapper');
var Merge = require('@vect/vector-merge');
var Zipper = require('@vect/vector-zipper');
var enumMatrixDirections = require('@vect/enum-matrix-directions');
var ColumnGetter = require('@vect/column-getter');
var Init = require('@vect/matrix-init');
var Mapper$1 = require('@vect/matrix-mapper');
var Transpose = require('@vect/matrix-transpose');
var columnMapper = require('@vect/column-mapper');
var columnsUpdate = require('@vect/columns-update');
var objectInit = require('@vect/object-init');

function _interopNamespace(e) {
      if (e && e.__esModule) return e;
      var n = Object.create(null);
      if (e) {
            Object.keys(e).forEach(function (k) {
                  if (k !== 'default') {
                        var d = Object.getOwnPropertyDescriptor(e, k);
                        Object.defineProperty(n, k, d.get ? d : {
                              enumerable: true,
                              get: function () { return e[k]; }
                        });
                  }
            });
      }
      n["default"] = e;
      return Object.freeze(n);
}

var Mapper__namespace = /*#__PURE__*/_interopNamespace(Mapper);
var Zipper__namespace = /*#__PURE__*/_interopNamespace(Zipper);
var Mapper__namespace$1 = /*#__PURE__*/_interopNamespace(Mapper$1);
var Transpose__namespace = /*#__PURE__*/_interopNamespace(Transpose);

const SP$1 = ' ';
const TB = '  ';
const LF$1 = '\n';

const RGB$1 = 'rgb',
      HSL$1 = 'hsl',
      HEX$1 = 'hex',
      INT$1 = 'int';

const CSI$1 = '[';
const SGR$1 = 'm';
// // // // // // // // // // //

const BOL_ON$1 = '1'; // BOLD / INCREASE_INTENSITY

const DIM_ON$1 = '2'; // DIM / DECREASE_INTENSITY / FAINT

const ITA_ON$1 = '3'; // ITALIC

const UND_ON$1 = '4'; // UNDERLINE

const BLI_ON$1 = '5'; // BLINK

const INV_ON$1 = '7'; // INVERSE

const HID_ON$1 = '8'; // HIDE / CONCEAL

const CRO_ON$1 = '9'; // CROSSED_OUT / STRIKE
// // // // // // // // // // //

const BOL_OFF$1 = '21'; // NOT_BOLD / DOUBLE_UNDERLINE

const DIM_OFF$1 = '22'; // NOT_DIM / NORMAL_INTENSITY

const ITA_OFF$1 = '23'; // NOT_ITALIC

const UND_OFF$1 = '24'; // NOT_UNDERLINE

const BLI_OFF$1 = '25'; // NOT_BLINK

const INV_OFF$1 = '27'; // NOT_INVERSE

const HID_OFF$1 = '28'; // NOT_HIDE / REVEAL

const CRO_OFF$1 = '29'; // NOT_CROSSED_OUT / UNSTRIKE

const FORE_INI$1 = '38;2'; // SET_FORECOLOR (24 bit (true-color))

const FORE_DEF$1 = '39'; // DEFAULT_FORECOLOR

/**
 *
 * applicable for smaller number
 * @param {number} x
 * @returns {number}
 */

const round$3 = x => x + (x > 0 ? 0.5 : -0.5) << 0;

const constraint$1 = (x, min, max) => x > max ? max : x < min ? min : x;

const oneself = x => x;

const rgbToInt$3 = ([r, g, b]) => ((r & 0xFF) << 16) + ((g & 0xFF) << 8) + (b & 0xFF);

function hexAt$3(tx, i) {
  let n = tx.charCodeAt(i);
  return n >> 5 <= 1 ? n & 0xf : (n & 0x7) + 9;
}

const prolif$3 = n => n << 4 | n;

function dil6$3(hex) {
  const hi = hex === null || hex === void 0 ? void 0 : hex.length;
  if (hi >= 6) return hex;
  if (hi === 5) return '0' + hex;
  if (hi === 4) return '00' + hex;
  if (hi === 3) return '000' + hex;
  if (hi === 2) return '0000' + hex;
  if (hi === 1) return '00000' + hex;
  if (hi <= 0) return '000000';
}
/**
 * @param {[number,number,number]} rgb
 * @returns {string}
 */


const rgbToHex$3 = rgb => '#' + dil6$3(rgbToInt$3(rgb).toString(16));

const bd = (r, g, b) => {
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

const hue$3 = (r, g, b, max, dif) => {
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
/**
 * @param {string} hex
 * @returns {number}
 */


function hexToInt$3(hex) {
  let lo = 0,
      hi = hex === null || hex === void 0 ? void 0 : hex.length;
  if (hi === 7) lo++, hi--;

  if (hi === 6) {
    const r = hexAt$3(hex, lo++) << 4 | hexAt$3(hex, lo++);
    const g = hexAt$3(hex, lo++) << 4 | hexAt$3(hex, lo++);
    const b = hexAt$3(hex, lo++) << 4 | hexAt$3(hex, lo++);
    return r << 16 | g << 8 | b;
  }

  if (hi === 4) lo++, hi--;

  if (hi === 3) {
    return prolif$3(hexAt$3(hex, lo++)) << 16 | prolif$3(hexAt$3(hex, lo++)) << 8 | prolif$3(hexAt$3(hex, lo++));
  }

  return 0;
}
/**
 *
 * @param {string} hex
 * @returns {number[]}
 */


function hexToRgb$3(hex) {
  const int = hexToInt$3(hex);
  return [int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF];
}

const THOUSAND$4 = 1000;
/**
 * !dif: dif===0
 * @param {number} int
 * @returns {[number,number,number]} [Hue([0,360]), Saturation([0,100]), Lightness([0,100])]
 */

function intToHsl$3(int) {
  let r = int >> 16 & 0xFF,
      g = int >> 8 & 0xFF,
      b = int & 0xFF;
  r /= 255;
  g /= 255;
  b /= 255;
  const {
    max,
    sum,
    dif
  } = bd(r, g, b);
  let h = hue$3(r, g, b, max, dif) * 60,
      s = !dif ? 0 : sum > 1 ? dif / (2 - sum) : dif / sum,
      l = sum / 2;
  return [round$3(h), round$3(s * THOUSAND$4) / 10, round$3(l * THOUSAND$4) / 10];
}

const hexToHsl$3 = hex => {
  var _ref, _hex;

  return _ref = (_hex = hex, hexToInt$3(_hex)), intToHsl$3(_ref);
};
/**
 *
 * @param {number} n
 * @param {number} h
 * @param {number} a
 * @param {number} l
 * @returns {number}
 */


const hf$3 = (n, h, a, l) => {
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


function hslToRgb$3([h, s, l]) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l),
        r = hf$3(0, h, a, l),
        g = hf$3(8, h, a, l),
        b = hf$3(4, h, a, l);
  return [round$3(r * 0xFF), round$3(g * 0xFF), round$3(b * 0xFF)]; // return [r * 0xFF & 0xFF, g * 0xFF & 0xFF, b * 0xFF & 0xFF]
}

const hslToHex$3 = hsl => {
  var _ref, _hsl;

  return _ref = (_hsl = hsl, hslToRgb$3(_hsl)), rgbToHex$3(_ref);
};

const SC$1 = ';';

function excite$1() {
  if (this.head.length) this.head += ';';
  if (this.tail.length) this.tail += ';';
  return this;
}
/** @param {number} int */


function pushInt$1(int) {
  excite$1.call(this);
  this.head += FORE_INI$1 + SC$1 + (int >> 16 & 0xFF) + SC$1 + (int >> 8 & 0xFF) + SC$1 + (int & 0xFF);
  this.tail += FORE_DEF$1;
  return this;
}
/** @param {number[]} rgb */


function pushRgb$1(rgb) {
  excite$1.call(this);
  this.head += FORE_INI$1 + SC$1 + rgb[0] + SC$1 + rgb[1] + SC$1 + rgb[2];
  this.tail += FORE_DEF$1;
  return this;
}
/** @param {string} hex */


function pushHex$1(hex) {
  var _hex;

  return pushInt$1.call(this, (_hex = hex, hexToInt$3(_hex)));
}
/** @param {number[]} hsl */


function pushHsl$1(hsl) {
  var _hsl;

  return pushRgb$1.call(this, (_hsl = hsl, hslToRgb$3(_hsl)));
}

const selectEncolor$1 = space => space === RGB$1 ? pushRgb$1 : space === HEX$1 ? pushHex$1 : space === HSL$1 ? pushHsl$1 : space === INT$1 ? pushInt$1 : pushRgb$1;
/** @param {string[]} style */


function enstyle$1(style) {
  if (!(style !== null && style !== void 0 && style.length)) return this;
  excite$1.call(this);

  for (let t of style) t[0] === 'b' ? (this.head += BOL_ON$1, this.tail += BOL_OFF$1 // BOLD
  ) : t[0] === 'd' ? (this.head += DIM_ON$1, this.tail += DIM_OFF$1 // DIM
  ) : t[0] === 'i' && t[1] === 't' ? (this.head += ITA_ON$1, this.tail += ITA_OFF$1 // ITALIC
  ) : t[0] === 'u' ? (this.head += UND_ON$1, this.tail += UND_OFF$1 // UNDERLINE
  ) : t[0] === 'b' ? (this.head += BLI_ON$1, this.tail += BLI_OFF$1 // BLINK
  ) : t[0] === 'i' ? (this.head += INV_ON$1, this.tail += INV_OFF$1 // INVERSE
  ) : t[0] === 'h' ? (this.head += HID_ON$1, this.tail += HID_OFF$1 // HIDE
  ) : t[0] === 's' ? (this.head += CRO_ON$1, this.tail += CRO_OFF$1 // STRIKE
  ) : void 0;

  return this;
}

class DyeFab$1 {
  head = '';
  tail = '';

  constructor(space, style) {
    if (space) this.setEncolor(space);
    if (style) this.enstyle(style);
  }

  static build(space, style) {
    return new DyeFab$1(space, style);
  }

  static prep(...effects) {
    return new DyeFab$1().enstyle(effects);
  }

  static shallow() {
    return {
      head: '',
      tail: ''
    };
  }

  reboot() {
    return this.head = '', this.tail = '', this;
  }

  slice() {
    return {
      head: this.head ?? '',
      tail: this.tail ?? ''
    };
  }

  copy() {
    return new DyeFab$1().assign(this);
  }
  /**
   * @param {string} head
   * @param {string} tail
   */


  inject(head, tail) {
    if (head) this.head = head;
    if (tail) this.tail = tail;
    return this;
  }

  assign(another) {
    const {
      head,
      tail
    } = another;
    if (head) this.head = head;
    if (tail) this.tail = tail;
    return this;
  }
  /** @param {string[]} styles */


  enstyle(styles) {
    return enstyle$1.call(this, styles);
  }

  setEncolor(space) {
    return this.encolor = selectEncolor$1(space), this;
  }

  render(text) {
    return CSI$1 + this.head + SGR$1 + text + CSI$1 + this.tail + SGR$1;
  }

}

class DyeFactory$1 extends DyeFab$1 {
  constructor(space, style) {
    super(space, style);
  }

  static build(space, style) {
    return new DyeFactory$1(space, style);
  }

  static prep(space, ...style) {
    return DyeFactory$1.prototype.make.bind(DyeFab$1.build(space, style));
  }

  static hex(...style) {
    return DyeFactory$1.prototype.make.bind(DyeFab$1.build(HEX$1, style));
  }

  static rgb(...style) {
    return DyeFactory$1.prototype.make.bind(DyeFab$1.build(RGB$1, style));
  }

  static hsl(...style) {
    return DyeFactory$1.prototype.make.bind(DyeFab$1.build(HSL$1, style));
  }

  static int(...style) {
    return DyeFactory$1.prototype.make.bind(DyeFab$1.build(INT$1, style));
  }

  make(color) {
    var _this$slice;

    const local = (this === null || this === void 0 ? void 0 : (_this$slice = this.slice) === null || _this$slice === void 0 ? void 0 : _this$slice.call(this)) ?? DyeFab$1.shallow();
    if (color) this.encolor.call(local, color);
    return DyeFab$1.prototype.render.bind(local);
  }

  render(color, text) {
    var _this$slice2;

    const local = (this === null || this === void 0 ? void 0 : (_this$slice2 = this.slice) === null || _this$slice2 === void 0 ? void 0 : _this$slice2.call(this)) ?? DyeFab$1.shallow();
    if (color) this.encolor.call(local, color);
    return DyeFab$1.prototype.render.call(local, text);
  }

}

const Amber$2 = {
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
const Blue$2 = {
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
const Cyan$2 = {
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
const DeepOrange$2 = {
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
const DeepPurple$2 = {
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
const Green$2 = {
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
const Indigo$2 = {
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
const LightBlue$2 = {
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
const LightGreen$2 = {
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
const Lime$2 = {
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
const Orange$2 = {
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
const Pink$2 = {
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
const Purple$2 = {
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
const Red$2 = {
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
const Teal$2 = {
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
const Yellow$2 = {
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
const BlueGrey$2 = {
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
const Brown$2 = {
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
const Grey$2 = {
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

const Cards$2 = {
  red: Red$2,
  pink: Pink$2,
  purple: Purple$2,
  deepPurple: DeepPurple$2,
  indigo: Indigo$2,
  blue: Blue$2,
  lightBlue: LightBlue$2,
  cyan: Cyan$2,
  teal: Teal$2,
  green: Green$2,
  lightGreen: LightGreen$2,
  lime: Lime$2,
  yellow: Yellow$2,
  amber: Amber$2,
  orange: Orange$2,
  deepOrange: DeepOrange$2,
  brown: Brown$2,
  blueGrey: BlueGrey$2,
  grey: Grey$2
};
Reflect.defineProperty(Cards$2, 'colors', {
  get() {
    return Object.keys(Cards$2);
  },

  enumerable: false
});
Reflect.defineProperty(Cards$2, 'degrees', {
  get() {
    for (let color in Cards$2) return Object.keys(Cards$2[color]);
  },

  enumerable: false
});

const nullish$2 = x => x === null || x === void 0;

const {
  random: random$1$1
} = Math;

const rand = l => ~~(random$1$1() * l);
/**
 * From [min, max] return a random integer.
 * Of [min, max], both min and max are inclusive.
 * @param {number} lo(inclusive) - int
 * @param {number} hi(inclusive) - int
 * @returns {number} int
 */


const randBetw = (lo, hi) => rand(++hi - lo) + lo;

const flopIndex = ar => rand(ar.length);

const flop = ar => ar[flopIndex(ar)];

const {
  random: random$2,
  abs: abs$2,
  exp: exp$2,
  log: log$2,
  sqrt: sqrt$2,
  pow: pow$2,
  cos: cos$2,
  sin: sin$2,
  PI: PI$2
} = Math;
const R0$2 = 3.442619855899;
exp$2(-0.5 * R0$2 * R0$2);
-pow$2(2, 32);

const toner = (hsl, dh, ds, dl) => {
  if (dh) hsl[0] = constraint$1(hsl[0] + dh, 0, 360);
  if (ds) hsl[1] = constraint$1(hsl[1] + ds, 0, 100);
  if (dl) hsl[2] = constraint$1(hsl[2] + dl, 0, 100);
  return hsl;
};

({
  max: Cards$2.cyan.accent_2,
  min: Cards$2.green.darken_1,
  na: Cards$2.grey.lighten_4
});
({
  max: Cards$2.cyan.lighten_3,
  min: Cards$2.orange.lighten_2,
  na: Cards$2.pink.lighten_4
});
({
  max: Cards$2.green.accent_3,
  min: Cards$2.deepPurple.accent_1,
  na: Cards$2.teal.accent_1
});
({
  max: Cards$2.cyan.accent_1,
  min: Cards$2.lightBlue.accent_4,
  na: Cards$2.deepOrange.accent_1
});
const FRESH = {
  max: Cards$2.lightGreen.accent_3,
  min: Cards$2.deepOrange.accent_3,
  na: Cards$2.blue.lighten_3
};
({
  max: Cards$2.orange.accent_2,
  min: Cards$2.purple.accent_1,
  na: Cards$2.grey.lighten_2
});
({
  max: Cards$2.lime.accent_3,
  min: Cards$2.lightGreen.accent_3,
  na: Cards$2.blueGrey.accent_1
});
({
  max: Cards$2.amber.accent_3,
  min: Cards$2.red.lighten_1,
  na: Cards$2.grey.accent_2
});
({
  max: Cards$2.pink.lighten_2,
  min: Cards$2.blue.lighten_4,
  na: Cards$2.teal.accent_3
});
({
  max: Cards$2.lightGreen.accent_3,
  min: Cards$2.teal.lighten_3,
  na: Cards$2.brown.accent_1
});
({
  max: Cards$2.lightBlue.accent_2,
  min: Cards$2.indigo.base,
  na: Cards$2.pink.lighten_3
});
const PLANET$1 = {
  max: Cards$2.teal.accent_2,
  min: Cards$2.blue.darken_3,
  na: Cards$2.cyan.lighten_4
};
({
  max: Cards$2.red.lighten_2,
  min: Cards$2.yellow.darken_1,
  na: Cards$2.green.lighten_2
});
({
  max: Cards$2.grey.lighten_5,
  min: Cards$2.grey.darken_1,
  na: Cards$2.indigo.lighten_3
});
({
  max: Cards$2.pink.lighten_4,
  min: Cards$2.deepPurple.accent_2,
  na: Cards$2.amber.darken_2
});

const reverseHue = hue => {
  hue += 180;
  return hue > 360 ? hue - 360 : hue < 0 ? hue + 360 : hue;
};

const constraint = (x, min, max) => x > max ? max : x < min ? min : x;

const randPreset = hex => {
  var _min, _toner, _ref;

  const min = hex;
  const hsl = (_min = min, hexToHsl$3(_min));
  const max = (_toner = toner(hsl.slice(), randBetw(-12, 12), randBetw(-5, 10), randBetw(6, 18)), hslToHex$3(_toner));
  const na = (_ref = [reverseHue(hsl[0]), constraint(hsl[1] - 32, 5, 90), constraint(hsl[2] + 24, 40, 96)], hslToHex$3(_ref));
  return {
    min,
    max,
    na
  };
};

// from x => typeof x
const STR$3 = 'string';
const FUN = 'function';

const v1$1 = word => (word.toLowerCase().charCodeAt(0) & 0x7f) << 21;

const v2$1 = word => (((word = word.toLowerCase()).charCodeAt(0) & 0x7f) << 21) + ((word.charCodeAt(1) & 0x7f) << 14);

const v3$1 = word => (((word = word.toLowerCase()).charCodeAt(0) & 0x7f) << 21) + ((word.charCodeAt(1) & 0x7f) << 14) + ((word.charCodeAt(2) & 0x7f) << 7);

const v4$1 = word => (((word = word.toLowerCase()).charCodeAt(0) & 0x7f) << 21) + ((word.charCodeAt(1) & 0x7f) << 14) + ((word.charCodeAt(2) & 0x7f) << 7) + (word.charCodeAt(3) & 0x7f);

const stringValue$1 = word => {
  const l = word === null || word === void 0 ? void 0 : word.length;
  if (!l) return NaN;
  if (typeof word !== STR$3) return NaN;
  if (l >= 8) return (v4$1(word.slice(0, 4)) << 2) + v4$1(word.slice(-4));
  if (l === 7) return (v4$1(word.slice(0, 4)) << 2) + v3$1(word.slice(-3));
  if (l === 6) return (v4$1(word.slice(0, 4)) << 2) + v2$1(word.slice(-2));
  if (l === 5) return (v4$1(word.slice(0, 4)) << 2) + v1$1(word.slice(-1));
  if (l === 4) return v4$1(word) << 2;
  if (l === 3) return v3$1(word) << 2;
  if (l === 2) return v2$1(word) << 2;
  if (l === 1) return v1$1(word) << 2;
};

/**
 *
 * @type {Function|function(*):string}
 */
Function.prototype.call.bind(Object.prototype.toString);

/**
 * validate
 * @param x
 * @param y
 * @returns {number}
 */


const validate$2 = (x, y) => isNaN(x - y) ? NaN : y;

const parseNum$3 = x => validate$2(x, parseFloat(x));

const FULL_NUM$1 = '０-９'; // 0xff10 - 0xff19

const REG_NUM_FULL = new RegExp(`^\s*[－＋]?(?:，*[${FULL_NUM$1}]+)*．?[${FULL_NUM$1}]+\s*$`);
/**
 *
 * @param {string} tx
 * @returns {boolean}
 */

const isNumeric$3 = tx => REG_NUM_FULL.test(tx);

const NON_SPACE = /[^\s]/;

const parseNum$2 = text => {
  if (!text) return NaN;
  let l = text.length,
      i = text.search(NON_SPACE),
      t = '',
      n,
      v;

  while (i < l && (n = text.charCodeAt(i++))) if (n !== 0xff0c) {
    v = 0xFF & n + 0x20;
    t += String.fromCharCode(v < n ? v : n);
  }

  return parseNum$3(t);
};

const ANSI_ALPHA$1 = /(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?)/;
const ANSI_BETA$1 = /(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~])/;
const ANSI$1 = new RegExp(`[][[\\]()#;?]*(?:${ANSI_ALPHA$1.source}|${ANSI_BETA$1.source})`);

const hasAnsi$1 = tx => ANSI$1.test(tx);

const COMMA$1 = /,/g;

const isNumeric$2 = x => {
  var _x;

  x = (_x = x) == null ? void 0 : _x.replace(COMMA$1, '');
  return !isNaN(x - parseFloat(x));
};

const validate$1 = (x, y) => isNaN(x - y) ? NaN : y;

const parseNum$1 = x => {
  var _x;

  x = (_x = x) == null ? void 0 : _x.replace(COMMA$1, '');
  return validate$1(x, parseFloat(x));
};

const CJK_LETTERS$1 = '\u4e00-\u9fbf';

const HALF_NUM = '0-9';
const HALF_UPPER = 'A-Z';
const HALF_LOWER = 'a-z';
const FULL_NUM = '０-９'; // 0xff10 - 0xff19

const FULL_UPPER = 'Ａ-Ｚ'; // 0xff21 - 0xff3a

const FULL_LOWER = 'ａ-ｚ'; // 0xff41 - 0xff5a

const LITERAL_LOWER = `${HALF_UPPER}${HALF_LOWER}${HALF_NUM}`;
const LITERAL_UPPER = `${FULL_UPPER}${FULL_LOWER}${FULL_NUM}`;
const LITERAL$2 = new RegExp(`[${LITERAL_LOWER}]+`); // LITERAL = /[A-Za-z0-9]+/

const LITERAL_ANY = new RegExp(`[${LITERAL_LOWER}${CJK_LETTERS$1}${LITERAL_UPPER}]+`);

const isString = x => typeof x === STR$3;

const isLiteral = x => LITERAL$2.test(x);

const isLiteralAny = x => LITERAL_ANY.test(x);

const hasLiteral = x => isString(x) && isLiteral(x);

const nullish$1 = x => x === null || x === void 0;

const replenish$1 = (object, another) => {
  for (let k in another) if (nullish$1(object[k])) object[k] = another[k];

  return object;
};

const first = ve => ve[0];

/**
 * Create an array.
 * @param {number} size Integer starts at zero.
 * @param {function(number):*|*} [fn] defines how index i corresponds to value(i).
 * @returns {*[]}
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
  iterate: iterate$3,
  reviter,
  mapper: mapper$3,
  mutate: mutate$1
} = Mapper__namespace;
const {
  zipper,
  mutazip: mutazip$1,
  iterzip,
  duozipper,
  trizipper,
  quazipper,
  Duozipper,
  Trizipper,
  Quazipper
} = Zipper__namespace;

/**
 *
 * @type {Function|function(*):string}
 */
Function.prototype.call.bind(Object.prototype.toString);

const isNumeric$1 = x => !isNaN(x - parseFloat(x));

// from x => typeof x
const STR$2 = 'string';

const v1 = word => (word.toLowerCase().charCodeAt(0) & 0x7f) << 21;

const v2 = word => (((word = word.toLowerCase()).charCodeAt(0) & 0x7f) << 21) + ((word.charCodeAt(1) & 0x7f) << 14);

const v3 = word => (((word = word.toLowerCase()).charCodeAt(0) & 0x7f) << 21) + ((word.charCodeAt(1) & 0x7f) << 14) + ((word.charCodeAt(2) & 0x7f) << 7);

const v4 = word => (((word = word.toLowerCase()).charCodeAt(0) & 0x7f) << 21) + ((word.charCodeAt(1) & 0x7f) << 14) + ((word.charCodeAt(2) & 0x7f) << 7) + (word.charCodeAt(3) & 0x7f);

const stringValue = word => {
  const l = word == null ? void 0 : word.length;
  if (!l) return NaN;
  if (typeof word !== STR$2) return NaN;
  if (l >= 8) return (v4(word.slice(0, 4)) << 2) + v4(word.slice(-4));
  if (l === 7) return (v4(word.slice(0, 4)) << 2) + v3(word.slice(-3));
  if (l === 6) return (v4(word.slice(0, 4)) << 2) + v2(word.slice(-2));
  if (l === 5) return (v4(word.slice(0, 4)) << 2) + v1(word.slice(-1));
  if (l === 4) return v4(word) << 2;
  if (l === 3) return v3(word) << 2;
  if (l === 2) return v2(word) << 2;
  if (l === 1) return v1(word) << 2;
};

const STR$1 = 'string';
const COMMA = /,/g;

const isNumeric = x => {
  if (typeof x === STR$1) x = x.replace(COMMA, '');
  return !isNaN(x - parseFloat(x));
};
/**
 * validate
 * @param x
 * @param y
 * @returns {number}
 */


const validate = (x, y) => isNaN(x - y) ? NaN : y;

const parseNum = x => {
  if (typeof x === STR$1) x = x.replace(COMMA, '');
  return validate(x, parseFloat(x));
};

const iterate$2 = function (vec, fn, l) {
  l = l || (vec === null || vec === void 0 ? void 0 : vec.length);

  for (let i = 0; i < l; i++) fn.call(this, vec[i], i);
};
/**
 *
 * @typedef {Array} BoundedVector
 * @typedef {number} BoundedVector.max
 * @typedef {number} BoundedVector.min
 *
 * @typedef {Object} Config
 * @typedef {Function} Config.filter
 * @typedef {Function} Config.mapper
 *
 * @param {*[]} words
 * @param {Config} [configX]
 * @param {Config} [configY]
 * @return {[?BoundedVector, ?BoundedVector]}
 */


const duobound$1 = function (words, [configX, configY] = []) {
  const l = words === null || words === void 0 ? void 0 : words.length;
  let vecX = undefined,
      vecY = undefined;
  if (!l) return [vecX, vecY];
  const {
    filter: filterX,
    mapper: mapperX
  } = configX,
        {
    filter: filterY,
    mapper: mapperY
  } = configY;
  iterate$2(words, (v, i) => {
    if (filterX(v) && (vecX ?? (vecX = Array(l)))) {
      v = mapperX(v);

      if (v > (vecX.max ?? (vecX.max = vecX.min = v))) {
        vecX.max = v;
      } else if (v < vecX.min) {
        vecX.min = v;
      }

      return vecX[i] = v;
    }

    if (filterY(v) && (vecY ?? (vecY = Array(l)))) {
      v = mapperY(v);

      if (v > (vecY.max ?? (vecY.max = vecY.min = v))) {
        vecY.max = v;
      } else if (v < vecY.min) {
        vecY.min = v;
      }

      return vecY[i] = v;
    }

    return NaN;
  }, l);
  return [vecX, vecY];
};
/**
 *
 * @typedef {*[]} BoundedVector
 * @typedef {number} BoundedVector.max
 * @typedef {number} BoundedVector.min
 *
 * @typedef {Object} Config
 * @typedef {Function} Config.filter
 * @typedef {Function} Config.mapper
 *
 * @param {*[]} words
 * @param {Config} [config]
 * @return {?BoundedVector}
 */


const solebound$1 = function (words, config) {
  const l = words === null || words === void 0 ? void 0 : words.length;
  let vec = undefined;
  if (!l) return vec;
  const {
    filter,
    mapper
  } = config;
  if (!filter) return vec;
  iterate$2(words, (v, i) => {
    if (filter(v) && (vec ?? (vec = Array(l)))) {
      v = mapper(v);

      if (v > (vec.max ?? (vec.max = vec.min = v))) {
        vec.max = v;
      } else if (v < vec.min) {
        vec.min = v;
      }

      return vec[i] = v;
    }

    return NaN;
  }, l);
  return vec;
};
/**
 *
 * @typedef {Array} BoundedVector
 * @typedef {number} BoundedVector.max
 * @typedef {number} BoundedVector.min
 *
 * @typedef {Object} Config
 * @typedef {function(*):boolean} Config.filter
 * @typedef {function(*):number} Config.mapper
 *
 * @param {*[]} words
 * @param {Config[]} configs
 * @return {?BoundedVector[]}
 */


const multibound$1 = function (words, configs) {
  const l = words === null || words === void 0 ? void 0 : words.length;
  const vectorCollection = configs.map(x => undefined);
  if (!l) return vectorCollection;
  iterate$2(words, (v, i) => configs.some(({
    filter,
    mapper
  }, j) => {
    let vec = vectorCollection[j];

    if (filter(v) && (vec ?? (vec = vectorCollection[j] = Array(l)))) {
      v = mapper(v);

      if (v > (vec.max ?? (vec.max = vec.min = v))) {
        vec.max = v;
      } else if (v < vec.min) {
        vec.min = v;
      }

      return vec[i] = v, true;
    }
  }), l);
  return vectorCollection;
};
/**
 *
 * @typedef {Array} BoundedVector
 * @typedef {number} BoundedVector.max
 * @typedef {number} BoundedVector.min
 *
 * @typedef {Object} Config
 * @typedef {function(*):boolean} Config.filter
 * @typedef {function(*):number} Config.mapper
 *
 * @param {*[]} words
 * @param {Config[]} configs
 * @return {?BoundedVector[]}
 */


const boundaries$1 = function (words, configs) {
  const count = configs.length;
  if (count === 0) return [];

  if (count === 1) {
    const [x = {}] = configs;
    x.filter = (x === null || x === void 0 ? void 0 : x.filter) ?? isNumeric, x.mapper = (x === null || x === void 0 ? void 0 : x.mapper) ?? parseNum;
    return [solebound$1(words, configs[0])];
  }

  if (count === 2) {
    const [x, y] = configs;
    const fX = (x === null || x === void 0 ? void 0 : x.filter) ?? isNumeric,
          mX = (x === null || x === void 0 ? void 0 : x.mapper) ?? parseNum;
    const fY = (y === null || y === void 0 ? void 0 : y.filter) ?? hasLiteral,
          mY = (y === null || y === void 0 ? void 0 : y.mapper) ?? stringValue;
    return duobound$1(words, [{
      filter: fX,
      mapper: mX
    }, {
      filter: fY,
      mapper: mY
    }]);
  }

  if (count >= 3) return multibound$1(words, configs);
};

// export const
//   FUNC = '',
//   PIGM = '',
//   HEX = ''
const MAKER = 'maker',
      RENDER = 'render',
      COLOR = 'color';
const MUTATE_PIGMENT = {
  colorant: RENDER,
  mutate: true
};

/**
 *
 * @param {Object} bound
 * @param {number} [bound.min] - if min: if dif, return {min,dif}; if max, return calculated {min,dif}
 * @param {number} [bound.dif] - if dif: if max, return calculated {min,dif}; else return {min:0,dif}
 * @param {number} [bound.max] - if max: return {min:0,dif:max}; else return {min:0,dif:0}
 * @return {{dif: number, min: number}}
 */

const parseBound$2 = bound => {
  // if (!bound) return { min: 0, dif: 0 }
  let {
    min,
    max,
    dif
  } = bound;

  if (!nullish$2(min)) {
    if (!nullish$2(dif)) return {
      min,
      dif
    };
    if (!nullish$2(max)) return {
      min,
      dif: max - min
    };
  }

  if (!nullish$2(dif)) {
    if (!nullish$2(max)) return {
      min: max - dif,
      dif
    };
    return {
      min: 0,
      dif
    };
  }

  if (!nullish$2(max)) return {
    min: 0,
    dif: max
  };
  return {
    min: 0,
    dif: 0
  };
};

const leverage$2 = ([x, y, z], delta) => [x / delta, y / delta, z / delta];

const minus$2 = ([x_, y_, z_], [_x, _y, _z]) => [x_ - _x, y_ - _y, z_ - _z];

const scale$2 = (x, lo, lev, min$1, hi) => comparer.min((comparer.max(x, lo) - lo) * lev + min$1, hi);
/**
 * @typedef {[number,number,number]} Triple
 * @typedef {function(string):string} dye
 * @typedef {{max:string,min:string,na:string,effects?:string[]}} PresetHEX
 * @typedef {{max:Triple,min:Triple,na:Triple,effects?:string[]}} PresetHSL
 * @typedef {{min:Triple,dif:Triple}} LeapHSL
 * @typedef {{min:number,dif:number}} LeapNum
 */


class ProjectorConfig$2 {
  /** @type {function(Triple):dye} */
  fab;
  /** @type {number} */

  lo;
  /** @type {Triple} */

  lev;
  /** @type {Triple} */

  min;
  /** @type {Triple} */

  nap;
  /**
   * @param {LeapNum} leapNum
   * @param {LeapHSL} leapHSL
   * @param {Triple} napHSL
   * @param {string[]} effects
   */

  constructor(leapNum, leapHSL, napHSL, effects) {
    // this.fab = DyeFactory.build(HSL, effects)
    this.fab = DyeFactory$1.prototype.make.bind(DyeFab$1.build(HSL$1, effects));
    this.lo = leapNum.min;
    this.lev = !leapNum.dif ? 0 : leverage$2(leapHSL.dif, leapNum.dif);
    this.min = leapHSL.min;
    this.nap = napHSL;
  }
  /**
   * @param {Object} bound
   * @param {PresetHEX} preset
   * @returns {ProjectorConfig}
   */


  static fromHEX(bound, preset) {
    var _preset$max, _preset$min, _preset$na;

    const max = (_preset$max = preset.max, hexToHsl$3(_preset$max)),
          min = (_preset$min = preset.min, hexToHsl$3(_preset$min)),
          nap = (_preset$na = preset.na, hexToHsl$3(_preset$na)),
          effects = preset.effects;
    return new ProjectorConfig$2(parseBound$2(bound), {
      min,
      dif: minus$2(max, min)
    }, nap, effects);
  }
  /**
   * @param {Object} bound
   * @param {PresetHSL} preset
   * @returns {ProjectorConfig}
   */


  static fromHSL(bound, preset) {
    const {
      max,
      min,
      na: nap,
      effects
    } = preset;
    return new ProjectorConfig$2(parseBound$2(bound), {
      min,
      dif: minus$2(max, min)
    }, nap, effects);
  }

  project(value) {
    const {
      lo,
      lev,
      min
    } = this;
    return [scale$2(value, lo, lev[0], min[0], 360), scale$2(value, lo, lev[1], min[1], 100), scale$2(value, lo, lev[2], min[2], 100)];
  }

  get dyeNAp() {
    return this.fab(this.nap);
  }

}

/**
 * @typedef {[number,number,number]} Triple
 * @typedef {function(string):string} dye
 */

class ProjectorFactory$1 {
  /** @type {function(Triple):dye} */
  fab;
  /** @type {number} */

  lo;
  /** @type {Triple} */

  lev;
  /** @type {Triple} */

  min;
  /** @type {Triple} */

  nap;
  /**
   * @param {Object} config
   * @param {function(Triple):dye} config.fab
   * @param {number}  config.lo
   * @param {Triple}  config.lev
   * @param {Triple}  config.min
   * @param {Triple}  config.nap
   */

  constructor(config) {
    Object.assign(this, config);
  }

  static fromHEX(bound, preset) {
    if (!bound || !preset) {
      return new VoidProjectorFactory$1();
    }

    const config = ProjectorConfig$2.fromHEX(bound, preset);
    if (!config.lev) return new SoleProjectorFactory$1(config);
    return new ProjectorFactory$1(config);
  }

  static fromHSL(bound, preset) {
    if (!bound || !preset) {
      return new VoidProjectorFactory$1();
    }

    const config = ProjectorConfig$2.fromHSL(bound, preset);
    if (!config.lev) return new SoleProjectorFactory$1(config);
    return new ProjectorFactory$1(config);
  }

  render(value, text) {
    return this.fab(this.color(value))(text);
  }

  make(value) {
    return this.fab(this.color(value));
  }

  color(value) {
    if (isNaN(value)) return this.nap;
    const {
      lo,
      lev,
      min
    } = this;
    return [scale$2(value, lo, lev[0], min[0], 360), scale$2(value, lo, lev[1], min[1], 100), scale$2(value, lo, lev[2], min[2], 100)];
  }

}

class SoleProjectorFactory$1 {
  /** @type {function(*):dye} */
  fab;
  /** @type {Triple} */

  min;
  /** @type {Triple} */

  nap;

  constructor(config) {
    Object.assign(this, config);
  }

  render(value, text) {
    return this.fab(this.color(value))(text);
  }

  make(value) {
    return this.fab(this.color(value));
  }

  color(value) {
    return isNaN(value) ? this.nap : this.min;
  }

}

class VoidProjectorFactory$1 {
  constructor(config) {
    Object.assign(this, config);
  }

  render(value, text) {
    return text;
  }

  make(value) {
    return oneself;
  }

  color(value) {
    return null;
  }

} // if (!preset) { return new VoidProjectorFactory() } else { preset = presetToLeap(preset) }

/**
 * @typedef {Object} Preset
 * @typedef {string} Preset.max
 * @typedef {string} Preset.min
 * @typedef {string} Preset.na
 * @typedef {?string[]} Preset.effects
 * @typedef {?Function} Preset.filter
 * @typedef {?Function} Preset.mapper
 *
 * @param {*[]} vec
 * @param {Preset[]} presets
 * @returns {*[]}
 */

const fluoVector = function (vec, presets) {
  if (!(vec !== null && vec !== void 0 && vec.length)) return [];

  const projectorCollection = _toProjectorCollection(vec, presets);

  const mapper$1 = this !== null && this !== void 0 && this.mutate ? Mapper.mutate : Mapper.mapper;

  switch (this === null || this === void 0 ? void 0 : this.colorant) {
    case COLOR:
      return mapper$1(vec, ColorFactory.color(projectorCollection));

    case MAKER:
      return mapper$1(vec, ColorFactory.maker(projectorCollection));

    case RENDER:
    default:
      return mapper$1(vec, ColorFactory.render(projectorCollection));
  }
};

const _toProjectorCollection = (vec, presetCollection = []) => {
  const [confX, confY] = presetCollection;
  const [vecX, vecY] = boundaries$1(vec, presetCollection);
  const [projX, projY] = [ProjectorFactory$1.fromHEX(vecX, confX), ProjectorFactory$1.fromHEX(vecY, confY)];
  return [[vecX, projX], [vecY, projY]];
};

class ColorFactory {
  static color([[bX, pX], [bY, pY]]) {
    function toColor(hsl) {
      var _hsl;

      return hsl ? (_hsl = hsl, hslToHex$3(_hsl)) : null;
    }

    return (_, i) => {
      let v;

      if (!nullish$2(v = bX && bX[i])) {
        var _pX$color;

        return _pX$color = pX.color(v), toColor(_pX$color);
      }

      if (!nullish$2(v = bY && bY[i])) {
        var _pY$color;

        return _pY$color = pY.color(v), toColor(_pY$color);
      }

      return null;
    };
  }

  static maker([[bX, pX], [bY, pY]]) {
    return (_, i) => {
      var _ref;

      let v;

      if (!nullish$2(v = bX && bX[i])) {
        return pX.make(v);
      }

      if (!nullish$2(v = bY && bY[i])) {
        return pY.make(v);
      }

      return ((_ref = pX || pY) === null || _ref === void 0 ? void 0 : _ref.make(pX.nap)) ?? oneself;
    };
  }

  static render([[bX, pX], [bY, pY]]) {
    return (n, i) => {
      var _ref2;

      let v;

      if (!nullish$2(v = bX && bX[i])) {
        return pX.render(v, n);
      }

      if (!nullish$2(v = bY && bY[i])) {
        return pY.render(v, n);
      }

      return ((_ref2 = pX || pY) === null || _ref2 === void 0 ? void 0 : _ref2.render(pX.nap, n)) ?? n;
    };
  }

}

const iterate$1 = function (mx, fnOnColumns, h, w) {
  var _mx$;

  h = h || (mx === null || mx === void 0 ? void 0 : mx.length), w = w || h && ((_mx$ = mx[0]) === null || _mx$ === void 0 ? void 0 : _mx$.length);

  for (let j = 0, cols = ColumnGetter.Columns(mx); j < w; j++) fnOnColumns.call(this, cols(j, h), j);
};

const mapper$2 = (mx, mapOnColumns, h, w) => {
  var _mx$;

  h = h || (mx === null || mx === void 0 ? void 0 : mx.length), w = w || h && ((_mx$ = mx[0]) === null || _mx$ === void 0 ? void 0 : _mx$.length); // 'mapperColumns' |> logger

  const tcol = Array(w);

  for (let j = 0, cols = ColumnGetter.Columns(mx); j < w; j++) {
    tcol[j] = mapOnColumns(cols(j, h), j); // Xr().index(j).col(cols(j, h)).result(tcol[j]) |> logger
  } // tcol |> logger


  return tcol;
};

var ColumnsMapper = /*#__PURE__*/Object.freeze({
      __proto__: null,
      iterate: iterate$1,
      mapper: mapper$2
});

const height$1 = mx => mx === null || mx === void 0 ? void 0 : mx.length;

const width$1 = mx => {
  let r;
  return height$1(mx) && (r = mx[0]) ? r.length : r;
};

const size$1 = mx => {
  let h, r;
  return mx && (h = mx.length) && (r = mx[0]) ? [h, r.length] : [h, r];
};

var Size = /*#__PURE__*/Object.freeze({
      __proto__: null,
      height: height$1,
      size: size$1,
      width: width$1
});

const {
  iterate,
  mutate,
  mapper: mapper$1
} = Mapper__namespace$1;
const {
  size,
  width,
  height
} = Size;
const {
  transpose
} = Transpose__namespace;
const {
  mapper: columnsMapper
} = ColumnsMapper;

/**
 *
 * @typedef {*[][]} BoundedMatrix
 * @typedef {number} BoundedMatrix.max
 * @typedef {number} BoundedMatrix.min
 *
 * @typedef {Object} Config
 * @typedef {Function} Config.filter
 * @typedef {Function} Config.mapper
 *
 * @param {*[][]} wordx
 * @param {Config} configX
 * @param {Config} configY
 * @return {[?BoundedMatrix, ?BoundedMatrix]}
 */


const duobound = (wordx, [configX, configY] = []) => {
  const [h, w] = size$1(wordx);
  let matX = undefined,
      matY = undefined;
  if (!h || !w) return [matX, matY];
  const {
    filter: filterX,
    mapper: mapperX
  } = configX,
        {
    filter: filterY,
    mapper: mapperY
  } = configY;
  Mapper$1.iterate(wordx, (v, i, j) => {
    if (filterX(v) && (matX ?? (matX = Init.iso(h, w, undefined)))) {
      v = mapperX(v);

      if (v > (matX.max ?? (matX.max = matX.min = v))) {
        matX.max = v;
      } else if (v < matX.min) {
        matX.min = v;
      }

      return matX[i][j] = v;
    }

    if (filterY(v) && (matY ?? (matY = Init.iso(h, w, undefined)))) {
      v = mapperY(v);

      if (v > (matY.max ?? (matY.max = matY.min = v))) {
        matY.max = v;
      } else if (v < matY.min) {
        matY.min = v;
      }

      return matY[i][j] = v;
    }

    return NaN;
  }, h, w);
  return [matX, matY];
};
/**
 *
 * @typedef {*[][]} BoundedMatrix
 * @typedef {number} BoundedMatrix.max
 * @typedef {number} BoundedMatrix.min
 *
 * @typedef {Object} Config
 * @typedef {Function} Config.filter
 * @typedef {Function} Config.mapper
 *
 * @param {*[][]} wordx
 * @param {Config} [config]
 * @return {?BoundedMatrix}
 */


const solebound = (wordx, config) => {
  const [height, width] = size$1(wordx);
  /** @type {?BoundedMatrix} */

  let mx = undefined;
  if (!height || !width) return mx;
  const {
    filter,
    mapper
  } = config;
  Mapper$1.iterate(wordx, (v, i, j) => {
    if (filter(v) && (mx ?? (mx = Init.iso(height, width, undefined)))) {
      v = mapper(v);

      if (v > (mx.max ?? (mx.max = mx.min = v))) {
        mx.max = v;
      } else if (v < mx.min) {
        mx.min = v;
      }

      return mx[i][j] = v;
    }

    return NaN;
  }, height, width);
  return mx;
};
/**
 *
 * @typedef {*[][]} BoundedMatrix
 * @typedef {number} BoundedMatrix.max
 * @typedef {number} BoundedMatrix.min
 *
 * @typedef {Object} Config
 * @typedef {Function} Config.filter
 * @typedef {Function} Config.mapper
 *
 * @param {*[][]} wordx
 * @param {Config[]} configs
 * @return {?BoundedMatrix[]}
 */


const multibound = (wordx, configs) => {
  const [h, w] = size$1(wordx);
  const matrixCollection = configs.map(_ => undefined);
  if (!h || !w) return matrixCollection;
  Mapper$1.iterate(wordx, (v, i, j) => {
    configs.some(({
      filter,
      mapper
    }, k) => {
      let mx = matrixCollection[k];

      if (filter(v) && (mx ?? (mx = matrixCollection[k] = Init.iso(h, w, undefined)))) {
        v = mapper(v);

        if (v > (mx.max ?? (mx.max = mx.min = v))) {
          mx.max = v;
        } else if (v < mx.min) {
          mx.min = v;
        }

        mx[i][j] = v;
        return true;
      }
    });
  }, h, w);
  return matrixCollection;
};
/**
 *
 * @typedef {*[][]} BoundedMatrix
 * @typedef {number} BoundedMatrix.max
 * @typedef {number} BoundedMatrix.min
 *
 * @typedef {Object} Config
 * @typedef {function(*):boolean} Config.filter
 * @typedef {function(*):number} Config.mapper
 *
 * @param {*[][]} wordx
 * @param {Config[]} configs
 * @return {?BoundedMatrix[]}
 */


const boundaries = function (wordx, configs = []) {
  const count = configs.length;
  if (count === 0) return [];

  if (count === 1) {
    const [x] = configs;
    const filter = (x === null || x === void 0 ? void 0 : x.filter) ?? isNumeric,
          mapper = (x === null || x === void 0 ? void 0 : x.mapper) ?? parseNum;
    return [solebound(wordx, {
      filter,
      mapper
    })];
  }

  if (count === 2) {
    const [x, y] = configs;
    const fX = (x === null || x === void 0 ? void 0 : x.filter) ?? isNumeric,
          mX = (x === null || x === void 0 ? void 0 : x.mapper) ?? parseNum;
    const fY = (y === null || y === void 0 ? void 0 : y.filter) ?? hasLiteral,
          mY = (y === null || y === void 0 ? void 0 : y.mapper) ?? stringValue;
    return duobound(wordx, [{
      filter: fX,
      mapper: mX
    }, {
      filter: fY,
      mapper: mY
    }]);
  }

  if (count >= 3) return multibound(wordx, configs);
};

/**
 *
 * @param {Object} bound
 * @param {number} [bound.min] - if min: if dif, return {min,dif}; if max, return calculated {min,dif}
 * @param {number} [bound.dif] - if dif: if max, return calculated {min,dif}; else return {min:0,dif}
 * @param {number} [bound.max] - if max: return {min:0,dif:max}; else return {min:0,dif:0}
 * @return {{dif: number, min: number}}
 */

const parseBound$1 = bound => {
  // if (!bound) return { min: 0, dif: 0 }
  let {
    min,
    max,
    dif
  } = bound;

  if (!nullish$2(min)) {
    if (!nullish$2(dif)) return {
      min,
      dif
    };
    if (!nullish$2(max)) return {
      min,
      dif: max - min
    };
  }

  if (!nullish$2(dif)) {
    if (!nullish$2(max)) return {
      min: max - dif,
      dif
    };
    return {
      min: 0,
      dif
    };
  }

  if (!nullish$2(max)) return {
    min: 0,
    dif: max
  };
  return {
    min: 0,
    dif: 0
  };
};

const leverage$1 = ([x, y, z], delta) => [x / delta, y / delta, z / delta];

const minus$1 = ([x_, y_, z_], [_x, _y, _z]) => [x_ - _x, y_ - _y, z_ - _z];

const scale$1 = (x, lo, lev, min$1, hi) => comparer.min((comparer.max(x, lo) - lo) * lev + min$1, hi);
/**
 * @typedef {[number,number,number]} Triple
 * @typedef {function(string):string} dye
 * @typedef {{max:string,min:string,na:string,effects?:string[]}} PresetHEX
 * @typedef {{max:Triple,min:Triple,na:Triple,effects?:string[]}} PresetHSL
 * @typedef {{min:Triple,dif:Triple}} LeapHSL
 * @typedef {{min:number,dif:number}} LeapNum
 */


class ProjectorConfig$1 {
  /** @type {function(Triple):dye} */
  fab;
  /** @type {number} */

  lo;
  /** @type {Triple} */

  lev;
  /** @type {Triple} */

  min;
  /** @type {Triple} */

  nap;
  /**
   * @param {LeapNum} leapNum
   * @param {LeapHSL} leapHSL
   * @param {Triple} napHSL
   * @param {string[]} effects
   */

  constructor(leapNum, leapHSL, napHSL, effects) {
    // this.fab = DyeFactory.build(HSL, effects)
    this.fab = DyeFactory$1.prototype.make.bind(DyeFab$1.build(HSL$1, effects));
    this.lo = leapNum.min;
    this.lev = !leapNum.dif ? 0 : leverage$1(leapHSL.dif, leapNum.dif);
    this.min = leapHSL.min;
    this.nap = napHSL;
  }
  /**
   * @param {Object} bound
   * @param {PresetHEX} preset
   * @returns {ProjectorConfig}
   */


  static fromHEX(bound, preset) {
    var _preset$max, _preset$min, _preset$na;

    const max = (_preset$max = preset.max, hexToHsl$3(_preset$max)),
          min = (_preset$min = preset.min, hexToHsl$3(_preset$min)),
          nap = (_preset$na = preset.na, hexToHsl$3(_preset$na)),
          effects = preset.effects;
    return new ProjectorConfig$1(parseBound$1(bound), {
      min,
      dif: minus$1(max, min)
    }, nap, effects);
  }
  /**
   * @param {Object} bound
   * @param {PresetHSL} preset
   * @returns {ProjectorConfig}
   */


  static fromHSL(bound, preset) {
    const {
      max,
      min,
      na: nap,
      effects
    } = preset;
    return new ProjectorConfig$1(parseBound$1(bound), {
      min,
      dif: minus$1(max, min)
    }, nap, effects);
  }

  project(value) {
    const {
      lo,
      lev,
      min
    } = this;
    return [scale$1(value, lo, lev[0], min[0], 360), scale$1(value, lo, lev[1], min[1], 100), scale$1(value, lo, lev[2], min[2], 100)];
  }

  get dyeNAp() {
    return this.fab(this.nap);
  }

}

/**
 * @typedef {[number,number,number]} Triple
 * @typedef {function(string):string} dye
 */

class ProjectorFactory {
  /** @type {function(Triple):dye} */
  fab;
  /** @type {number} */

  lo;
  /** @type {Triple} */

  lev;
  /** @type {Triple} */

  min;
  /** @type {Triple} */

  nap;
  /**
   * @param {Object} config
   * @param {function(Triple):dye} config.fab
   * @param {number}  config.lo
   * @param {Triple}  config.lev
   * @param {Triple}  config.min
   * @param {Triple}  config.nap
   */

  constructor(config) {
    Object.assign(this, config);
  }

  static fromHEX(bound, preset) {
    if (!bound || !preset) {
      return new VoidProjectorFactory();
    }

    const config = ProjectorConfig$1.fromHEX(bound, preset);
    if (!config.lev) return new SoleProjectorFactory(config);
    return new ProjectorFactory(config);
  }

  static fromHSL(bound, preset) {
    if (!bound || !preset) {
      return new VoidProjectorFactory();
    }

    const config = ProjectorConfig$1.fromHSL(bound, preset);
    if (!config.lev) return new SoleProjectorFactory(config);
    return new ProjectorFactory(config);
  }

  render(value, text) {
    return this.fab(this.color(value))(text);
  }

  make(value) {
    return this.fab(this.color(value));
  }

  color(value) {
    if (isNaN(value)) return this.nap;
    const {
      lo,
      lev,
      min
    } = this;
    return [scale$1(value, lo, lev[0], min[0], 360), scale$1(value, lo, lev[1], min[1], 100), scale$1(value, lo, lev[2], min[2], 100)];
  }

}

class SoleProjectorFactory {
  /** @type {function(*):dye} */
  fab;
  /** @type {Triple} */

  min;
  /** @type {Triple} */

  nap;

  constructor(config) {
    Object.assign(this, config);
  }

  render(value, text) {
    return this.fab(this.color(value))(text);
  }

  make(value) {
    return this.fab(this.color(value));
  }

  color(value) {
    return isNaN(value) ? this.nap : this.min;
  }

}

class VoidProjectorFactory {
  constructor(config) {
    Object.assign(this, config);
  }

  render(value, text) {
    return text;
  }

  make(value) {
    return oneself;
  }

  color(value) {
    return null;
  }

} // if (!preset) { return new VoidProjectorFactory() } else { preset = presetToLeap(preset) }

/**
 *
 * @typedef {Object} Preset
 * @typedef {string} Preset.min
 * @typedef {string} Preset.max
 * @typedef {string} Preset.na
 * @typedef {string[]} Preset.effects
 * @typedef {Function} Preset.filter
 * @typedef {Function} Preset.mapper
 *
 * @param {*[][]} mx
 * @param {Preset[]} [config]
 * @returns {*[][]}
 */

function fluoByColumns(mx, config) {
  var _columnsMapper;

  const context = this;
  return _columnsMapper = columnsMapper(mx, col => fluoVector.call(context, col, config)), transpose(_columnsMapper);
}
/**
 *
 * @typedef {Object} Preset
 * @typedef {string} Preset.min
 * @typedef {string} Preset.max
 * @typedef {string} Preset.na
 * @typedef {string[]} Preset.effects
 * @typedef {Function} Preset.filter
 * @typedef {Function} Preset.mapper
 *
 * @param {*[][]} mx
 * @param {Preset[]} [config]
 * @returns {*[][]}
 */


function fluoByRows(mx, config) {
  const context = this,
        mapper$1 = context !== null && context !== void 0 && context.mutate ? Mapper.mutate : Mapper.mapper;
  return mapper$1(mx, row => fluoVector.call(context, row, config));
}
/**
 * @typedef {Object} Preset
 * @typedef {string} Preset.min
 * @typedef {string} Preset.max
 * @typedef {string} Preset.na
 * @typedef {string[]} Preset.effects
 * @typedef {Function} Preset.filter
 * @typedef {Function} Preset.mapper
 *
 * @param {*[][]} matrix
 * @param {Preset[]} configs
 * @returns {*[][]}
 */


const fluoByPoints = function (matrix, configs) {
  const [h, w] = size(matrix);
  if (!h || !w) return [[]];
  const projectorSet = makeProjector(matrix, configs);
  const mapper = this !== null && this !== void 0 && this.mutate ? mutate : mapper$1;

  switch (this === null || this === void 0 ? void 0 : this.colorant) {
    case COLOR:
      return mapper(matrix, PointColorFactory.color(projectorSet));

    case MAKER:
      return mapper(matrix, PointColorFactory.maker(projectorSet));

    case RENDER:
    default:
      return mapper(matrix, PointColorFactory.render(projectorSet));
  }
};

const makeProjector = (matrix, configs = []) => {
  const [confX, confY] = configs;
  const [matX, matY] = boundaries(matrix, configs);
  const [projX, projY] = [ProjectorFactory.fromHEX(matX, confX), ProjectorFactory.fromHEX(matY, confY)];
  return [[matX, projX], [matY, projY]];
};

class PointColorFactory {
  static color([[bX, pX], [bY, pY]]) {
    function toColor(some) {
      var _some;

      return some ? (_some = some, hslToHex$3(_some)) : null;
    }

    return (_, i, j) => {
      let v;

      if (!nullish$2(v = bX && bX[i][j])) {
        var _pX$color;

        return _pX$color = pX.color(v), toColor(_pX$color);
      }

      if (!nullish$2(v = bY && bY[i][j])) {
        var _pY$color;

        return _pY$color = pY.color(v), toColor(_pY$color);
      }

      return null;
    };
  }

  static maker([[bX, pX], [bY, pY]]) {
    return (_, i, j) => {
      var _ref;

      let v;

      if (!nullish$2(v = bX && bX[i][j])) {
        return pX.make(v);
      }

      if (!nullish$2(v = bY && bY[i][j])) {
        return pY.make(v);
      }

      return ((_ref = pX || pY) === null || _ref === void 0 ? void 0 : _ref.make(pX.nap)) ?? oneself;
    };
  }

  static render([[bX, pX], [bY, pY]]) {
    return (n, i, j) => {
      var _ref2;

      let v;

      if (!nullish$2(v = bX && bX[i][j])) {
        return pX.render(v, n);
      }

      if (!nullish$2(v = bY && bY[i][j])) {
        return pY.render(v, n);
      }

      return ((_ref2 = pX || pY) === null || _ref2 === void 0 ? void 0 : _ref2.render(pX.nap, n)) ?? n;
    };
  }

}
/**
 *
 * @typedef {Object} Preset
 * @typedef {string} Preset.min
 * @typedef {string} Preset.max
 * @typedef {string} Preset.na
 * @typedef {string[]} Preset.effects
 * @typedef {Function} Preset.filter
 * @typedef {Function} Preset.mapper
 *
 * @param {*[][]} mx
 * @param {number} [direct=POINTWISE]
 * @param {Preset[]} [configs]
 */


const fluoMatrix = function (mx, direct, configs) {
  switch (direct) {
    case enumMatrixDirections.ROWWISE:
      return fluoByRows.call(this, mx, configs);

    case enumMatrixDirections.COLUMNWISE:
      return fluoByColumns.call(this, mx, configs);

    case enumMatrixDirections.POINTWISE:
    default:
      return fluoByPoints.call(this, mx, configs);
  }
};

const wind = (keys, values) => Zipper.zipper(keys, values, (k, v) => [k, v]);

const unwind = (entries, h) => {
  h = h || (entries === null || entries === void 0 ? void 0 : entries.length);
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
 * @param {[*,*][]} entA
 * @param {[*,*][]} entB
 * @param {function} keyMap
 * @param {function} [valMap]
 * @param {number} [hi]
 * @returns {[*,*][]}
 */


const mutazip = (entA, entB, keyMap, valMap, hi) => {
  hi = hi ?? (entA === null || entA === void 0 ? void 0 : entA.length), valMap = valMap ?? keyMap;

  for (let i = 0, a, b; i < hi && (a = entA[i]) && (b = entB[i]); i++) {
    a[0] = keyMap(a[0], b[0], i);
    a[1] = valMap(a[1], b[1], i);
  }

  return entA;
};

/**
 * @typedef {Object} Preset
 * @typedef {string} Preset.min
 * @typedef {string} Preset.max
 * @typedef {string} Preset.na
 * @typedef {string[]} Preset.effects
 * @typedef {Function} Preset.filter
 * @typedef {Function} Preset.mapper
 *
 * @param {[*,*][]} entries
 * @param {Preset[]} configs
 * @returns {*[]}
 */

const fluoEntries = function (entries, configs) {
  const colorant = this === null || this === void 0 ? void 0 : this.colorant,
        mutate = this === null || this === void 0 ? void 0 : this.mutate;
  let [keys, items] = unwind(entries);
  const context = {
    colorant,
    mutate: true
  };
  fluoVector.call(context, keys, configs);
  fluoVector.call(context, items, configs);
  const rendered = wind(keys, items);
  return mutate ? mutazip(entries, rendered, (a, b) => b) : rendered;
};

const isNumericAny = x => isNumeric$3(x) || isNumeric$2(x);

const NUM_BOUND_CONF_FULL = {
  filter: isNumericAny,
  mapper: parseNum$2
};
const STR_BOUND_CONF_FULL = {
  filter: isLiteralAny,
  mapper: stringValue$1
};
const NUM_BOUND_CONF_HALF = {
  filter: isNumeric$2,
  mapper: parseNum$1
};
const STR_BOUND_CONF_HALF = {
  filter: isLiteral,
  mapper: stringValue$1
};

class PresetCollection extends Array {
  constructor(presets) {
    super(presets.length);
    mutazip$1(this, presets, (receiver, preset) => Object.assign({}, preset));
  }

  static build(...presets) {
    return new PresetCollection(presets);
  }

  assignPresets(...presets) {
    // if (this.length < presets.length) {this.length = presets.length}
    return mutazip$1(this, presets, (conf, preset) => Object.assign(conf ?? {}, preset), presets.length);
  }

  replenishPresets(...presets) {
    // if (this.length < presets.length) {this.length = presets.length}
    return mutazip$1(this, presets, (conf, preset) => replenish$1(conf ?? {}, preset), presets.length);
  }

  assignEffect(...effects) {
    if (effects.length === 0) return this;
    return mutate$1(this, conf => (conf.effects = effects, conf));
  }

  setBound(full) {
    const boundConfigs = full ? [NUM_BOUND_CONF_FULL, STR_BOUND_CONF_FULL, STR_BOUND_CONF_FULL] : [NUM_BOUND_CONF_HALF, STR_BOUND_CONF_HALF, STR_BOUND_CONF_HALF];
    return mutazip$1(this, boundConfigs, (conf, boundConf) => Object.assign(conf, boundConf));
  }

} // if (presets.length === 0) presets = [NUMERIC_PRESET, LITERAL_PRESET]

const nullish = x => x === null || x === void 0;

const replenish = (object, another) => {
  for (let k in another) if (nullish(object[k])) object[k] = another[k];

  return object;
};

class DecoConfig {
  /** @type {PresetCollection} */
  presets;
  /** @type {string[]} */

  effects;
  /** @type {boolean} */

  full;
  /** @param {Object} conf */

  constructor(conf) {
    if (!conf) {
      return;
    }

    Object.assign(this, conf);
    if (conf.presets) this.resetPresets(conf.presets, conf.effects, conf.full);
  } // /**
  //  * @param {Object} [conf]
  //  * @returns {DecoConfig}
  //  */


  static build(conf) {
    return new DecoConfig(conf);
  }

  static parse(userConfig, defaultConfig, defaultPresets) {
    const conf = DecoConfig.build(userConfig);
    if (defaultConfig) conf.replenishConfigs(defaultConfig);
    if (defaultPresets) conf.defaultPresets.apply(conf, defaultPresets);
    return conf;
  }

  assignConfigs(configs) {
    return Object.assign(this, configs);
  }

  replenishConfigs(configs) {
    return replenish(this, configs);
  }

  resetPresets(presets, effects, full) {
    this.presets = Array.isArray(presets) ? PresetCollection.build.apply(null, presets) : PresetCollection.build.call(null, presets, presets);
    if (effects !== null && effects !== void 0 && effects.length) Array.isArray(effects) ? this.assignEffect.apply(this, effects) : this.assignEffect.call(this, effects);
    if (!nullish$2(full)) this.setBound(full);
    return this;
  }

  assignPresets(...presets) {
    var _this$presets;

    return this.presets ? ((_this$presets = this.presets) !== null && _this$presets !== void 0 && _this$presets.assignPresets.apply(this.presets, presets), this) : this.resetPresets(presets);
  }

  assignEffect(...effects) {
    var _this$presets2;

    return (_this$presets2 = this.presets) !== null && _this$presets2 !== void 0 && _this$presets2.assignEffect.apply(this.presets, effects), this;
  }

  setBound(full) {
    var _this$presets3;

    return (_this$presets3 = this.presets) !== null && _this$presets3 !== void 0 && _this$presets3.setBound.call(this.presets, full), this;
  }

  defaultPresets(...presets) {
    if (nullish$2(this.presets)) this.resetPresets(presets, this.effects, this.full);
    return this;
  } // defaultEffects(...effects) {
  //   if (effects?.length && !nullish(this.presets)) iterate(this.presets, preset => { if (!preset?.effect) preset.effects = effects })
  //   return this
  // }
  // defaultBound(full) {
  //   if (!nullish(full) && !nullish(this.presets)) this.setBound(full)
  //   return this
  // }


}

const SP = ' ';
const CO = ',';
const LF = '\n';
const COSP = CO + SP;

const NUMERIC_PRESET = FRESH;
const LITERAL_PRESET = PLANET$1;
const DUAL_PRESET_COLLECTION = [NUMERIC_PRESET, LITERAL_PRESET];

const parenth$2 = x => '(' + x + ')';

const bracket$2 = x => '[' + x + ']';

/**
 * @typedef {string|number|number[]} chroma
 */

/**
 *
 * @this {DyeFab}
 * @param {chroma} color
 * @returns {function(string):string}
 */

function Dye(color) {
  var _this$slice;

  const local = (this === null || this === void 0 ? void 0 : (_this$slice = this.slice) === null || _this$slice === void 0 ? void 0 : _this$slice.call(this)) ?? DyeFab$1.shallow();
  if (color) (local.encolor ?? pushRgb$1).call(local, color);
  return DyeFab$1.prototype.render.bind(local);
}
/**
 *
 * @this {DyeFab}
 * @param {function(chroma):string} encolor
 * @param {chroma} color
 * @returns {function(string):string}
 */


Dye.make = function (encolor, color) {
  var _this$slice2;

  const local = (this === null || this === void 0 ? void 0 : (_this$slice2 = this.slice) === null || _this$slice2 === void 0 ? void 0 : _this$slice2.call(this)) ?? DyeFab$1.shallow();
  if (color) (encolor ?? local.encolor).call(local, color);
  return DyeFab$1.prototype.render.bind(local);
};

Dye.rgb = function (rgb) {
  return Dye.make.call(this, pushRgb$1, rgb);
};

Dye.hex = function (hex) {
  return Dye.make.call(this, pushHex$1, hex);
};

Dye.hsl = function (hsl) {
  return Dye.make.call(this, pushHsl$1, hsl);
};

Dye.int = function (int) {
  return Dye.make.call(this, pushInt$1, int);
};

function mapper(o, fn) {
  const ob = {};

  for (let k in o) ob[k] = fn.call(this, o[k]);

  return ob;
}

const Dyes$1 = {
  0: Dye.hsl([45, 100, 53]),
  1: Dye.hsl([44, 100, 59]),
  2: Dye.hsl([43, 100, 64]),
  3: Dye.hsl([42, 100, 70]),
  4: Dye.hsl([41, 100, 74]),
  5: Dye.hsl([40, 100, 78]),
  6: Dye.hsl([39, 100, 82]),
  7: Dye.hsl([37, 100, 86])
};
const L$1 = '{ ',
      R$1 = ' }';
mapper(Dyes$1, dye => {
  var _L, _R;

  const l = (_L = L$1, dye(_L)),
        r = (_R = R$1, dye(_R));
  return content => l + content + r;
});
const Dyes = {
  0: Dye.hsl([199, 100, 63]),
  1: Dye.hsl([201, 100, 68]),
  2: Dye.hsl([203, 100, 72]),
  3: Dye.hsl([205, 100, 76]),
  4: Dye.hsl([207, 100, 84]),
  5: Dye.hsl([209, 100, 80]),
  6: Dye.hsl([211, 100, 88]),
  7: Dye.hsl([214, 100, 90])
};
const L = '[ ',
      R = ' ]';
mapper(Dyes, dye => {
  var _L, _R;

  const l = (_L = L, dye(_L)),
        r = (_R = R, dye(_R));
  return content => l + content + r;
});
/**
 *
 * @type {Object<string,Function>}
 */

({
  IDX: Dye.hex(Cards$2.brown.lighten_5),
  STR: Dye.hex(Cards$2.lightGreen.accent_2),
  NUM: Dye.hex(Cards$2.deepOrange.accent_2),
  BOO: Dye.hex(Cards$2.teal.lighten_2),
  UDF: Dye.hex(Cards$2.brown.lighten_3),
  SYM: Dye.hex(Cards$2.blueGrey.lighten_2),
  BRK: Dye.hex(Cards$2.blue.accent_2),
  BRC: Dye.hex(Cards$2.amber.base),
  FNC: Dye.hex(Cards$2.green.accent_4)
});
({
  0: {
    max: hslToHex$3([75, 90, 85]),
    min: hslToHex$3([89, 99, 72]),
    na: Cards$2.grey.lighten_4
  },
  1: {
    max: hslToHex$3([80, 88, 87]),
    min: hslToHex$3([83, 98, 71]),
    na: Cards$2.grey.lighten_4
  },
  2: {
    max: hslToHex$3([93, 87, 82]),
    min: hslToHex$3([93, 97, 70]),
    na: Cards$2.grey.lighten_3
  },
  3: {
    max: hslToHex$3([103, 86, 82]),
    min: hslToHex$3([103, 96, 69]),
    na: Cards$2.grey.lighten_2
  },
  4: {
    max: hslToHex$3([113, 85, 82]),
    min: hslToHex$3([113, 95, 68]),
    na: Cards$2.grey.lighten_1
  },
  5: {
    max: hslToHex$3([123, 84, 82]),
    min: hslToHex$3([123, 94, 68]),
    na: Cards$2.grey.base
  },
  6: {
    max: hslToHex$3([133, 83, 82]),
    min: hslToHex$3([133, 93, 68]),
    na: Cards$2.grey.darken_1
  },
  7: {
    max: hslToHex$3([143, 82, 82]),
    min: hslToHex$3([143, 92, 68]),
    na: Cards$2.grey.darken_2
  }
});

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

const {
  random: random$1,
  abs: abs$1,
  exp: exp$1,
  log: log$1,
  sqrt: sqrt$1,
  pow: pow$1,
  cos: cos$1,
  sin: sin$1,
  PI: PI$1
} = Math;
const R0$1 = 3.442619855899;
exp$1(-0.5 * R0$1 * R0$1);
-pow$1(2, 32);

/**
 *
 * applicable for smaller number
 * @param {number} x
 * @returns {number}
 */

const round$2 = x => x + (x > 0 ? 0.5 : -0.5) << 0;

const rgbToInt$2 = ([r, g, b]) => ((r & 0xFF) << 16) + ((g & 0xFF) << 8) + (b & 0xFF);

function hexAt$2(tx, i) {
  let n = tx.charCodeAt(i);
  return n >> 5 <= 1 ? n & 0xf : (n & 0x7) + 9;
}

const prolif$2 = n => n << 4 | n;

function dil6$2(hex) {
  const hi = hex == null ? void 0 : hex.length;
  if (hi >= 6) return hex;
  if (hi === 5) return '0' + hex;
  if (hi === 4) return '00' + hex;
  if (hi === 3) return '000' + hex;
  if (hi === 2) return '0000' + hex;
  if (hi === 1) return '00000' + hex;
  if (hi <= 0) return '000000';
}
/**
 * @param {[number,number,number]} rgb
 * @returns {string}
 */


const rgbToHex$2 = rgb => '#' + dil6$2(rgbToInt$2(rgb).toString(16));

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

const hue$2 = (r, g, b, max, dif) => {
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

const THOUSAND$1$2 = 1000;
/**
 * !dif: dif===0
 * @param {number} r - [0,255]
 * @param {number} g - [0,255]
 * @param {number} b - [0,255]
 * @returns {[number,number,number]} [Hue([0,360]), Saturation([0,100]), Lightness([0,100])]
 */

function rgbToHsl$2([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;
  const {
    max,
    sum,
    dif
  } = bound$2([r, g, b]);
  let h = hue$2(r, g, b, max, dif) * 60,
      s = !dif ? 0 : sum > 1 ? dif / (2 - sum) : dif / sum,
      l = sum / 2;
  return [round$2(h), round$2(s * THOUSAND$1$2) / 10, round$2(l * THOUSAND$1$2) / 10];
}
/**
 * @param {string} hex
 * @returns {number}
 */


function hexToInt$2(hex) {
  let lo = 0,
      hi = hex == null ? void 0 : hex.length;
  if (hi === 7) lo++, hi--;

  if (hi === 6) {
    const r = hexAt$2(hex, lo++) << 4 | hexAt$2(hex, lo++);
    const g = hexAt$2(hex, lo++) << 4 | hexAt$2(hex, lo++);
    const b = hexAt$2(hex, lo++) << 4 | hexAt$2(hex, lo++);
    return r << 16 | g << 8 | b;
  }

  if (hi === 4) lo++, hi--;

  if (hi === 3) {
    return prolif$2(hexAt$2(hex, lo++)) << 16 | prolif$2(hexAt$2(hex, lo++)) << 8 | prolif$2(hexAt$2(hex, lo++));
  }

  return 0;
}
/**
 *
 * @param {string} hex
 * @returns {number[]}
 */


function hexToRgb$2(hex) {
  const int = hexToInt$2(hex);
  return [int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF];
}

const THOUSAND$3 = 1000;
/**
 * !dif: dif===0
 * @param {number} int
 * @returns {[number,number,number]} [Hue([0,360]), Saturation([0,100]), Lightness([0,100])]
 */

function intToHsl$2(int) {
  let r = int >> 16 & 0xFF,
      g = int >> 8 & 0xFF,
      b = int & 0xFF;
  r /= 255;
  g /= 255;
  b /= 255;
  const {
    max,
    sum,
    dif
  } = bound$2([r, g, b]);
  let h = hue$2(r, g, b, max, dif) * 60,
      s = !dif ? 0 : sum > 1 ? dif / (2 - sum) : dif / sum,
      l = sum / 2;
  return [round$2(h), round$2(s * THOUSAND$3) / 10, round$2(l * THOUSAND$3) / 10];
}

const hexToHsl$2 = hex => {
  var _ref, _hex;

  return _ref = (_hex = hex, hexToInt$2(_hex)), intToHsl$2(_ref);
};
/**
 *
 * @param {number} n
 * @param {number} h
 * @param {number} a
 * @param {number} l
 * @returns {number}
 */


const hf$2 = (n, h, a, l) => {
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


function hslToRgb$2([h, s, l]) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l),
        r = hf$2(0, h, a, l),
        g = hf$2(8, h, a, l),
        b = hf$2(4, h, a, l);
  return [round$2(r * 0xFF), round$2(g * 0xFF), round$2(b * 0xFF)]; // return [r * 0xFF & 0xFF, g * 0xFF & 0xFF, b * 0xFF & 0xFF]
}

const hslToHex$2 = hsl => {
  var _ref, _hsl;

  return _ref = (_hsl = hsl, hslToRgb$2(_hsl)), rgbToHex$2(_ref);
};
/**
 *
 * @param {number} h
 * @param {number} s
 * @param {number} l
 * @returns {number}
 */


function hslToInt$2([h, s, l]) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l),
        r = hf$2(0, h, a, l),
        g = hf$2(8, h, a, l),
        b = hf$2(4, h, a, l);
  return ((round$2(r * 0xFF) & 0xFF) << 16) + ((round$2(g * 0xFF) & 0xFF) << 8) + (round$2(b * 0xFF) & 0xFF);
}

const intToRgb$2 = n => [n >> 16 & 0xFF, n >> 8 & 0xFF, n & 0xFF];

const intToHex$2 = int => '#' + dil6$2(int.toString(16));

var _class$2, _temp$2, _class2$2, _temp2$2, _class3$2, _temp3$2, _class4$2, _temp4$2;

(_temp$2 = _class$2 = class Rgb {}, _class$2.rgb = oneself, _class$2.hex = rgbToHex$2, _class$2.hsl = rgbToHsl$2, _class$2.int = rgbToInt$2, _temp$2);
(_temp2$2 = _class2$2 = class Rgb {}, _class2$2.rgb = hexToRgb$2, _class2$2.hex = oneself, _class2$2.hsl = hexToHsl$2, _class2$2.int = hexToInt$2, _temp2$2);
(_temp3$2 = _class3$2 = class Rgb {}, _class3$2.rgb = hslToRgb$2, _class3$2.hex = hslToHex$2, _class3$2.hsl = oneself, _class3$2.int = hslToInt$2, _temp3$2);
(_temp4$2 = _class4$2 = class Rgb {}, _class4$2.rgb = intToRgb$2, _class4$2.hex = intToHex$2, _class4$2.hsl = intToHsl$2, _class4$2.int = oneself, _temp4$2);

({
  max: Cards$1.cyan.accent_2,
  min: Cards$1.green.darken_1,
  na: Cards$1.grey.lighten_4
});
({
  max: Cards$1.cyan.lighten_3,
  min: Cards$1.orange.lighten_2,
  na: Cards$1.pink.lighten_4
});
({
  max: Cards$1.green.accent_3,
  min: Cards$1.deepPurple.accent_1,
  na: Cards$1.teal.accent_1
});
({
  max: Cards$1.cyan.accent_1,
  min: Cards$1.lightBlue.accent_4,
  na: Cards$1.deepOrange.accent_1
});
({
  max: Cards$1.lightGreen.accent_3,
  min: Cards$1.deepOrange.accent_3,
  na: Cards$1.blue.lighten_3
});
({
  max: Cards$1.orange.accent_2,
  min: Cards$1.purple.accent_1,
  na: Cards$1.grey.lighten_2
});
({
  max: Cards$1.lime.accent_3,
  min: Cards$1.lightGreen.accent_3,
  na: Cards$1.blueGrey.accent_1
});
({
  max: Cards$1.amber.accent_3,
  min: Cards$1.red.lighten_1,
  na: Cards$1.grey.accent_2
});
const METRO = {
  max: Cards$1.pink.lighten_2,
  min: Cards$1.blue.lighten_4,
  na: Cards$1.teal.accent_3
};
({
  max: Cards$1.lightGreen.accent_3,
  min: Cards$1.teal.lighten_3,
  na: Cards$1.brown.accent_1
});
({
  max: Cards$1.lightBlue.accent_2,
  min: Cards$1.indigo.base,
  na: Cards$1.pink.lighten_3
});
({
  max: Cards$1.teal.accent_2,
  min: Cards$1.blue.darken_3,
  na: Cards$1.cyan.lighten_4
});
({
  max: Cards$1.red.lighten_2,
  min: Cards$1.yellow.darken_1,
  na: Cards$1.green.lighten_2
});
const SUBTLE = {
  max: Cards$1.grey.lighten_5,
  min: Cards$1.grey.darken_1,
  na: Cards$1.indigo.lighten_3
};
({
  max: Cards$1.pink.lighten_4,
  min: Cards$1.deepPurple.accent_2,
  na: Cards$1.amber.darken_2
});

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

const {
  random,
  abs,
  exp,
  log,
  sqrt,
  pow,
  cos,
  sin,
  PI
} = Math;
const R0 = 3.442619855899;
exp(-0.5 * R0 * R0);
-pow(2, 32);

/**
 *
 * applicable for smaller number
 * @param {number} x
 * @returns {number}
 */

const round$1 = x => x + (x > 0 ? 0.5 : -0.5) << 0;

const rgbToInt$1 = ([r, g, b]) => ((r & 0xFF) << 16) + ((g & 0xFF) << 8) + (b & 0xFF);

function hexAt$1(tx, i) {
  let n = tx.charCodeAt(i);
  return n >> 5 <= 1 ? n & 0xf : (n & 0x7) + 9;
}

const prolif$1 = n => n << 4 | n;

function dil6$1(hex) {
  const hi = hex == null ? void 0 : hex.length;
  if (hi >= 6) return hex;
  if (hi === 5) return '0' + hex;
  if (hi === 4) return '00' + hex;
  if (hi === 3) return '000' + hex;
  if (hi === 2) return '0000' + hex;
  if (hi === 1) return '00000' + hex;
  if (hi <= 0) return '000000';
}
/**
 * @param {[number,number,number]} rgb
 * @returns {string}
 */


const rgbToHex$1 = rgb => '#' + dil6$1(rgbToInt$1(rgb).toString(16));

const bound$1 = ([r, g, b]) => {
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

const THOUSAND$1$1 = 1000;
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
  } = bound$1([r, g, b]);
  let h = hue$1(r, g, b, max, dif) * 60,
      s = !dif ? 0 : sum > 1 ? dif / (2 - sum) : dif / sum,
      l = sum / 2;
  return [round$1(h), round$1(s * THOUSAND$1$1) / 10, round$1(l * THOUSAND$1$1) / 10];
}
/**
 * @param {string} hex
 * @returns {number}
 */


function hexToInt$1(hex) {
  let lo = 0,
      hi = hex == null ? void 0 : hex.length;
  if (hi === 7) lo++, hi--;

  if (hi === 6) {
    const r = hexAt$1(hex, lo++) << 4 | hexAt$1(hex, lo++);
    const g = hexAt$1(hex, lo++) << 4 | hexAt$1(hex, lo++);
    const b = hexAt$1(hex, lo++) << 4 | hexAt$1(hex, lo++);
    return r << 16 | g << 8 | b;
  }

  if (hi === 4) lo++, hi--;

  if (hi === 3) {
    return prolif$1(hexAt$1(hex, lo++)) << 16 | prolif$1(hexAt$1(hex, lo++)) << 8 | prolif$1(hexAt$1(hex, lo++));
  }

  return 0;
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

const THOUSAND$2 = 1000;
/**
 * !dif: dif===0
 * @param {number} int
 * @returns {[number,number,number]} [Hue([0,360]), Saturation([0,100]), Lightness([0,100])]
 */

function intToHsl$1(int) {
  let r = int >> 16 & 0xFF,
      g = int >> 8 & 0xFF,
      b = int & 0xFF;
  r /= 255;
  g /= 255;
  b /= 255;
  const {
    max,
    sum,
    dif
  } = bound$1([r, g, b]);
  let h = hue$1(r, g, b, max, dif) * 60,
      s = !dif ? 0 : sum > 1 ? dif / (2 - sum) : dif / sum,
      l = sum / 2;
  return [round$1(h), round$1(s * THOUSAND$2) / 10, round$1(l * THOUSAND$2) / 10];
}

const hexToHsl$1 = hex => {
  var _ref, _hex;

  return _ref = (_hex = hex, hexToInt$1(_hex)), intToHsl$1(_ref);
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
  return [round$1(r * 0xFF), round$1(g * 0xFF), round$1(b * 0xFF)]; // return [r * 0xFF & 0xFF, g * 0xFF & 0xFF, b * 0xFF & 0xFF]
}

const hslToHex$1 = hsl => {
  var _ref, _hsl;

  return _ref = (_hsl = hsl, hslToRgb$1(_hsl)), rgbToHex$1(_ref);
};
/**
 *
 * @param {number} h
 * @param {number} s
 * @param {number} l
 * @returns {number}
 */


function hslToInt$1([h, s, l]) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l),
        r = hf$1(0, h, a, l),
        g = hf$1(8, h, a, l),
        b = hf$1(4, h, a, l);
  return ((round$1(r * 0xFF) & 0xFF) << 16) + ((round$1(g * 0xFF) & 0xFF) << 8) + (round$1(b * 0xFF) & 0xFF);
}

const intToRgb$1 = n => [n >> 16 & 0xFF, n >> 8 & 0xFF, n & 0xFF];

const intToHex$1 = int => '#' + dil6$1(int.toString(16));

var _class$1, _temp$1, _class2$1, _temp2$1, _class3$1, _temp3$1, _class4$1, _temp4$1;

(_temp$1 = _class$1 = class Rgb {}, _class$1.rgb = oneself, _class$1.hex = rgbToHex$1, _class$1.hsl = rgbToHsl$1, _class$1.int = rgbToInt$1, _temp$1);
(_temp2$1 = _class2$1 = class Rgb {}, _class2$1.rgb = hexToRgb$1, _class2$1.hex = oneself, _class2$1.hsl = hexToHsl$1, _class2$1.int = hexToInt$1, _temp2$1);
(_temp3$1 = _class3$1 = class Rgb {}, _class3$1.rgb = hslToRgb$1, _class3$1.hex = hslToHex$1, _class3$1.hsl = oneself, _class3$1.int = hslToInt$1, _temp3$1);
(_temp4$1 = _class4$1 = class Rgb {}, _class4$1.rgb = intToRgb$1, _class4$1.hex = intToHex$1, _class4$1.hsl = intToHsl$1, _class4$1.int = oneself, _temp4$1);

({
  max: Cards.cyan.accent_2,
  min: Cards.green.darken_1,
  na: Cards.grey.lighten_4
});
({
  max: Cards.cyan.lighten_3,
  min: Cards.orange.lighten_2,
  na: Cards.pink.lighten_4
});
({
  max: Cards.green.accent_3,
  min: Cards.deepPurple.accent_1,
  na: Cards.teal.accent_1
});
({
  max: Cards.cyan.accent_1,
  min: Cards.lightBlue.accent_4,
  na: Cards.deepOrange.accent_1
});
({
  max: Cards.lightGreen.accent_3,
  min: Cards.deepOrange.accent_3,
  na: Cards.blue.lighten_3
});
({
  max: Cards.orange.accent_2,
  min: Cards.purple.accent_1,
  na: Cards.grey.lighten_2
});
({
  max: Cards.lime.accent_3,
  min: Cards.lightGreen.accent_3,
  na: Cards.blueGrey.accent_1
});
({
  max: Cards.amber.accent_3,
  min: Cards.red.lighten_1,
  na: Cards.grey.accent_2
});
({
  max: Cards.pink.lighten_2,
  min: Cards.blue.lighten_4,
  na: Cards.teal.accent_3
});
({
  max: Cards.lightGreen.accent_3,
  min: Cards.teal.lighten_3,
  na: Cards.brown.accent_1
});
({
  max: Cards.lightBlue.accent_2,
  min: Cards.indigo.base,
  na: Cards.pink.lighten_3
});
const PLANET = {
  max: Cards.teal.accent_2,
  min: Cards.blue.darken_3,
  na: Cards.cyan.lighten_4
};
({
  max: Cards.red.lighten_2,
  min: Cards.yellow.darken_1,
  na: Cards.green.lighten_2
});
({
  max: Cards.grey.lighten_5,
  min: Cards.grey.darken_1,
  na: Cards.indigo.lighten_3
});
({
  max: Cards.pink.lighten_4,
  min: Cards.deepPurple.accent_2,
  na: Cards.amber.darken_2
});

/**
 *
 * applicable for smaller number
 * @param {number} x
 * @returns {number}
 */

const round = x => x + (x > 0 ? 0.5 : -0.5) << 0;

const rgbToInt = ([r, g, b]) => ((r & 0xFF) << 16) + ((g & 0xFF) << 8) + (b & 0xFF);

function hexAt(tx, i) {
  let n = tx.charCodeAt(i);
  return n >> 5 <= 1 ? n & 0xf : (n & 0x7) + 9;
}

const prolif = n => n << 4 | n;

function dil6(hex) {
  const hi = hex == null ? void 0 : hex.length;
  if (hi >= 6) return hex;
  if (hi === 5) return '0' + hex;
  if (hi === 4) return '00' + hex;
  if (hi === 3) return '000' + hex;
  if (hi === 2) return '0000' + hex;
  if (hi === 1) return '00000' + hex;
  if (hi <= 0) return '000000';
}
/**
 * @param {[number,number,number]} rgb
 * @returns {string}
 */


const rgbToHex = rgb => '#' + dil6(rgbToInt(rgb).toString(16));

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

const THOUSAND$1 = 1000;
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
  return [round(h), round(s * THOUSAND$1) / 10, round(l * THOUSAND$1) / 10];
}
/**
 * @param {string} hex
 * @returns {number}
 */


function hexToInt(hex) {
  let lo = 0,
      hi = hex == null ? void 0 : hex.length;
  if (hi === 7) lo++, hi--;

  if (hi === 6) {
    const r = hexAt(hex, lo++) << 4 | hexAt(hex, lo++);
    const g = hexAt(hex, lo++) << 4 | hexAt(hex, lo++);
    const b = hexAt(hex, lo++) << 4 | hexAt(hex, lo++);
    return r << 16 | g << 8 | b;
  }

  if (hi === 4) lo++, hi--;

  if (hi === 3) {
    return prolif(hexAt(hex, lo++)) << 16 | prolif(hexAt(hex, lo++)) << 8 | prolif(hexAt(hex, lo++));
  }

  return 0;
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

const THOUSAND = 1000;
/**
 * !dif: dif===0
 * @param {number} int
 * @returns {[number,number,number]} [Hue([0,360]), Saturation([0,100]), Lightness([0,100])]
 */

function intToHsl(int) {
  let r = int >> 16 & 0xFF,
      g = int >> 8 & 0xFF,
      b = int & 0xFF;
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
  return [round(h), round(s * THOUSAND) / 10, round(l * THOUSAND) / 10];
}

const hexToHsl = hex => {
  var _ref, _hex;

  return _ref = (_hex = hex, hexToInt(_hex)), intToHsl(_ref);
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
/**
 *
 * @param {number} h
 * @param {number} s
 * @param {number} l
 * @returns {number}
 */


function hslToInt([h, s, l]) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l),
        r = hf(0, h, a, l),
        g = hf(8, h, a, l),
        b = hf(4, h, a, l);
  return ((round(r * 0xFF) & 0xFF) << 16) + ((round(g * 0xFF) & 0xFF) << 8) + (round(b * 0xFF) & 0xFF);
}

const intToRgb = n => [n >> 16 & 0xFF, n >> 8 & 0xFF, n & 0xFF];

const intToHex = int => '#' + dil6(int.toString(16));

var _class, _temp, _class2, _temp2, _class3, _temp3, _class4, _temp4;

(_temp = _class = class Rgb {}, _class.rgb = oneself, _class.hex = rgbToHex, _class.hsl = rgbToHsl, _class.int = rgbToInt, _temp);
(_temp2 = _class2 = class Rgb {}, _class2.rgb = hexToRgb, _class2.hex = oneself, _class2.hsl = hexToHsl, _class2.int = hexToInt, _temp2);
(_temp3 = _class3 = class Rgb {}, _class3.rgb = hslToRgb, _class3.hex = hslToHex, _class3.hsl = oneself, _class3.int = hslToInt, _temp3);
(_temp4 = _class4 = class Rgb {}, _class4.rgb = intToRgb, _class4.hex = intToHex, _class4.hsl = intToHsl, _class4.int = oneself, _temp4);

const RGB = 'rgb',
      HSL = 'hsl',
      HEX = 'hex',
      INT = 'int';

const CSI = '[';
const SGR = 'm';
// // // // // // // // // // //

const BOL_ON = '1'; // BOLD / INCREASE_INTENSITY

const DIM_ON = '2'; // DIM / DECREASE_INTENSITY / FAINT

const ITA_ON = '3'; // ITALIC

const UND_ON = '4'; // UNDERLINE

const BLI_ON = '5'; // BLINK

const INV_ON = '7'; // INVERSE

const HID_ON = '8'; // HIDE / CONCEAL

const CRO_ON = '9'; // CROSSED_OUT / STRIKE
// // // // // // // // // // //

const BOL_OFF = '21'; // NOT_BOLD / DOUBLE_UNDERLINE

const DIM_OFF = '22'; // NOT_DIM / NORMAL_INTENSITY

const ITA_OFF = '23'; // NOT_ITALIC

const UND_OFF = '24'; // NOT_UNDERLINE

const BLI_OFF = '25'; // NOT_BLINK

const INV_OFF = '27'; // NOT_INVERSE

const HID_OFF = '28'; // NOT_HIDE / REVEAL

const CRO_OFF = '29'; // NOT_CROSSED_OUT / UNSTRIKE

const FORE_INI = '38;2'; // SET_FORECOLOR (24 bit (true-color))

const FORE_DEF = '39'; // DEFAULT_FORECOLOR

const SC = ';';

function excite() {
  if (this.head.length) this.head += ';';
  if (this.tail.length) this.tail += ';';
  return this;
}
/** @param {number} int */


function pushInt(int) {
  excite.call(this);
  this.head += FORE_INI + SC + (int >> 16 & 0xFF) + SC + (int >> 8 & 0xFF) + SC + (int & 0xFF);
  this.tail += FORE_DEF;
  return this;
}
/** @param {number[]} rgb */


function pushRgb(rgb) {
  excite.call(this);
  this.head += FORE_INI + SC + rgb[0] + SC + rgb[1] + SC + rgb[2];
  this.tail += FORE_DEF;
  return this;
}
/** @param {string} hex */


function pushHex(hex) {
  var _hex;

  return pushInt.call(this, (_hex = hex, hexToInt(_hex)));
}
/** @param {number[]} hsl */


function pushHsl(hsl) {
  var _hsl;

  return pushRgb.call(this, (_hsl = hsl, hslToRgb(_hsl)));
}

const selectEncolor = space => space === RGB ? pushRgb : space === HEX ? pushHex : space === HSL ? pushHsl : space === INT ? pushInt : pushRgb;
/** @param {string[]} style */


function enstyle(style) {
  if (!(style != null && style.length)) return this;
  excite.call(this);

  for (let t of style) t[0] === 'b' ? (this.head += BOL_ON, this.tail += BOL_OFF // BOLD
  ) : t[0] === 'd' ? (this.head += DIM_ON, this.tail += DIM_OFF // DIM
  ) : t[0] === 'i' && t[1] === 't' ? (this.head += ITA_ON, this.tail += ITA_OFF // ITALIC
  ) : t[0] === 'u' ? (this.head += UND_ON, this.tail += UND_OFF // UNDERLINE
  ) : t[0] === 'b' ? (this.head += BLI_ON, this.tail += BLI_OFF // BLINK
  ) : t[0] === 'i' ? (this.head += INV_ON, this.tail += INV_OFF // INVERSE
  ) : t[0] === 'h' ? (this.head += HID_ON, this.tail += HID_OFF // HIDE
  ) : t[0] === 's' ? (this.head += CRO_ON, this.tail += CRO_OFF // STRIKE
  ) : void 0;

  return this;
}

class DyeFab {
  constructor(space, style) {
    this.head = '';
    this.tail = '';
    if (space) this.setEncolor(space);
    if (style) this.enstyle(style);
  }

  static build(space, style) {
    return new DyeFab(space, style);
  }

  static prep(...effects) {
    return new DyeFab().enstyle(effects);
  }

  static shallow() {
    return {
      head: '',
      tail: ''
    };
  }

  reboot() {
    return this.head = '', this.tail = '', this;
  }

  slice() {
    return {
      head: this.head ?? '',
      tail: this.tail ?? ''
    };
  }

  copy() {
    return new DyeFab().assign(this);
  }
  /**
   * @param {string} head
   * @param {string} tail
   */


  inject(head, tail) {
    if (head) this.head = head;
    if (tail) this.tail = tail;
    return this;
  }

  assign(another) {
    const {
      head,
      tail
    } = another;
    if (head) this.head = head;
    if (tail) this.tail = tail;
    return this;
  }
  /** @param {string[]} styles */


  enstyle(styles) {
    return enstyle.call(this, styles);
  }

  setEncolor(space) {
    return this.encolor = selectEncolor(space), this;
  }

  render(text) {
    return CSI + this.head + SGR + text + CSI + this.tail + SGR;
  }

}

class DyeFactory extends DyeFab {
  constructor(space, style) {
    super(space, style);
  }

  static build(space, style) {
    return new DyeFactory(space, style);
  }

  static prep(space, ...style) {
    return DyeFactory.prototype.make.bind(DyeFab.build(space, style));
  }

  static hex(...style) {
    return DyeFactory.prototype.make.bind(DyeFab.build(HEX, style));
  }

  static rgb(...style) {
    return DyeFactory.prototype.make.bind(DyeFab.build(RGB, style));
  }

  static hsl(...style) {
    return DyeFactory.prototype.make.bind(DyeFab.build(HSL, style));
  }

  static int(...style) {
    return DyeFactory.prototype.make.bind(DyeFab.build(INT, style));
  }

  make(color) {
    var _this$slice;

    const local = (this == null ? void 0 : (_this$slice = this.slice) == null ? void 0 : _this$slice.call(this)) ?? DyeFab.shallow();
    if (color) this.encolor.call(local, color);
    return DyeFab.prototype.render.bind(local);
  }

  render(color, text) {
    var _this$slice2;

    const local = (this == null ? void 0 : (_this$slice2 = this.slice) == null ? void 0 : _this$slice2.call(this)) ?? DyeFab.shallow();
    if (color) this.encolor.call(local, color);
    return DyeFab.prototype.render.call(local, text);
  }

}

/**
 *
 * @param {Object} bound
 * @param {number} [bound.min] - if min: if dif, return {min,dif}; if max, return calculated {min,dif}
 * @param {number} [bound.dif] - if dif: if max, return calculated {min,dif}; else return {min:0,dif}
 * @param {number} [bound.max] - if max: return {min:0,dif:max}; else return {min:0,dif:0}
 * @return {{dif: number, min: number}}
 */

const parseBound = bound => {
  // if (!bound) return { min: 0, dif: 0 }
  let {
    min,
    max,
    dif
  } = bound;

  if (!nullish$2(min)) {
    if (!nullish$2(dif)) return {
      min,
      dif
    };
    if (!nullish$2(max)) return {
      min,
      dif: max - min
    };
  }

  if (!nullish$2(dif)) {
    if (!nullish$2(max)) return {
      min: max - dif,
      dif
    };
    return {
      min: 0,
      dif
    };
  }

  if (!nullish$2(max)) return {
    min: 0,
    dif: max
  };
  return {
    min: 0,
    dif: 0
  };
};

const leverage = ([x, y, z], delta) => [x / delta, y / delta, z / delta];

const minus = ([x_, y_, z_], [_x, _y, _z]) => [x_ - _x, y_ - _y, z_ - _z];

const scale = (x, lo, lev, min$1, hi) => comparer.min((comparer.max(x, lo) - lo) * lev + min$1, hi);
/**
 * @typedef {[number,number,number]} Triple
 * @typedef {function(string):string} dye
 * @typedef {{max:string,min:string,na:string,effects?:string[]}} PresetHEX
 * @typedef {{max:Triple,min:Triple,na:Triple,effects?:string[]}} PresetHSL
 * @typedef {{min:Triple,dif:Triple}} LeapHSL
 * @typedef {{min:number,dif:number}} LeapNum
 */


class ProjectorConfig {
  /** @type {function(Triple):dye} */

  /** @type {number} */

  /** @type {Triple} */

  /** @type {Triple} */

  /** @type {Triple} */

  /**
   * @param {LeapNum} leapNum
   * @param {LeapHSL} leapHSL
   * @param {Triple} napHSL
   * @param {string[]} effects
   */
  constructor(leapNum, leapHSL, napHSL, effects) {
    this.fab = void 0;
    this.lo = void 0;
    this.lev = void 0;
    this.min = void 0;
    this.nap = void 0; // this.fab = DyeFactory.build(HSL, effects)

    this.fab = DyeFactory.prototype.make.bind(DyeFab.build(HSL, effects));
    this.lo = leapNum.min;
    this.lev = !leapNum.dif ? 0 : leverage(leapHSL.dif, leapNum.dif);
    this.min = leapHSL.min;
    this.nap = napHSL;
  }
  /**
   * @param {Object} bound
   * @param {PresetHEX} preset
   * @returns {ProjectorConfig}
   */


  static fromHEX(bound, preset) {
    var _preset$max, _preset$min, _preset$na;

    const max = (_preset$max = preset.max, hexToHsl(_preset$max)),
          min = (_preset$min = preset.min, hexToHsl(_preset$min)),
          nap = (_preset$na = preset.na, hexToHsl(_preset$na)),
          effects = preset.effects;
    return new ProjectorConfig(parseBound(bound), {
      min,
      dif: minus(max, min)
    }, nap, effects);
  }
  /**
   * @param {Object} bound
   * @param {PresetHSL} preset
   * @returns {ProjectorConfig}
   */


  static fromHSL(bound, preset) {
    const {
      max,
      min,
      na: nap,
      effects
    } = preset;
    return new ProjectorConfig(parseBound(bound), {
      min,
      dif: minus(max, min)
    }, nap, effects);
  }

  project(value) {
    const {
      lo,
      lev,
      min
    } = this;
    return [scale(value, lo, lev[0], min[0], 360), scale(value, lo, lev[1], min[1], 100), scale(value, lo, lev[2], min[2], 100)];
  }

  get dyeNAp() {
    return this.fab(this.nap);
  }

}

const Colorant = (bound, preset = PLANET) => {
  const core = ProjectorConfig.fromHEX(bound, preset);
  const dyeNAp = core.dyeNAp;
  return x => isNumeric$1(x) ? core.fab(core.project(x)) : dyeNAp;
};

const QT = '\'';
const RT = ':';
const DASH = '-';

const padDeci = x => x >= 10 ? '' + x : '0' + x;

const padKilo = x => x >= 1000 ? '' + x : ('' + x).padStart(4, '0');

const padMilli = ms => (ms = '' + ms).length > 2 ? ms : ('00' + ms).slice(-3);

class Timestamp {
  constructor(datePreset, timePreset, milliPreset) {
    if (datePreset) {
      this.dy = Colorant({
        min: 1990,
        max: 2030
      }, datePreset);
      this.dm = Colorant({
        min: 1,
        max: 12
      }, datePreset);
      this.dd = Colorant({
        min: 1,
        max: 31
      }, datePreset);
    }

    if (timePreset) {
      this.dh = Colorant({
        min: 0,
        max: 23
      }, timePreset);
      this.ds = Colorant({
        min: 0,
        max: 59
      }, timePreset);
    }

    if (milliPreset) {
      this.dt = Colorant({
        min: 0,
        max: 999
      }, milliPreset);
    }
  }

  static build(datePreset = METRO, timePreset = SUBTLE, milliPreset = SUBTLE) {
    return new Timestamp(datePreset, timePreset, milliPreset);
  }
  /** @param {Date} dt */


  date(dt = new Date()) {
    return this.decoYMD(dt.getFullYear(), dt.getMonth() + 1, dt.getDate());
  }
  /** @param {Date} dt */


  roughTime(dt = new Date()) {
    return this.decoHMS(dt.getHours(), dt.getMinutes(), dt.getSeconds());
  }
  /** @param {Date} dt */


  time(dt = new Date()) {
    return this.roughTime(dt) + '.' + this.decoMilli(dt.getMilliseconds());
  }
  /** @param {Date} dt */


  dateTime(dt = new Date()) {
    return this.date(dt) + QT + this.roughTime(dt);
  }

  decoYMD(year, month, day) {
    var _padKilo, _padDeci, _padDeci2;

    return this.dy ? (_padKilo = padKilo(year), this.dy(year)(_padKilo)) + DASH + (_padDeci = padDeci(month), this.dm(month)(_padDeci)) + DASH + (_padDeci2 = padDeci(day), this.dd(day)(_padDeci2)) : padKilo(year) + DASH + padDeci(month) + DASH + padDeci(day);
  }

  decoHMS(hour, minute, second) {
    var _padDeci3, _padDeci4, _padDeci5;

    return this.dh ? (_padDeci3 = padDeci(hour), this.dh(hour)(_padDeci3)) + RT + (_padDeci4 = padDeci(minute), this.ds(minute)(_padDeci4)) + RT + (_padDeci5 = padDeci(second), this.ds(second)(_padDeci5)) : padDeci(hour) + RT + padDeci(minute) + RT + padDeci(second);
  }

  decoMilli(milli) {
    var _padMilli;

    return this.dt ? (_padMilli = padMilli(milli), this.dt(milli)(_padMilli)) : padMilli(milli);
  }

}

const timestamp = Timestamp.build();
/** @type {Function} */

timestamp.date.bind(timestamp);
/** @type {Function} */

timestamp.time.bind(timestamp);
/** @type {Function} */

timestamp.roughTime.bind(timestamp);
/** @type {Function} */

timestamp.dateTime.bind(timestamp);

const sortKeysByLength = dict => dict.sort(([a], [b]) => String(b).length - String(a).length);

const makeReplaceable = function (dict) {
  if (this !== null && this !== void 0 && this.sort) sortKeysByLength(dict);
  Object.defineProperty(dict, Symbol.replace, {
    value(word, after) {
      for (let [curr, proj] of this) word = word.replace(curr, proj);

      return after ? after(word) : word;
    },

    configurable: true,
    enumerable: false
  });
  return dict;
};

var _ref$1, _function, _return;

Dye.hex(Blue$2.lighten_2);
Dye.hex(LightBlue$2.accent_2);
Dye.hex(LightBlue$2.lighten_3);
Dye.hex(Lime$2.lighten_1);
(_ref$1 = [[/function/gi, (_function = 'function', Dye.hex(Grey$2.base)(_function))], [/return/gi, (_return = 'return', Dye.hex(Brown$2.lighten_3)(_return))], [/\bthis\b/gi, Dye.hex(BlueGrey$2.accent_2)], [/\b(if|else|while|do|switch|for)\b/gi, Dye.hex(Purple$2.lighten_3)], [/\b(var|let|const)\b/gi, Dye.hex(DeepPurple$2.lighten_3)]], makeReplaceable(_ref$1));

const DIGIT_2 = '2-digit';
const DATE_CONFIG = {
  year: DIGIT_2,
  month: DIGIT_2,
  day: DIGIT_2
};
/** @type {Intl.DateTimeFormat} */

const FormatDate = new Intl.DateTimeFormat(undefined, DATE_CONFIG);
FormatDate.format.bind(FormatDate);

const NUMERIC = 'numeric';
const TIME_CONFIG = {
  hour: NUMERIC,
  minute: NUMERIC,
  second: NUMERIC,
  hour12: false
};
/** @type {Intl.DateTimeFormat} */

const FormatTime = new Intl.DateTimeFormat(undefined, TIME_CONFIG);
FormatTime.format.bind(FormatTime);

/** @type {Intl.DateTimeFormat} */

const FormatDateTime = new Intl.DateTimeFormat(undefined, { ...DATE_CONFIG,
  ...TIME_CONFIG
});
FormatDateTime.format.bind(FormatDateTime);

const ANSI_ALPHA = /(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?)/;
const ANSI_BETA = /(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~])/;
const ANSI = new RegExp(`[][[\\]()#;?]*(?:${ANSI_ALPHA.source}|${ANSI_BETA.source})`);
//
// Block                                   Range       Comment
// CJK Unified Ideographs                  4E00-9FFF   Common
// CJK Unified Ideographs Extension A      3400-4DBF   Rare
// CJK Unified Ideographs Extension B      20000-2A6DF Rare, historic
// CJK Unified Ideographs Extension C      2A700–2B73F Rare, historic
// CJK Unified Ideographs Extension D      2B740–2B81F Uncommon, some in current use
// CJK Unified Ideographs Extension E      2B820–2CEAF Rare, historic
// CJK Compatibility Ideographs            F900-FAFF   Duplicates, unifiable variants, corporate characters
// CJK Compatibility Ideographs Supplement 2F800-2FA1F Unifiable variants

const ANSI_G = new RegExp(ANSI, 'g');

const clearAnsi = tx => tx.replace(ANSI_G, '');

const hasAnsi = tx => ANSI.test(tx);

// export const rpad = String.prototype.padEnd


Function.prototype.call.bind(String.prototype.padStart);

Function.prototype.call.bind(String.prototype.padEnd);

const LITERAL$1 = /[a-z]+|[A-Z][a-z]+|(?<=[a-z]|\W|_)[A-Z]+(?=[A-Z][a-z]|\W|_|$)|[\d]+[a-z]*/g;

const splitter = function (text) {
  const regex = this;
  let ms,
      l = 0,
      r = 0,
      sp,
      ph;
  const vec = [];

  while ((ms = regex.exec(text)) && ([ph] = ms)) {
    r = ms.index;
    if (sp = text.slice(l, r)) vec.push(sp);
    vec.push(ph);
    l = regex.lastIndex;
  }

  if (l < text.length) vec.push(text.slice(l));
  return vec;
};
/**
 * @type {Function|function(string):string[]}
 * @function
 */


const splitLiteral = splitter.bind(LITERAL$1);

const SPACE = /\s+/g;
const LINEFEED = /\r?\n/;

const foldToVector = function (text) {
  const {
    width: wd = 80,
    regex = SPACE,
    firstLineIndent
  } = this ?? {};
  const lines = [];
  let ms,
      ph,
      pr = 0,
      cu = 0,
      la = 0,
      nx = 0,
      th = pr + wd;
  if (firstLineIndent) text = SP$1.repeat(firstLineIndent) + text;

  while ((ms = regex.exec(text)) && ([ph] = ms)) {
    // VO |> says['progress'].p(pr).p(DA).br(cu + ':' + la).p(DA).br(nx).p(codes(ph)).br(/\r?\n/.test(ph)).p(DA).p(th)
    nx = ms.index;
    if (nx > th) lines.push(text.slice(pr, cu)), pr = la, th = pr + wd;
    if (LINEFEED.test(ph)) lines.push(text.slice(pr, nx)), pr = regex.lastIndex, th = pr + wd;
    cu = nx;
    la = regex.lastIndex;
  }

  if (text.length > th) lines.push(text.slice(pr, cu)), pr = la;
  if (pr < text.length) lines.push(text.slice(pr));
  if (firstLineIndent) lines[0] = lines[0].slice(firstLineIndent);
  return lines;
};

const fold = function (text) {
  var _text;

  const context = this;
  const delim = (this == null ? void 0 : this.delim) ?? LF$1;
  const lines = (_text = text, foldToVector.bind(context)(_text));
  return lines.join(delim);
};

const CONFIG = {
  vectify: splitLiteral,
  width: 0
};
/**
 * @prop width - foldToVector
 * @prop firstLineIndent - foldToVector
 * @prop indent - applicable only when valid width
 * @prop vectify - fluoString
 * @prop joiner - fluoString
 * @prop presets - fluoString
 * @prop effects - fluoString
 * @param text
 * @return {string}
 */

const _decoString = function (text) {
  var _text;

  const config = this,
        width = config.width,
        length = (_text = text) === null || _text === void 0 ? void 0 : _text.length;
  if (!length) return '';
  if (hasAnsi$1(text)) return text;
  if (width && length > width) text = fold.call({
    width: width,
    firstLineIndent: config.firstLineIndent,
    delim: LF$1 + TB.repeat(config.indent ?? 0)
  }, text);
  if (config.presets) text = stringColour.call(config, text);
  return text;
};

const stringColour = function (text) {
  const config = this;
  const {
    vectify,
    joiner
  } = this;
  const words = vectify(text);
  fluoVector.call(MUTATE_PIGMENT, words, config.presets); // use: presets, effects

  return joiner ? joiner(words) : words.join('');
};
/**
 * @param {string} text
 * @param {Object} [p]
 * @param {number} [p.width=80]
 * @param {number} [p.indent]
 * @param {number} [p.firstLineIndent]
 * @param {Object[]} [p.presets]
 * @param {string[]} [p.effects]
 * @param {Function} [p.vectify]
 * @param {Function} [p.joiner]
 * @return {string}
 */


const deco = (text, p = {}) => _decoString.call(DecoConfig.parse(p, CONFIG, DUAL_PRESET_COLLECTION), text);

const LITERAL = /[a-z]+|[A-Z][a-z]+|(?<=[a-z]|\W|_)[A-Z]+(?=[A-Z][a-z]|\W|_|$)|[\d]+[a-z]*/g;

const ripper = function (text) {
  const regex = this;
  let ms,
      l = 0,
      r = 0,
      sp,
      ph;
  const vec = [];

  while ((ms = regex.exec(text)) && ([ph] = ms)) {
    r = ms.index;
    if (sp = text.slice(l, r)) vec.push(sp);
    vec.push(ph);
    l = regex.lastIndex;
  }

  if (l < text.length) vec.push(text.slice(l));
  return vec;
};

/**
 * @type {Function|function(string):string[]}
 * @function
 */


ripper.bind(LITERAL);

const isTab = c => c === '\t' || c === ' ';

const deNaTab = tx => {
  let i = 0;

  for (let {
    length
  } = tx; i < length; i++) if (!isTab(tx.charAt(i))) return i;

  return i;
};

/**
 *
 * @type {Function|function(*):string}
 */
Function.prototype.call.bind(Object.prototype.toString);

// export const rpad = String.prototype.padEnd


Function.prototype.call.bind(String.prototype.padStart);

Function.prototype.call.bind(String.prototype.padEnd);

fluoEntries.bind(MUTATE_PIGMENT);

fluoVector.bind(MUTATE_PIGMENT);

fluoMatrix.bind(MUTATE_PIGMENT);

/**
 * Take the first "n" elements from an array.
 * @param len. The number denote the first "n" elements in an array.
 * @returns {*[]}. A new array length at "len".
 */


Array.prototype.take = function (len) {
  return this.slice(0, len);
};

Array.prototype.zip = function (another, zipper) {
  const {
    length
  } = this,
        arr = Array(length);

  for (let i = 0; i < length; i++) arr[i] = zipper(this[i], another[i], i);

  return arr; // return Array.from({ length: size }, (v, i) => zipper(this[i], another[i], i))
  // return this.map((x, i) => zipper(x, another[i]))
};

/**
 *
 */

class CrosTab$1 {
  /** @type {*[]} */
  side;
  /** @type {*[]} */

  head;
  /** @type {*[][]} */

  rows;
  /** @type {string} */

  title;
  /**
   *
   * @param {*[]} side
   * @param {*[]} head
   * @param {*[][]} rows
   * @param {string} [title]
   */

  constructor(side, head, rows, title) {
    this.side = side;
    this.head = head;
    this.rows = rows;
    this.title = title || '';
  }

  static from(o) {
    return new CrosTab$1(o.side, o.head || o.banner, o.rows || o.matrix, o.title);
  }
  /**
   * Shallow copy
   * @param {*[]} side
   * @param {*[]} head
   * @param {function(number,number):*} func
   * @param {string} [title]
   * @return {CrosTab}
   */


  static init({
    side,
    head,
    func,
    title
  }) {
    return CrosTab$1.from({
      side,
      head,
      rows: Init.init(side === null || side === void 0 ? void 0 : side.length, head === null || head === void 0 ? void 0 : head.length, (x, y) => func(x, y)),
      title
    });
  }

  rowwiseSamples(headFields, indexed = false, indexName = '_') {
    const samples = tabular.selectTabularToSamples.call(this, headFields);
    return indexed ? Zipper.zipper(this.side, samples, (l, s) => Object.assign(objectInit.pair(indexName, l), s)) : samples;
  }

  columnwiseSamples(sideFields, indexed = false, indexName = '_') {
    const samples = keyedRows.selectSamplesBySide.call(this, sideFields);
    return indexed ? Zipper.zipper(this.head, samples, (l, s) => Object.assign(objectInit.pair(indexName, l), s)) : samples;
  }

  toObject(mutate = false) {
    var _this, _this2;

    return mutate ? (_this = this, crostabInit.slice(_this)) : (_this2 = this, crostabInit.shallow(_this2));
  }

  toTable(sideLabel) {
    const head = Merge.acquire([sideLabel], this.head);
    const rows = Zipper.zipper(this.side, this.rows, (x, row) => Merge.acquire([x], row));
    return {
      head,
      rows
    };
  }
  /** @returns {*[][]} */


  get columns() {
    return Transpose.transpose(this.rows);
  }

  get size() {
    return [this.height, this.width];
  }

  get height() {
    var _this$side;

    return (_this$side = this.side) === null || _this$side === void 0 ? void 0 : _this$side.length;
  }

  get width() {
    var _this$head;

    return (_this$head = this.head) === null || _this$head === void 0 ? void 0 : _this$head.length;
  }

  roin(r) {
    return this.side.indexOf(r);
  }

  coin(c) {
    return this.head.indexOf(c);
  }

  cell(r, c) {
    return this.element(this.roin(r), this.coin(c));
  }

  element(x, y) {
    return x in this.rows ? this.rows[x][y] : undefined;
  }

  coordinate(r, c) {
    return {
      x: this.roin(r),
      y: this.coin(c)
    };
  }

  row(r) {
    return this.rows[this.roin(r)];
  }

  column(c) {
    return ColumnGetter.column(this.rows, this.coin(c), this.height);
  }

  transpose(title, {
    mutate = true
  } = {}) {
    return this.boot({
      side: this.head,
      head: this.side,
      rows: this.columns,
      title
    }, mutate);
  }

  setCell(r, c, value) {
    const x = this.roin(r),
          y = this.coin(r);
    if (x >= 0 && y >= 0) this.rows[x][y] = value;
  }

  setElement(x, y, value) {
    if (x >= 0 && y >= 0) this.rows[x][y] = value;
  }

  setRow(r, row) {
    return this.rows[this.roin(r)] = row, this;
  }

  setRowBy(r, fn) {
    return Mapper.mutate(this.row(r), fn, this.width), this;
  }

  setColumn(c, column) {
    return columnMapper.mutate(this.rows, this.coin(c), (_, i) => column[i], this.height), this;
  }

  setColumnBy(c, fn) {
    return columnMapper.mutate(this.rows, this.coin(c), fn, this.height), this;
  }

  map(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      rows: Mapper$1.mapper(this.rows, fn, this.height, this.width)
    }, mutate);
  }

  mapSide(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      side: Mapper.mapper(this.side, fn)
    }, mutate);
  }

  mapBanner(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      head: Mapper.mapper(this.head, fn)
    }, mutate);
  }

  mutate(fn) {
    return Mapper$1.mutate(this.rows, fn, this.height, this.width), this;
  }

  mutateSide(fn) {
    return Mapper.mutate(this.side, fn), this;
  }

  mutateBanner(fn) {
    return Mapper.mutate(this.head, fn), this;
  }

  pushRow(label, row) {
    return this.side.push(label), this.rows.push(row), this;
  }

  unshiftRow(label, row) {
    return this.side.unshift(label), this.rows.unshift(row), this;
  }

  pushColumn(label, col) {
    return this.head.push(label), columnsUpdate.push(this.rows, col), this;
  }

  unshiftColumn(label, col) {
    return this.head.unshift(label), columnsUpdate.unshift(this.rows, col), this;
  }

  popRow() {
    return this.rows.pop();
  }

  shiftRow() {
    return this.rows.shift();
  }

  popColumn() {
    return columnsUpdate.pop(this.rows);
  }

  shiftColumn() {
    return columnsUpdate.shift(this.rows);
  }

  slice({
    top,
    bottom,
    left,
    right,
    mutate = true
  } = {}) {
    let {
      side,
      head,
      rows
    } = this;
    if (top || bottom) side = side.slice(top, bottom), rows = rows.slice(top, bottom);
    if (left || right) head = head.slice(left, right), rows = rows.map(row => row.slice(left, right));
    return this.boot({
      side,
      head,
      rows
    }, mutate);
  }

  vlookupOne(valueToFind, keyField, valueField, cached) {
    return (cached ? crostabLookup.vlookupCached : crostabLookup.vlookup).call(this, valueToFind, keyField, valueField);
  }

  vlookupMany(valuesToFind, keyField, valueField) {
    return crostabLookup.vlookupMany.call(this, valuesToFind, keyField, valueField);
  }

  vlookupTable(keyField, valueField) {
    return crostabLookup.vlookupTable.call(this, keyField, valueField);
  }

  hlookupOne(valueToFind, keyField, valueField, cached) {
    return (cached ? crostabLookup.hlookupCached : crostabLookup.hlookup).call(this, valueToFind, keyField, valueField);
  }

  hlookupMany(valuesToFind, keyField, valueField) {
    return crostabLookup.hlookupMany.call(this, valuesToFind, keyField, valueField);
  }

  hlookupTable(keyField, valueField) {
    return crostabLookup.hlookupTable.call(this, keyField, valueField);
  }

  selectRows(sideLabels, mutate = false) {
    var _this3;

    let o = mutate ? this : (_this3 = this, crostabInit.slice(_this3));
    keyedRows.selectKeyedRows.call(o, sideLabels);
    return mutate ? this : this.copy(o);
  }

  selectColumns(headLabels, mutate = false) {
    var _this4;

    let o = mutate ? this : (_this4 = this, crostabInit.slice(_this4));
    tabular.selectTabular.call(this, headLabels);
    return mutate ? this : this.copy(o);
  }

  select({
    side,
    head,
    mutate = false
  } = {}) {
    var _this5;

    let o = mutate ? this : (_this5 = this, crostabInit.slice(_this5));
    if (head !== null && head !== void 0 && head.length) tabular.selectTabular.call(o, head);
    if (side !== null && side !== void 0 && side.length) keyedRows.selectKeyedRows.call(o, side);
    return mutate ? this : this.copy(o);
  }

  sort({
    direct = enumMatrixDirections.ROWWISE,
    field,
    comparer: comparer$1 = comparer.NUM_ASC,
    mutate = false
  } = {}) {
    var _this6;

    let o = mutate ? this : (_this6 = this, crostabInit.slice(_this6));
    if (direct === enumMatrixDirections.ROWWISE) keyedRows.sortKeyedRows.call(o, comparer$1, this.coin(field));
    if (direct === enumMatrixDirections.COLUMNWISE) tabular.sortTabular.call(o, comparer$1, this.roin(field));
    return mutate ? this : this.copy(o);
  }

  sortByLabels({
    direct = enumMatrixDirections.ROWWISE,
    comparer: comparer$1 = comparer.STR_ASC,
    mutate = false
  }) {
    var _this7;

    let o = mutate ? this : (_this7 = this, crostabInit.slice(_this7));
    if (direct === enumMatrixDirections.ROWWISE) keyedRows.sortRowsByKeys.call(o, comparer$1);
    if (direct === enumMatrixDirections.COLUMNWISE) tabular.sortTabularByKeys.call(o, comparer$1);
    return mutate ? this : this.copy(o);
  }

  boot({
    side,
    head,
    rows,
    title
  } = {}, mutate) {
    if (mutate) {
      if (side) this.side = side;
      if (head) this.head = head;
      if (rows) this.rows = rows;
      if (title) this.title = title;
      return this;
    } else {
      return this.copy({
        side,
        head,
        rows,
        title
      });
    }
  }

  copy({
    side,
    head,
    rows,
    title
  } = {}) {
    if (!side) side = this.side.slice();
    if (!head) head = this.head.slice();
    if (!rows) rows = this.rows.map(row => row.slice());
    if (!title) title = this.title;
    return new CrosTab$1(side, head, rows, title);
  }

}

const values = function (o) {
  const {
    keys
  } = this;
  const l = keys === null || keys === void 0 ? void 0 : keys.length,
        ve = Array(l);

  for (let i = 0; i < l; i++) ve[i] = o[keys[i]];

  return ve;
};

const selectValues = (o, keys) => values.call({
  keys
}, o);

const SelectValues = keys => values.bind({
  keys
});

/**
 *
 * @param sampleCollection
 * @param {Object} config
 * @param {[]} config.side
 * @param {[]} config.head
 * @returns {CrosTab}
 */


function samplesToCrostab(sampleCollection, config = {}) {
  var _samples;

  const samples = config.side ? selectValues(sampleCollection, config.side) : Object.values(sampleCollection);
  const side = config.side ?? Object.keys(sampleCollection);
  const head = config.head ?? Object.keys((_samples = samples, first(_samples)));
  const rows = samples.map(config.head ? SelectValues(config.head) : Object.values);
  return CrosTab$1.from({
    side,
    head,
    rows
  });
}

const CJK_PUNCS = '\u3000-\u303f';
const CJK_LETTERS = '\u4e00-\u9fbf';
const FULL_CHARS = '\uff00-\uffef'; // full letters + full puncs

const HAN = new RegExp(`[${CJK_PUNCS}${CJK_LETTERS}${FULL_CHARS}]`); // HAN ideographs

HAN.test.bind(HAN);

var _ref;

const REG_CR = /\r/g;
const BACKSLASH_CR = '\\r';
const REG_LF = /\n/g;
const BACKSLASH_LF = '\\n';
(_ref = [[REG_CR, BACKSLASH_CR], [REG_LF, BACKSLASH_LF]], makeReplaceable(_ref));

const ITALIC = 'italic'; // 3 - 23

const INVERSE = 'inverse'; // 7 - 27

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

const red = [RED, PINK];
const purple = [PURPLE, DEEPPURPLE];
const blue = [INDIGO, BLUE, LIGHTBLUE, CYAN];
const green = [TEAL, GREEN];
const yellowGreen = [LIGHTGREEN, LIME, YELLOW];
const orange$1 = [AMBER, ORANGE, DEEPORANGE];
const grey$1 = [BROWN, BLUEGREY, GREY];
const rainbow = [].concat(red, purple, blue, green, yellowGreen, orange$1);
const entire = rainbow.concat(grey$1);
const ColorGroups = {
  red,
  purple,
  blue,
  green,
  yellowGreen,
  orange: orange$1,
  grey: grey$1,
  rainbow,
  entire
};
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
}; //   [/light/gi, 'l'],
//   [/deep/gi, 'd']
// ] |> makeReplaceable
// export const shortenDescription = name => name.replace(lexicon, x => camelToSnake(x, '.'))

function palettCrostab({
  space = HEX$1,
  degrees = Degrees.entire,
  colors = ColorGroups.entire,
  dyed = false
} = {}) {
  const crostab = samplesToCrostab(Cards$2, {
    side: colors,
    head: degrees
  }).transpose();

  if (space !== HEX$1) {
    crostab.mutate(space === RGB$1 ? hexToRgb$3 : space === HSL$1 ? hexToHsl$3 : oneself);
  }

  if (dyed) {
    const dyeFactory = DyeFactory$1.build(space, [INVERSE]);
    space === HEX$1 ? crostab.mutate(hex => {
      var _hex;

      return _hex = hex, dyeFactory(hex)(_hex);
    }) : crostab.mutate(xyz => {
      var _mapper;

      return _mapper = Mapper.mapper(xyz, v => v.toFixed(0).padStart(3)), dyeFactory(xyz)(_mapper);
    });
  }

  return crostab; // .mutateBanner(shortenDescription)
}

const swap = function (i, j) {
  const temp = this[i];
  this[i] = this[j];
  return this[j] = temp;
};

const LIGHTEN = 'lighten',
      ACCENT = 'accent',
      DARKEN = 'darken';

const degreeToIndice = degree => {
  let i = degree.indexOf('_');
  if (i < 0) return randBetw(14, 16);
  let cate = degree.slice(0, i),
      order = degree.slice(++i);
  if (cate === LIGHTEN) return 15 - --order * 3;
  if (cate === ACCENT) return 14 - --order * 3;
  if (cate === DARKEN) return 13 - --order * 3;
  return rand(16);
};

const sortBy = function (indicator, comparer) {
  const vec = this,
        kvs = Mapper.mutate(vec, (x, i) => [indicator(x, i), x]).sort(toKeyComparer(comparer));
  return Mapper.mutate(kvs, ([, value]) => value);
};

const toKeyComparer = comparer => (a, b) => comparer(a[0], b[0]); // accent  15 -3

function* presetFlopper({
  degrees = Degrees.entire,
  colors = ColorGroups.rainbow,
  space = HEX$1,
  defaultColor = Grey$2.lighten_1,
  exhausted = true
} = {}) {
  var _crostab$head;

  const crostab = palettCrostab({
    space,
    degrees,
    colors,
    dyed: false
  });
  degrees = sortBy.call(degrees.slice(), degreeToIndice, comparer.NUM_DESC);
  let h = degrees.length,
      w = colors.length;

  for (let i = 0; i < h; i++) {
    for (let j = w - 1, side = degrees[i], head = crostab.head.slice(); j >= 0; j--) {
      const banner = swap.call(head, rand(j), j);
      const hex = crostab.cell(side, banner);
      yield randPreset(hex);
    }
  }

  defaultColor = defaultColor ?? crostab.cell(degrees[0], (_crostab$head = crostab.head, flop(_crostab$head)));
  const defaultPreset = randPreset(defaultColor);

  while (!exhausted) yield defaultPreset;

  return defaultPreset;
}

class Callable$1 extends Function {
  constructor(f) {
    super();
    Reflect.setPrototypeOf(f, new.target.prototype);
    return f;
  }

}

const tab = ind => SP.repeat(ind << 1);

const logBy = (text, config) => {
  let {
    name,
    des,
    ind,
    log,
    att
  } = config;
  let signature = `${tab(ind)}[${name}]`;
  if (att) signature += SP + att();
  if (des !== null && des !== void 0 && des.length) signature += des, config.des = '';
  if (typeof text !== STR$3) text += '';
  return void log(signature, text.includes(LF) ? (LF + text).replace(/\n/g, LF + tab(++ind)) : text);
};

const NAME = 'name'; // const WRITABLE = { writable: true }

/** @type {function} */

class Pal extends Callable$1 {
  // /** @type {string}   */ name

  /** @type {string}   */
  des = '';
  /** @type {number}   */

  ind = 0;
  /** @type {Function} */

  log = console.log;
  /** @type {Function} */

  att = void 0;
  /** @type {{max:*,min:*,na:*}} */

  decoConf;

  constructor(name, {
    indent = 0,
    logger,
    attach,
    decoConf
  } = {}) {
    // const f = text => logBy(text, this)
    // Object.defineProperty(f, NAME, WRITABLE)
    // super(f)
    super(text => logBy(text, this));
    Object.defineProperty(this, NAME, {
      value: name ?? '',
      writable: true
    });
    if (indent) this.ind = indent;
    if (logger) this.log = logger;
    if (attach) this.attach(attach);
    if (decoConf) this.decoConf = decoConf;
  }
  /**
   * @param {string} title
   * @param {Object} [options]
   * @returns {Pal|function}
   */


  static build(title, options) {
    return new Pal(title, options);
  }

  get asc() {
    return this.ind++, this;
  }

  get desc() {
    return this.ind && this.ind--, this;
  }

  render(message) {
    return deco(String(message), this.decoConf);
  }

  p(words) {
    return this.des += SP + words, this;
  }

  br(words) {
    return this.des += SP + parenth$2(words), this;
  }

  to(someone) {
    if (someone instanceof Pal) someone = someone.name;
    this.des += ' -> ' + bracket$2(someone);
    return this;
  }

  attach(func) {
    if (typeof func === FUN) {
      this.att = func;
    }

    return this;
  }

  detach() {
    return this.att = null, this;
  }

  level(logger) {
    if (typeof logger === STR$3 && logger in console) {
      return this.log = console[logger], this;
    }

    if (typeof logger === FUN) {
      return this.log = logger, this;
    }

    return this;
  }

}

class Says {
  /** @type {Object<string,Pal|function>} */
  #roster = {};
  /** @type {Generator<{max:*,min:*,na:*}>} */

  #pool = presetFlopper({
    exhausted: false
  });
  /** @type {string[]} */

  #effects = undefined;

  constructor(roster, effects) {
    if (roster) this.#roster = roster;
    this.#effects = effects;
    return new Proxy(this, {
      /** @returns {Pal|function} */
      get(t, p) {
        if (p in t) return typeof (p = t[p]) === FUN ? p.bind(t) : p;
        if (p in t.#roster) return t.#roster[p];
        return t.aboard(p, t.#pool.next().value);
      }

    });
  }

  aboard(name, presets) {
    const preset = presets ?? this.#pool.next().value;
    const decoConf = {
      presets: preset,
      effects: this.#effects
    };
    const decoName = deco(String(name), decoConf);
    return this.#roster[name] = Pal.build(decoName, {
      decoConf
    });
  }

  roster(name) {
    if (name) return (this.#roster[name] ?? this.aboard(name)).name;
    return mapper(this.#roster, ({
      name
    }) => name);
  }
  /**
   *
   * @param roster
   * @param effects
   * @returns {Says|Object<string,function>}
   */


  static build({
    roster,
    effects = [ITALIC]
  } = {}) {
    return new Says(roster, effects);
  }

}
/** @type {Function|Says} */


new Says();

const NUM = 'number';
const STR = 'string';
const DEF = 'default';
const orange = Dye.hex(Cards$2.orange.lighten_3);
const indigo = Dye.hex(Cards$2.indigo.lighten_1);

const bracket$1 = tx => orange('[') + tx + orange(']');

const parenth$1 = tx => indigo('(') + tx + indigo(')');

const blueGrey = Dye.hex(Cards$2.blueGrey.base);
const grey = Dye.hex(Cards$2.grey.darken_1);

const bracket = (tx = '') => blueGrey('[') + grey(tx) + blueGrey(']');

const parenth = (tx = '') => blueGrey('(') + grey(tx) + blueGrey(')');
/**
 *
 * @param {*} [text]
 * @return {string}
 */


function render(text) {
  const queue = this,
        {
    indent
  } = queue;
  if (text !== null && text !== void 0 && text.length) queue.push(text);
  return SP.repeat(indent << 1) + queue.join(SP);
}

const EDGE_BRACKET = /^[(\[{].*[)\]}]$/;

const enqueue = function (key, ...items) {
  const {
    queue,
    conf
  } = this;
  const {
    bracket,
    parenth
  } = conf;
  if (items.every(nullish$2)) ;else {
    items = items.map(String).join(COSP);
    queue.push(bracket.major(String(key)));
    queue.push(hasAnsi(items) && EDGE_BRACKET.test(clearAnsi(items)) ? items : parenth.major(items));
  }
  return this;
};

const initQueue = t => {
  var _t;

  const queue = [];
  let hi, indent;
  if (t && (hi = (_t = t = String(t)) === null || _t === void 0 ? void 0 : _t.length) && (indent = deNaTab(t)) < hi) queue.push(t.slice(indent));
  queue.indent = indent;
  return {
    queue
  };
};

class Callable extends Function {
  constructor(f) {
    super();
    Reflect.setPrototypeOf(f, new.target.prototype);
    return f;
  }

}
/**
 * @typedef {Array<string>} ArrayWithIndent
 * @typedef {string} ArrayWithIndent.indent
 */

/**
 * @type {Object<string,string>}
 */


class XrStream extends Callable {
  /** @type {ArrayWithIndent} */
  queue;
  /** @type {number} */

  indent;
  /** @type {{br:{major:Function,minor:Function},pa:{major:Function,minor:Function}} */

  #conf = {};

  constructor(word, pretty = true) {
    super(word => render.call(this.queue, word));
    Object.assign(this, initQueue(word));
    this.#conf.bracket = pretty ? {
      major: bracket$1,
      minor: bracket
    } : {
      major: bracket$2,
      minor: bracket$2
    };
    this.#conf.parenth = pretty ? {
      major: parenth$1,
      minor: parenth
    } : {
      major: parenth$2,
      minor: parenth$2
    };
    return new Proxy(this, {
      get(target, name, receiver) {
        return name in target ? target[name] // `[proxy.get] (${ String(name) }) (${ target?.name })` |> logger,
        : (...items) => (enqueue.call(target, name, ...items), receiver);
      }

    });
  }

  get conf() {
    return this.#conf;
  }

  asc() {
    return this.queue.indent++, this;
  }

  desc() {
    return this.queue.indent--, this;
  }

  p(...items) {
    return this.queue.push(...items), this;
  }

  br(...items) {
    return this.queue.push(items.map(parenth$2).join(CO)), this;
  }

  toString() {
    return render.call(this.queue);
  }

  [Symbol.toPrimitive](h) {
    switch (h) {
      case STR:
      case DEF:
        return render.call(this.queue);

      case NUM:
        return this.queue.indent;

      default:
        throw new Error('XrStream Symbol.toPrimitive error');
    }
  }

}

new XrStream();

/**
 *
 */

class CrosTab {
  /** @type {*[]} */
  side;
  /** @type {*[]} */

  head;
  /** @type {*[][]} */

  rows;
  /** @type {string} */

  title;
  /**
   *
   * @param {*[]} side
   * @param {*[]} head
   * @param {*[][]} rows
   * @param {string} [title]
   */

  constructor(side, head, rows, title) {
    this.side = side;
    this.head = head;
    this.rows = rows;
    this.title = title || '';
  }

  static from(o) {
    let side = o.side,
        head = o.head || o.banner,
        rows = o.rows || o.matrix,
        title = o.title;
    if (side && head && !rows) rows = Init.draft(side.length, head.length);
    return new CrosTab(side, head, rows, title);
  }
  /**
   * Shallow copy
   * @param {*[]} side
   * @param {*[]} head
   * @param {function(number,number):*} func
   * @param {string} [title]
   * @return {CrosTab}
   */


  static init({
    side,
    head,
    func,
    title
  }) {
    return new CrosTab(side, head, Init.init(side === null || side === void 0 ? void 0 : side.length, head === null || head === void 0 ? void 0 : head.length, (x, y) => func(x, y)), title);
  }

  static draft({
    side,
    head,
    value,
    title
  }) {
    const rows = Init.iso(side.length, head.length, value);
    return new CrosTab(side, head, rows, title);
  }

  rowwiseSamples(headFields, indexed = false, indexName = '_') {
    const samples = tabular.selectTabularToSamples.call(this, headFields);
    return indexed ? Zipper.zipper(this.side, samples, (l, s) => Object.assign(objectInit.pair(indexName, l), s)) : samples;
  }

  columnwiseSamples(sideFields, indexed = false, indexName = '_') {
    const samples = keyedRows.selectSamplesBySide.call(this, sideFields);
    return indexed ? Zipper.zipper(this.head, samples, (l, s) => Object.assign(objectInit.pair(indexName, l), s)) : samples;
  }

  toObject(mutate = false) {
    var _this, _this2;

    return mutate ? (_this = this, crostabInit.slice(_this)) : (_this2 = this, crostabInit.shallow(_this2));
  }

  toTable(sideLabel) {
    const head = Merge.acquire([sideLabel], this.head);
    const rows = Zipper.zipper(this.side, this.rows, (x, row) => Merge.acquire([x], row));
    return {
      head,
      rows
    };
  }
  /** @returns {*[][]} */


  get columns() {
    return Transpose.transpose(this.rows);
  }

  get size() {
    return [this.height, this.width];
  }

  get height() {
    var _this$side;

    return (_this$side = this.side) === null || _this$side === void 0 ? void 0 : _this$side.length;
  }

  get width() {
    var _this$head;

    return (_this$head = this.head) === null || _this$head === void 0 ? void 0 : _this$head.length;
  }

  roin(r) {
    return this.side.indexOf(r);
  }

  coin(c) {
    return this.head.indexOf(c);
  }

  cell(r, c) {
    return this.element(this.roin(r), this.coin(c));
  }

  element(x, y) {
    return x in this.rows ? this.rows[x][y] : undefined;
  }

  coordinate(r, c) {
    return {
      x: this.roin(r),
      y: this.coin(c)
    };
  }

  row(r) {
    return this.rows[this.roin(r)];
  }

  column(c) {
    return ColumnGetter.column(this.rows, this.coin(c), this.height);
  }

  transpose(title, {
    mutate = true
  } = {}) {
    return this.boot({
      side: this.head,
      head: this.side,
      rows: this.columns,
      title
    }, mutate);
  }

  setCell(r, c, value) {
    const x = this.roin(r),
          y = this.coin(c);
    if (x >= 0 && y >= 0) this.rows[x][y] = value;
  }

  setElement(x, y, value) {
    if (x >= 0 && y >= 0) this.rows[x][y] = value;
  }

  setRow(r, row) {
    return this.rows[this.roin(r)] = row, this;
  }

  setRowBy(r, fn) {
    return Mapper.mutate(this.row(r), fn, this.width), this;
  }

  setColumn(c, column) {
    return columnMapper.mutate(this.rows, this.coin(c), (_, i) => column[i], this.height), this;
  }

  setColumnBy(c, fn) {
    return columnMapper.mutate(this.rows, this.coin(c), fn, this.height), this;
  }

  map(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      rows: Mapper$1.mapper(this.rows, fn, this.height, this.width)
    }, mutate);
  }

  mapSide(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      side: Mapper.mapper(this.side, fn)
    }, mutate);
  }

  mapBanner(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      head: Mapper.mapper(this.head, fn)
    }, mutate);
  }

  mutate(fn) {
    return Mapper$1.mutate(this.rows, fn, this.height, this.width), this;
  }

  mutateSide(fn) {
    return Mapper.mutate(this.side, fn), this;
  }

  mutateBanner(fn) {
    return Mapper.mutate(this.head, fn), this;
  }

  pushRow(label, row) {
    return this.side.push(label), this.rows.push(row), this;
  }

  unshiftRow(label, row) {
    return this.side.unshift(label), this.rows.unshift(row), this;
  }

  pushColumn(label, col) {
    return this.head.push(label), columnsUpdate.push(this.rows, col), this;
  }

  unshiftColumn(label, col) {
    return this.head.unshift(label), columnsUpdate.unshift(this.rows, col), this;
  }

  popRow() {
    return this.rows.pop();
  }

  shiftRow() {
    return this.rows.shift();
  }

  popColumn() {
    return columnsUpdate.pop(this.rows);
  }

  shiftColumn() {
    return columnsUpdate.shift(this.rows);
  }

  slice({
    top,
    bottom,
    left,
    right,
    mutate = true
  } = {}) {
    let {
      side,
      head,
      rows
    } = this;
    if (top || bottom) side = side.slice(top, bottom), rows = rows.slice(top, bottom);
    if (left || right) head = head.slice(left, right), rows = rows.map(row => row.slice(left, right));
    return this.boot({
      side,
      head,
      rows
    }, mutate);
  }

  vlookupOne(valueToFind, keyField, valueField, cached) {
    return (cached ? crostabLookup.vlookupCached : crostabLookup.vlookup).call(this, valueToFind, keyField, valueField);
  }

  vlookupMany(valuesToFind, keyField, valueField) {
    return crostabLookup.vlookupMany.call(this, valuesToFind, keyField, valueField);
  }

  vlookupTable(keyField, valueField) {
    return crostabLookup.vlookupTable.call(this, keyField, valueField);
  }

  hlookupOne(valueToFind, keyField, valueField, cached) {
    return (cached ? crostabLookup.hlookupCached : crostabLookup.hlookup).call(this, valueToFind, keyField, valueField);
  }

  hlookupMany(valuesToFind, keyField, valueField) {
    return crostabLookup.hlookupMany.call(this, valuesToFind, keyField, valueField);
  }

  hlookupTable(keyField, valueField) {
    return crostabLookup.hlookupTable.call(this, keyField, valueField);
  }

  selectRows(sideLabels, mutate = false) {
    var _this3;

    let o = mutate ? this : (_this3 = this, crostabInit.slice(_this3));
    keyedRows.selectKeyedRows.call(o, sideLabels);
    return mutate ? this : this.copy(o);
  }

  selectColumns(headLabels, mutate = false) {
    var _this4;

    let o = mutate ? this : (_this4 = this, crostabInit.slice(_this4));
    tabular.selectTabular.call(this, headLabels);
    return mutate ? this : this.copy(o);
  }

  select({
    side,
    head,
    mutate = false
  } = {}) {
    var _this5;

    let o = mutate ? this : (_this5 = this, crostabInit.slice(_this5));
    if (head !== null && head !== void 0 && head.length) tabular.selectTabular.call(o, head);
    if (side !== null && side !== void 0 && side.length) keyedRows.selectKeyedRows.call(o, side);
    return mutate ? this : this.copy(o);
  }

  sort({
    direct = enumMatrixDirections.ROWWISE,
    field,
    comparer: comparer$1 = comparer.NUM_ASC,
    mutate = false
  } = {}) {
    var _this6;

    let o = mutate ? this : (_this6 = this, crostabInit.slice(_this6));
    if (direct === enumMatrixDirections.ROWWISE) keyedRows.sortKeyedRows.call(o, comparer$1, this.coin(field));
    if (direct === enumMatrixDirections.COLUMNWISE) tabular.sortTabular.call(o, comparer$1, this.roin(field));
    return mutate ? this : this.copy(o);
  }

  sortByLabels({
    direct = enumMatrixDirections.ROWWISE,
    comparer: comparer$1 = comparer.STR_ASC,
    mutate = false
  }) {
    var _this7;

    let o = mutate ? this : (_this7 = this, crostabInit.slice(_this7));
    if (direct === enumMatrixDirections.ROWWISE) keyedRows.sortRowsByKeys.call(o, comparer$1);
    if (direct === enumMatrixDirections.COLUMNWISE) tabular.sortTabularByKeys.call(o, comparer$1);
    return mutate ? this : this.copy(o);
  }

  boot({
    side,
    head,
    rows,
    title
  } = {}, mutate) {
    if (mutate) {
      if (side) this.side = side;
      if (head) this.head = head;
      if (rows) this.rows = rows;
      if (title) this.title = title;
      return this;
    } else {
      return this.copy({
        side,
        head,
        rows,
        title
      });
    }
  }

  copy({
    side,
    head,
    rows,
    title
  } = {}) {
    if (!side) side = this.side.slice();
    if (!head) head = this.head.slice();
    if (!rows) rows = this.rows.map(row => row.slice());
    if (!title) title = this.title;
    return new CrosTab(side, head, rows, title);
  }

}

exports.CrosTab = CrosTab;
