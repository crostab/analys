import { INCRE, COUNT } from '@analys/enum-pivot-mode';
import { Accrual } from '@analys/util-pivot';
import { acquire } from '@vect/merge-acquire';
import { pair, wind } from '@vect/object-init';
import { mapper, iterate } from '@vect/vector-mapper';
import { mutazip } from '@vect/vector-zipper';

class Group {
  constructor(key, fields, pick, filter) {
    this.key = key;
    this.data = {};
    this.fields = fields.map(([index, mode]) => [index, Accrual(mode)]);
    const inits = fields.map(([, mode]) => mode === INCRE || mode === COUNT ? () => 0 : () => []),
          depth = inits.length;

    this.init = () => mapper(inits, fn => fn(), depth);

    this.pick = pick;
    this.filter = filter;
  }

  static build(key, fields, pick, filter) {
    return new Group(key, fields, pick, filter);
  }

  get indexes() {
    return this.fields.map(([index]) => index);
  }

  record(samples) {
    return iterate(samples, this.note.bind(this)), this;
  }

  note(sample) {
    let key = sample[this.key];
    if (this.pick) key = this.pick(key);
    mutazip(key in this.data ? this.data[key] : this.data[key] = this.init(), this.fields, (target, [index, accrue]) => accrue(target, sample[index]));
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
