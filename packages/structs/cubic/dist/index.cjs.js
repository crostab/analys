'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var dataGram = require('@analys/data-gram');
var nestGram = require('@analys/nest-gram');
var utilPivot = require('@analys/util-pivot');
var vectorMapper = require('@vect/vector-mapper');
var vectorZipper = require('@vect/vector-zipper');

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

class Cubic {
  /** @type {Function} */

  /**
   *
   * @param {{key:number, to:Function?}[]} side
   * @param {{key:number, to:Function?}[]} head
   * @param {{key:number, to:number}[]} field
   */
  constructor(side, head, field) {
    _defineProperty(this, "side", void 0);

    _defineProperty(this, "head", void 0);

    _defineProperty(this, "field", void 0);

    _defineProperty(this, "accum", void 0);

    _defineProperty(this, "data", void 0);

    _defineProperty(this, "cell", void 0);

    if (side.length === 1 && head.length === 1) {
      [this.side] = side;
      [this.head] = head;
    } else {
      this.nested = true;
      this.side = side;
      this.head = head;
    }

    if (field.length === 1) {
      const [_field] = field;
      this.field = {
        key: _field.key,
        accum: utilPivot.modeToTally(_field.to)
      };
      this.data = (this.nested ? nestGram.NestGram : dataGram.DataGram).build(utilPivot.modeToInit(_field.to));
    } else {
      this.cubic = true;
      const initList = field.map(({
        to
      }) => utilPivot.modeToInit(to));
      this.field = field.map(({
        key,
        to
      }) => ({
        key,
        accum: utilPivot.modeToTally(to)
      }));
      this.data = (this.nested ? nestGram.NestGram : dataGram.DataGram).build(() => initList.map(fn => fn()));
    }
  }

  static build(side, head, field) {
    return new Cubic(side, head, field);
  }

  record(samples) {
    vectorMapper.iterate(samples, Notes.init(this.nested, this.cubic, this));
    return this;
  }

  toObject() {
    const {
      side,
      head,
      rows
    } = this.data;
    return {
      side,
      head,
      rows
    };
  }

}

class Notes {
  static init(nested, cubic, thisArg) {
    return nested ? cubic ? Notes.nestedCubic.bind(thisArg) : Notes.nestedPivot.bind(thisArg) : cubic ? Notes.simpleCubic.bind(thisArg) : Notes.simplePivot.bind(thisArg);
  }

  static simplePivot(sample) {
    const {
      data,
      side,
      head,
      field
    } = this;
    const s = side.to ? side.to(sample[side.key]) : sample[side.key];
    const b = head.to ? head.to(sample[head.key]) : sample[head.key];
    return data.mutateCell(s, b, target => field.accum(target, sample[field.key]));
  }

  static simpleCubic(sample) {
    const {
      data,
      side,
      head,
      field
    } = this;
    const s = side.to ? side.to(sample[side.key]) : sample[side.key];
    const b = head.to ? head.to(sample[head.key]) : sample[head.key];
    return vectorZipper.mutazip(data.cell(s, b), field, (target, {
      key,
      accum
    }) => accum(target, sample[key]));
  }

  static nestedPivot(sample) {
    const {
      data,
      side,
      head,
      field
    } = this;
    const s = side.map(({
      key,
      to
    }) => to ? to(sample[key]) : sample[key]);
    const b = head.map(({
      key,
      to
    }) => to ? to(sample[key]) : sample[key]);
    return data.mutateCell(s, b, target => field.accum(target, sample[field.key]));
  }

  static nestedCubic(sample) {
    const {
      data,
      side,
      head,
      field
    } = this;
    const s = side.map(({
      key,
      to
    }) => to ? to(sample[key]) : sample[key]);
    const b = head.map(({
      key,
      to
    }) => to ? to(sample[key]) : sample[key]);
    return vectorZipper.mutazip(data.cell(s, b), field, (target, {
      key,
      accum
    }) => accum(target, sample[key]));
  }

} // Xr().side(s).head(b).field(data.upQueryCell(s, b)|> deco) |> says['sample']

exports.Cubic = Cubic;
