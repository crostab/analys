import { arid, acid, expand } from '@analys/util-pivot'
import { ACCUM, COUNT, INCRE, SUM } from '@analys/enum-pivot-mode'

export function pivotSpread (samples, { x, y, z, filter, mode = SUM }) {
  let notate = Notate(x, y, z, mode, filter).bind(this)
  for (let sample of samples)
    notate(sample)
  return this
}

const Notate = (x, y, z, mode, filter) => {
  const spreader = Spreader(mode)
  return !filter
    ? function (r) { spreader.call(this, r[x], r[y], r[z]) }
    : function (r) { (filter(r[z]) ? spreader : expand).call(this, r[x], r[y], r[z]) }
}

export const Spreader = mode => {
  if (mode === INCRE) return function (x, y, z) { this.m[arid.call(this, x)][acid.call(this, y)] += z }
  if (mode === ACCUM) return function (x, y, z) { this.m[arid.call(this, x)][acid.call(this, y)].push(z) }
  if (mode === COUNT) return function (x, y) { this.m[arid.call(this, x)][acid.call(this, y)]++ }
  return expand
}

