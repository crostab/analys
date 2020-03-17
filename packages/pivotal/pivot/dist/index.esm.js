import { expand, arid, acid, accumSkeleton, increSkeleton } from '@analys/util-pivot';
import { SUM, INCRE, ACCUM, COUNT } from '@analys/enum-pivot-mode';

function pivotSpread(samples, {
  x,
  y,
  z,
  filter,
  mode = SUM
}) {
  let notate = Notate(x, y, z, mode, filter).bind(this);

  for (let sample of samples) notate(sample);

  return this;
}

const Notate = (x, y, z, mode, filter) => {
  const spreader = Spreader(mode);
  return !filter ? function (r) {
    spreader.call(this, r[x], r[y], r[z]);
  } : function (r) {
    (filter(r[z]) ? spreader : expand).call(this, r[x], r[y], r[z]);
  };
};

const Spreader = mode => {
  if (mode === INCRE) return function (x, y, z) {
    this.m[arid.call(this, x)][acid.call(this, y)] += z;
  };
  if (mode === ACCUM) return function (x, y, z) {
    this.m[arid.call(this, x)][acid.call(this, y)].push(z);
  };
  if (mode === COUNT) return function (x, y) {
    this.m[arid.call(this, x)][acid.call(this, y)]++;
  };
  return expand;
};

function pivotRecord(samples, {
  x,
  y,
  z,
  filter,
  mode = SUM
}) {
  let notate = Notate$1(x, y, z, mode, filter).bind(this);

  for (let sample of samples) notate(sample);

  return this;
}

const Notate$1 = (x, y, z, mode, filter) => {
  const recorder = Recorder(mode);
  return !filter ? function (r) {
    recorder.call(this, r[x], r[y], r[z]);
  } : function (r) {
    if (filter(r[z])) recorder.call(this, r[x], r[y], r[z]);
  };
};

const Recorder = mode => {
  if (mode === INCRE) return function (x, y, v) {
    const {
      m,
      s,
      b
    } = this,
          row = m[s.indexOf(x)];
    if (row) row[b.indexOf(y)] += v;
  };
  if (mode === ACCUM) return function (x, y, v) {
    const {
      m,
      s,
      b
    } = this,
          row = m[s.indexOf(x)];
    if (row) row[b.indexOf(y)].push(v);
  };
  if (mode === COUNT) return function (x, y) {
    const {
      m,
      s,
      b
    } = this,
          row = m[s.indexOf(x)];
    if (row) row[b.indexOf(y)]++;
  };
  return () => {};
};

class Pivot {
  constructor(x, y, z, mode, filter) {
    this.data = mode === ACCUM ? accumSkeleton() : increSkeleton();
    Object.assign(this, {
      x,
      y,
      z,
      mode,
      filter
    });
  }

  static build(x, y, z, mode, filter) {
    return new Pivot(x, y, z, mode, filter);
  }

  get configs() {
    const {
      x,
      y,
      z,
      mode,
      filter
    } = this;
    return {
      x,
      y,
      z,
      mode,
      filter
    };
  }

  spread(samples) {
    return pivotSpread.call(this.data, samples, this.configs), this;
  }

  record(samples) {
    return pivotRecord.call(this.data, samples, this.configs), this;
  }

  toJson() {
    const {
      s,
      b,
      m
    } = this.data;
    return {
      side: s,
      banner: b,
      matrix: m
    };
  }

}

export { Pivot };
