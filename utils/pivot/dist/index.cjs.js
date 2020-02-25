'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utilPivot = require('@analys/util-pivot');
var enumPivotMode = require('@analys/enum-pivot-mode');

function pivotSpread(samples, {
  x,
  y,
  z,
  filter,
  mode = enumPivotMode.SUM
}) {
  let notate = createNotate(x, y, z, mode, filter).bind(this);

  for (let sample of samples) notate(sample);

  return this;
}

const createNotate = (x, y, z, mode, filter) => {
  const record = selectSpread(mode);
  return !filter ? function (r) {
    record.call(this, r[x], r[y], r[z]);
  } : function (r) {
    (filter(r[z]) ? record : utilPivot.expand).call(this, r[x], r[y], r[z]);
  };
};

const selectSpread = mode => {
  if (mode === enumPivotMode.INCRE) return function (x, y, z) {
    this.m[utilPivot.arid.call(this, x)][utilPivot.acid.call(this, y)] += z;
  };
  if (mode === enumPivotMode.ACCUM) return function (x, y, z) {
    this.m[utilPivot.arid.call(this, x)][utilPivot.acid.call(this, y)].push(z);
  };
  if (mode === enumPivotMode.COUNT) return function (x, y) {
    this.m[utilPivot.arid.call(this, x)][utilPivot.acid.call(this, y)]++;
  };
  return utilPivot.expand;
};

function pivotRecord(samples, {
  x,
  y,
  z,
  filter,
  mode = enumPivotMode.SUM
}) {
  let notate = createNotate$1(x, y, z, mode, filter).bind(this);

  for (let sample of samples) notate(sample);

  return this;
}

const createNotate$1 = (x, y, z, mode, filter) => {
  const recorder = selectRecord(mode);
  return !filter ? function (r) {
    recorder.call(this, r[x], r[y], r[z]);
  } : function (r) {
    if (filter(r[z])) recorder.call(this, r[x], r[y], r[z]);
  };
};

const selectRecord = mode => {
  if (mode === enumPivotMode.INCRE) return function (x, y, v) {
    const {
      m,
      s,
      b
    } = this,
          row = m[s.indexOf(x)];
    if (row) row[b.indexOf(y)] += v;
  };
  if (mode === enumPivotMode.ACCUM) return function (x, y, v) {
    const {
      m,
      s,
      b
    } = this,
          row = m[s.indexOf(x)];
    if (row) row[b.indexOf(y)].push(v);
  };
  if (mode === enumPivotMode.COUNT) return function (x, y) {
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
    this.data = mode === enumPivotMode.ACCUM ? utilPivot.accumSkeleton() : utilPivot.increSkeleton();
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

exports.Pivot = Pivot;
