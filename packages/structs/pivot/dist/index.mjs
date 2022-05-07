import { DataGram } from '@analys/data-gram';
import { modeToTally, modeToInit } from '@analys/util-pivot';
import { iterate } from '@vect/vector-mapper';

class Pivot {
  side = {};
  head = {};
  field = {};
  accum;
  data;
  /**
   *
   * @param {{key:number, to:Function?}} side
   * @param {{key:number, to:Function?}} head
   * @param {{key:number, to:number}} field
   */

  constructor(side, head, field) {
    this.side = side;
    this.head = head;
    this.field = {
      key: field.key,
      accum: modeToTally(field.to)
    };
    this.data = DataGram.build(modeToInit(field.to));
  }

  static build(sideDef, bannerDef, fieldDef) {
    return new Pivot(sideDef, bannerDef, fieldDef);
  }

  record(samples) {
    iterate(samples, note.bind(this));
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

const note = function (sample) {
  const {
    data,
    side,
    head,
    field
  } = this;
  const s = side.to ? side.to(sample[side.key]) : sample[side.key];
  const b = head.to ? head.to(sample[head.key]) : sample[head.key];
  const v = sample[field.key];
  const r = data.rows[data.indexSide(s)],
        j = data.indexHead(b);
  return r[j] = field.accum(r[j], v); // return data.mutate(s, b, x => conf.accum(x, sample[this.z]))
};

export { Pivot };
