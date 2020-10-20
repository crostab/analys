import { init as initVec } from '@vect/vector-init'
import { DataGram }        from '@analys/data-gram'
import { indexOfWords }    from '../helpers/indexOfWords'

export class NestGram extends DataGram {
  // /** @type {*[]} */ side
  // /** @type {*[]} */ head
  // /** @type {*[][]} */ rows
  // /** @type {Function} */ init
  constructor(init) {
    super(init)
  }

  static build(init) { return new NestGram(init) }

  // queryCell(x, y) {
  //   return (x = this.sideIndex(x)) >= 0 && (y = this.headIndex(y)) >= 0
  //     ? this.rows[x][y]
  //     : undefined
  // }
  //
  // cell(x, y) {
  //   return this.rows[this.upSideIndex(x)][this.upHeadIndex(y)]
  // }

  querySide(xs) { return indexOfWords(this.side, xs) }
  queryHead(ys) { return indexOfWords(this.head, ys) }

  indexSide(xs) {
    const ri = indexOfWords(this.side, xs)
    if (ri >= 0) return ri
    return this.rows.push(initVec(this.head.length, this.init)), ri + this.side.push(xs.slice())
  }

  indexHead(ys) {
    const ci = indexOfWords(this.head, ys)
    if (ci >= 0) return ci
    return this.rows.forEach(r => r.push(this.init())), ci + this.head.push(ys.slice())
  }
}