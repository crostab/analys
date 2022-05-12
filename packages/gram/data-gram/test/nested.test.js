import { randBetw }               from '@aryth/rand'
import { makeEmbedded }           from '@foba/util'
import { deco, decoCrostab }      from '@spare/logger'
import { says }                   from '@spare/xr'
import { strategies }             from '@valjoux/strategies'
import { head, side, updateCell } from '@vect/nested'
import { DataGram }               from '../src/DataGram'

// CrosEnt
// Correlation
// Cont / Contingent
// Pivotal
// Sparse
// Nested
// ObjectMatrix
// Ties
// Crosob
// Crosspa
// Crostab
// Crosrep
// Crospiv
// Crosco
// Contab

export class Nested {
  #init = null
  #val = null
  constructor(element) {
    element instanceof Function ? (this.#init = element) : (this.#val = element)
  }
  static build(element) { return new Nested(element) }
  clear() { for (let k in this) delete this[k] }
  get zero() { return this.#init?.call(this) ?? this.#val }
  get side() { return side(this) }
  get head() { return head(this) }
  get height() {

  }
  get weight() {

  }
  get size() {

  }
  update(x, y, v) { (this[x] ?? (this[x] = {}))[y] = v }
  cell(x, y) { return this[x] ? this[x][y] : null }
}

const nested = Nested.build()
Object.keys(nested) |> deco |> says['Object.keys']
Object.getOwnPropertyNames(nested) |> deco |> says['Object.getOwnPropertyNames']
for (let k in nested) k |> says['Symbol.iterator']

class Ch {
  static get rand() { return String.fromCharCode(randBetw(65, 90)) }
  static get hex() { return randBetw(0, 16).toString(16) }
  static get hex2() { return Ch.hex + Ch.hex }
  static get hex4() { return Ch.hex + Ch.hex + Ch.hex + Ch.hex }
}

const nested0 = {}
const nested1 = Nested.build()
const nested2 = Nested.build()
const nested3 = Nested.build()
const dataGram = DataGram.build()
const { lapse, result } = strategies({
  repeat: 1E+4,
  candidates: {
    ph: void 0
  } |> makeEmbedded,
  methods: {
    bench: () => updateCell.call(nested0, Ch.hex4, Ch.hex4, randBetw(0, 100)),
    nested1: () => nested1.update(Ch.hex4, Ch.hex4, randBetw(0, 100)),
    nested2: () => nested2.update('A', Ch.hex4, randBetw(0, 100)),
    nested3: () => nested3.update(Ch.hex4, 'A', randBetw(0, 100)),
    dataGram: () => dataGram.update(Ch.hex4, Ch.hex4, randBetw(0, 100)),
  },
})
lapse |> decoCrostab |> says['lapse']
result |> decoCrostab |> says['result']

// nested1
// nested2
// nested3