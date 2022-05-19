import { DataGram }       from '@analys/data-gram'
import { nullish, valid } from '@typen/nullish'
import { mapper }         from '@vect/matrix-mapper'
import { List }           from './List'

export class ListGram extends DataGram {
  constructor(listInit = List.build) { super(listInit) }
  static build(listInit) { return new ListGram(listInit) }
  update(x, y, v) { return this.rows[this.roin(x)][this.coin(y)].push(v) }
  toObject(fn) { return { side: this.side, head: this.head, rows: mapper(this.rows, fn ?? (li => li.average)) } }
}

export class MaxGram extends DataGram {
  constructor() { super(Number.NEGATIVE_INFINITY) }
  static build() { return new MaxGram() }
  update(x, y, v) {
    const row = this.rows[this.roin(x)], yi = this.coin(y)
    if (v > row[yi]) row[yi] = v
  }
}

export class MinGram extends DataGram {
  constructor() { super(Number.POSITIVE_INFINITY) }
  static build() { return new MinGram() }
  update(x, y, v) {
    const row = this.rows[this.roin(x)], yi = this.coin(y)
    if (v < row[yi]) row[yi] = v
  }
}

export class SumGram extends DataGram {
  constructor() { super(0) }
  static build() { return new SumGram() }
  update(x, y, v) { return this.rows[this.roin(x)][this.coin(y)] += v }
}

export class CountGram extends DataGram {
  constructor() { super(0) }
  static build() { return new CountGram() }
  update(x, y, _) { return this.rows[this.roin(x)][this.coin(y)]++ }
}

export class FirstGram extends DataGram {
  constructor() { super(null) }
  static build() { return new SumGram() }
  update(x, y, v) {
    const row = this.rows[this.roin(x)], yi = this.coin(y)
    if (nullish(row[yi])) row[yi] = v
  }
}

export class LastGram extends DataGram {
  constructor() { super(null) }
  static build() { return new SumGram() }
  update(x, y, v) { if (valid(v)) this.rows[this.roin(x)][this.coin(y)] = v }
}

