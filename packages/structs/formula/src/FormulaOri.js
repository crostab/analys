import { wind }   from '@vect/object-init'
import { mapper } from '@vect/vector-mapper'

export class FormulaOri {
  constructor (fields, formulae) {
    this.data = []
    this.fields = fields
    this.formulae = formulae
    this.depth = formulae.length
  }

  static build (fields, formulae) { return new FormulaOri(fields, formulae) }
  get formulaArray () { return Object.values(this.formulae) }
  get indexes () { return Object.keys(this.formulae) }

  calculate (samples) {
    const { formulaArray } = this
    this.data = mapper(samples, sample => mapper(
      formulaArray,
      fn => fn.apply(sample, mapper(this.fields, i => sample[i])),
      this.depth
    ))
    return this
  }

  toRows () { return this.data }
  toSamples () {
    const { indexes } = this
    return this.data.map(vec => wind(indexes, vec))
  }
}


