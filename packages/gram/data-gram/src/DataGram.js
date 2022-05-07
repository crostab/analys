import { collect } from '@vect/vector-init'

const ZERO = 'zero'

export class DataGram {
  /** @type {*[]}      */ side = []
  /** @type {*[]}      */ head = []
  /** @type {*[][]}    */ rows = []
  /** @type {function} */ init = null
  /** @type {*}        */ val = null
  constructor(element) {
    element instanceof Function ? (this.init = element) : (this.val = element)
  }
  static build(element) { return new DataGram(element) }

  get zero() { return this.init?.call(this) ?? this.val }

  roflex(x) {
    const i = this.side.indexOf(x)
    if (~i) return i
    this.rows.push(collect.call(this, ZERO, this.head.length))
    return i + this.side.push(x)
  }
  coflex(y) {
    const i = this.head.indexOf(y)
    if (~i) return i
    for (let row of this.rows) row.push(this.zero)
    return i + this.head.push(y)
  }

  update(x, y, v) { return this.rows[this.roflex(x)][this.coflex(y)] = v }
  append(x, y, v) { return this.rows[this.roflex(x)][this.coflex(y)].push(v) }
  assign(x, y, k, v) { return this.rows[this.roflex(x)][this.coflex(y)][k] = v }
  mutate(x, y, fn) {
    const row = this.rows[this.roflex(x)], coin = this.coflex(y)
    return row[coin] = fn(row[coin])
  }
  cell(x, y) { return this.rows[this.roflex(x)][this.coflex(y)] }
  query(x, y) { return ~(x = this.side.indexOf(x)) && ~(y = this.head.indexOf(y)) ? this.rows[x][y] : void 0 }
}