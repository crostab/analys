import { acid, arid, expand } from '@analys/util-pivot'
import { ACCUM, COUNT, INCRE } from '@analys/enum-pivot-mode'
import { mutazip } from '@vect/vector-zipper'

/**
 *
 * @param {*[][]} samples
 * @param {number} x
 * @param {number} y
 * @param {{index,mode}[]} band
 * @param filter
 * @returns {cubicSpread}
 */
export function cubicSpread (samples, { x, y, band, filter }) {
  const depth = band.length
  const notate = Notate(x, y, band, filter, depth).bind(this)
  for (let sample of samples) {
    notate(sample)
  }
  return this
}

const Notate = (x, y, band, filter, depth) => {
  band.forEach(o => { o.update = Updater(o.mode) })
  return !filter
    ? function (sample) { spread.call(this, sample[x], sample[y], sample, band, depth) }
    : function (sample) {
      filter(sample)
        ? spread.call(this, sample[x], sample[y], sample, band, depth)
        : expand.call(this, sample[x], sample[y])
    }
}

const spread = function (x, y, sample, band, depth) {
  mutazip(
    this.m[arid.call(this, x)][acid.call(this, y)],
    band,
    (target, { index, update }) => update(target, sample[index]),
    depth
  )
}

const Updater = (mode) => {
  if (mode === INCRE) return (target, value) => target + value
  if (mode === ACCUM) return (target, value) => (target.push(value), target)
  if (mode === COUNT) return (target) => ++target
  return expand
}
