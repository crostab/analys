import { init } from '@vect/vector-init'

export const ampliCell = function (side, banner) { return this.m[arid.call(this, side)][acid.call(this, banner)] }

export const arid = function (x) {
  const ri = this.s.indexOf(x)
  if (ri >= 0) return ri
  return this.m.push(init(this.b.length, this.n)), ri + this.s.push(x)
}
export const acid = function (y) {
  const ci = this.b.indexOf(y)
  if (ci >= 0) return ci
  return this.m.forEach(r => r.push(this.n())), ci + this.b.push(y)
}

