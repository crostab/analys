import { modeToTally, modeToInit } from '@analys/util-pivot';
import { acquire } from '@vect/vector-merge';
import { pair, wind } from '@vect/object-init';
import { mapper, iterate } from '@vect/vector-mapper';
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

class Group {
  /** @type {*} */

  /** @type {Object} */

  /** @type {Array} */

  /** @type {Function} */

  /** @type {Function} */

  /** @type {Function} */

  /** @type {Array} */

  /**
   *
   * @param key
   * @param [pick]
   * @param fields
   * @param [filter]
   * @param [aliases]
   */
  constructor([key, pick], fields, filter, aliases) {
    _defineProperty(this, "key", void 0);

    _defineProperty(this, "data", {});

    _defineProperty(this, "fields", void 0);

    _defineProperty(this, "init", void 0);

    _defineProperty(this, "pick", void 0);

    _defineProperty(this, "filter", void 0);

    _defineProperty(this, "aliases", void 0);

    this.key = key;
    this.pick = pick;
    this.fields = fields.map(([index, mode]) => [index, modeToTally(mode)]);
    const inits = fields.map(([, mode]) => modeToInit(mode)),
          depth = inits.length;

    this.init = () => mapper(inits, fn => fn(), depth);

    this.filter = filter;
    this.aliases = aliases;
  }

  static build(p) {
    return new Group(p.key, p.fields, p.filter, p.aliases);
  }

  get indexes() {
    return this.fields.map(([index]) => index);
  }

  record(samples) {
    return iterate(samples, this.note.bind(this)), this;
  }

  note(sample) {
    const key = this.pick ? this.pick(sample[this.key]) : sample[this.key];
    mutazip(key in this.data ? this.data[key] : this.data[key] = this.init(), this.fields, (target, [index, tally]) => tally(target, sample[index]));
  }

  toObject() {
    return this.data;
  }

  toRows() {
    return Object.entries(this.data).map(([key, vec]) => acquire([key], vec));
  }

  toSamples() {
    const {
      indexes
    } = this;
    return Object.entries(this.data).map(([key, sample]) => Object.assign(pair(this.key, key), wind(indexes, sample)));
  }

}

export { Group };
