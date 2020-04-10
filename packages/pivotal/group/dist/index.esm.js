import { INCRE, COUNT } from '@analys/enum-pivot-mode';
import { iterate } from '@vect/vector-mapper';
import { mutazip } from '@vect/vector-zipper';
import { acquire } from '@vect/merge-acquire';
import { Accrual } from '@analys/util-pivot';

class Group {
  constructor(key, fields, filter) {
    this.key = key;
    this.data = {};
    this.fields = fields.map(([index, mode]) => [index, Accrual(mode)]);
    const inits = fields.map(([, mode]) => mode === INCRE || mode === COUNT ? () => 0 : () => []);

    this.init = () => inits.map(fn => fn());

    this.filter = filter;
    this.depth = fields.length;
  }

  static build(key, fields, filter) {
    return new Group(key, fields, filter);
  }

  record(samples) {
    return iterate(samples, this.note.bind(this)), this;
  }

  note(sample) {
    const key = sample[this.key];
    mutazip(key in this.data ? this.data[key] : this.data[key] = this.init(), this.fields, (target, [index, accrue]) => accrue(target, sample[index]));
  }

  toJson() {
    return this.data;
  }

  toRows() {
    return Object.entries(this.data).map(([key, value]) => acquire([key], value));
  }

}

export { Group };
