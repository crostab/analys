import { expand, arid, acid, cubicSkeleton } from '@analys/util-pivot';
import { INCRE, ACCUM, COUNT } from '@analys/enum-pivot-mode';
import { mutazip } from '@vect/vector-zipper';

/**
 *
 * @param {*[][]} samples
 * @param {number} x
 * @param {number} y
 * @param {{index,mode}[]} band
 * @param filter
 * @returns {cubicSpread}
 */

function cubicSpread(samples, {
  x,
  y,
  band,
  filter
}) {
  const depth = band.length;
  const notate = createNotate(x, y, band, filter, depth).bind(this);

  for (let sample of samples) {
    notate(sample);
  }

  return this;
}

const createNotate = (x, y, band, filter, depth) => {
  band.forEach(o => {
    o.update = selectUpdater(o.mode);
  });
  return !filter ? function (sample) {
    spread.call(this, sample[x], sample[y], sample, band, depth);
  } : function (sample) {
    filter(sample) ? spread.call(this, sample[x], sample[y], sample, band, depth) : expand.call(this, sample[x], sample[y]);
  };
};

const spread = function (x, y, sample, band, depth) {
  mutazip(this.m[arid.call(this, x)][acid.call(this, y)], band, (target, {
    index,
    update
  }) => update(target, sample[index]), depth);
};

const selectUpdater = mode => {
  if (mode === INCRE) return (target, value) => target + value;
  if (mode === ACCUM) return (target, value) => (target.push(value), target);
  if (mode === COUNT) return target => target++;
  return expand;
};

/**
 *
 * @param {*[][]} samples
 * @param {number} x
 * @param {number} y
 * @param {{index,mode}[]} band
 * @param filter
 * @returns {cubicRecord}
 */

function cubicRecord(samples, {
  x,
  y,
  band,
  filter
}) {
  const depth = band.length;
  const notate = createNotate$1(x, y, band, filter, depth).bind(this);

  for (let sample of samples) {
    notate(sample);
  }

  return this;
}

const createNotate$1 = (x, y, band, filter, depth) => {
  band.forEach(o => o.update = selectUpdater$1(o.mode));
  return !filter ? function (sample) {
    record.call(this, sample[x], sample[y], sample, band, depth);
  } : function (sample) {
    if (filter(sample)) record.call(this, sample[x], sample[y], sample, band, depth);
  };
};

const record = function (x, y, sample, band, depth) {
  const {
    m,
    s,
    b
  } = this;
  let vec;
  const r = m[s.indexOf(x)];
  if (r) vec = r[b.indexOf(y)];
  if (vec) mutazip(vec, band, (target, {
    index,
    update
  }) => update(target, sample[index]), depth);
};

const selectUpdater$1 = mode => {
  if (mode === INCRE) return (target, value) => target + value;
  if (mode === ACCUM) return (target, value) => (target.push(value), target);
  if (mode === COUNT) return target => target++;
  return () => {};
};

class Cubic {
  constructor(x, y, band, filter) {
    this.data = cubicSkeleton(band);
    Object.assign(this, {
      x,
      y,
      band,
      filter
    });
  }

  static build(x, y, band, filter) {
    return new Cubic(x, y, band, filter);
  }

  get configs() {
    const {
      x,
      y,
      band,
      filter
    } = this;
    return {
      x,
      y,
      band,
      filter
    };
  }

  spread(samples) {
    return cubicSpread.call(this.data, samples, this.configs), this;
  }

  record(samples) {
    return cubicRecord.call(this.data, samples, this.configs), this;
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

export { Cubic };
