import { modeToInit, modeToTally } from '@analys/util-pivot';
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

  /**
   *
   * @param key
   * @param [to]
   * @param field
   * @param mode
   * @param [filter]
   */
  constructor([key, to], [field, mode], filter) {
    _defineProperty(this, "key", void 0);

    _defineProperty(this, "field", void 0);

    _defineProperty(this, "data", {});

    _defineProperty(this, "to", void 0);

    _defineProperty(this, "updater", void 0);

    _defineProperty(this, "filter", void 0);

    this.key = key;
    this.to = to;
    this.field = field;
    this.init = modeToInit(mode);
    this.accum = modeToTally(mode);
    this.filter = filter;
  }

  static build([key, to], [field, mode], filter) {
    return new Chips([key, to], [field, mode], filter);
  }

  record(samples) {
    return iterate(samples, this.note.bind(this)), this;
  }

  note(sample) {
    const key = this.to ? this.to(sample[this.key]) : sample[this.key];
    const target = key in this.data ? this.data[key] : this.data[key] = this.init();
    this.data[key] = this.accum(target, sample[this.field]);
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

export { Chips };
