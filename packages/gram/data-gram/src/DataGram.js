import { init as initVec } from '@vect/vector-init'

export class DataGram {
  /** @type {*[]} */ side
  /** @type {*[]} */ head
  /** @type {*[][]} */ rows
  /** @type {Function} */ init
  constructor(init) {
    this.side = []
    this.head = []
    this.rows = []
    this.init = init
  }

  static build(init) { return new DataGram(init) }

  mutateCell(x, y, fn) {
    const r = this.rows[this.indexSide(x)], j = this.indexHead(y)
    return r[j] = fn(r[j])
  }

  cell(x, y) {
    return this.rows[this.indexSide(x)][this.indexHead(y)]
  }

  indexSide(x) {
    const ri = this.side.indexOf(x)
    if (ri >= 0) return ri
    return this.rows.push(initVec(this.head.length, this.init)), ri + this.side.push(x)
  }

  indexHead(y) {
    const ci = this.head.indexOf(y)
    if (ci >= 0) return ci
    return this.rows.forEach(r => r.push(this.init())), ci + this.head.push(y)
  }

  queryCell(x, y) {
    return (x = this.querySide(x)) >= 0 && (y = this.queryHead(y)) >= 0
      ? this.rows[x][y]
      : undefined
  }

  querySide(x) { return this.side.indexOf(x) }
  queryHead(y) { return this.head.indexOf(y) }
}