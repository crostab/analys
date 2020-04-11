import { INCRE, COUNT } from '@analys/enum-pivot-mode';
import { Accrual, ampliCell } from '@analys/util-pivot';
import { mutazip } from '@vect/vector-zipper';

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

const iterate = function (vec, fn, l) {
  l = l || vec && vec.length;

  for (let i = 0; i < l; i++) fn.call(this, vec[i], i);
};

class Cubic {
  /** @type {Function} */
  constructor(x, y, fields, filter) {
    _defineProperty(this, "cell", void 0);

    this.x = x;
    this.y = y;
    this.fields = fields.map(([index, mode]) => [index, Accrual(mode, filter)]);
    const inits = fields.map(([, mode]) => mode === INCRE || mode === COUNT ? () => 0 : () => []);
    this.data = {
      s: [],
      b: [],
      m: [],
      n: () => inits.map(fn => fn())
    };
  }

  static build(x, y, fields, filter) {
    return new Cubic(x, y, fields, filter);
  }

  record(samples) {
    return this.cell = ampliCell.bind(this.data), iterate(samples, this.note.bind(this)), this;
  }

  note(sample) {
    mutazip(this.cell(sample[this.x], sample[this.y]), this.fields, (target, [index, accrue]) => accrue(target, sample[index]));
  }

  toObject() {
    const {
      s,
      b,
      m
    } = this.data;
    return {
      side: s,
      head: b,
      rows: m
    };
  }

}

export { Cubic };
