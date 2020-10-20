import { init } from '@vect/vector-init'


export const ampliCell = function (side, banner) { return this.rows[arid.call(this, side)][acid.call(this, banner)] }

export const arid = function (x) {
  const ri = this.side.indexOf(x)
  if (ri >= 0) return ri
  return this.rows.push(init(this.head.length, this.init)), ri + this.side.push(x)
}
export const acid = function (y) {
  const ci = this.head.indexOf(y)
  if (ci >= 0) return ci
  return this.rows.forEach(r => r.push(this.init())), ci + this.head.push(y)
}

