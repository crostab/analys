import { modeToInit, arid, acid, modeToTally } from '@analys/util-pivot';

const iterate = function (vec, fn, l) {
  l = l || vec && vec.length;

  for (let i = 0; i < l; i++) fn.call(this, vec[i], i);
};

class Pivot {
  /**
   *
   * @param x
   * @param [xmap]
   * @param y
   * @param [ymap]
   * @param z
   * @param mode
   * @param [filter]
   */
  constructor([x, xmap], [y, ymap], [z, mode], filter) {
    this.data = {
      s: [],
      b: [],
      m: [],
      n: modeToInit(mode)
    };
    this.arid = arid.bind(this.data);
    this.acid = acid.bind(this.data);
    this.x = x;
    this.xm = xmap;
    this.y = y;
    this.ym = ymap;
    this.z = z;
    this.tally = modeToTally(mode);
    this.filter = filter;
  }

  static build([x, xmap], [y, ymap], [z, mode], filter) {
    return new Pivot([x, xmap], [y, ymap], [z, mode], filter);
  }

  record(samples) {
    return iterate(samples, this.note.bind(this)), this;
  }

  note(sample) {
    const sk = this.xm ? this.xm(sample[this.x]) : sample[this.x];
    const bk = this.ym ? this.ym(sample[this.y]) : sample[this.y];
    const row = this.data.m[this.arid(sk)],
          ci = this.acid(bk);
    row[ci] = this.tally(row[ci], sample[this.z]);
  }

  toObject() {
    return {
      side: this.data.s,
      head: this.data.b,
      rows: this.data.m
    };
  }

}

export { Pivot };
