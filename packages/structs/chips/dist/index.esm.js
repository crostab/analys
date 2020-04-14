import { MERGE, ACCUM, INCRE, COUNT } from '@analys/enum-pivot-mode';
import { tallyMerge, tallyAccum } from '@analys/util-pivot';
import { wind } from '@vect/object-init';
import { iterate } from '@vect/vector-mapper';

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

class Chips {
  /** @type {*} */

  /** @type {*} */

  /** @type {Object} */

  /** @type {Function} */

  /** @type {Function} */

  /** @type {Function} */
  constructor(key, field, mode, pick, filter) {
    _defineProperty(this, "key", void 0);

    _defineProperty(this, "field", void 0);

    _defineProperty(this, "data", {});

    _defineProperty(this, "pick", void 0);

    _defineProperty(this, "updater", void 0);

    _defineProperty(this, "filter", void 0);

    this.key = key;
    this.field = field;
    this.updater = Updater(this.data, mode);
    this.pick = pick;
    this.filter = filter;
  }

  static build(key, field, mode, pick, filter) {
    return new Chips(key, field, mode, pick, filter);
  }

  record(samples) {
    return iterate(samples, this.note.bind(this)), this;
  }

  note(sample) {
    let key = sample[this.key];
    if (this.pick) key = this.pick(key);
    this.updater(key, sample[this.field]);
  }

  toObject() {
    return this.data;
  }

  toRows() {
    return Object.entries(this.data);
  }

  toSamples() {
    const head = [this.key, this.field];
    return Object.entries(this.data).map(ent => wind(head, ent));
  }

}
const Updater = (data, mode) => {
  if (mode === MERGE) return function (k, v) {
    if (k in this) {
      tallyMerge(this[k], v);
    } else {
      this[k] = v.slice();
    }
  }.bind(data);
  if (mode === ACCUM) return function (k, x) {
    if (k in this) {
      tallyAccum(this[k], x);
    } else {
      this[k] = [x];
    }
  }.bind(data);
  if (mode === INCRE) return function (k, n) {
    if (k in this) {
      this[k] += n;
    } else {
      this[k] = n;
    }
  }.bind(data);
  if (mode === COUNT) return function (k) {
    if (k in this) {
      this[k]++;
    } else {
      this[k] = 1;
    }
  }.bind(data);
  return () => {};
};

export { Chips };
