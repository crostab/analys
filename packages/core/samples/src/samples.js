import { samplesFind }   from '@analys/samples-find'
import { samplesGroup }  from '@analys/samples-group'
import { samplesPivot }  from '@analys/samples-pivot'
import { samplesSelect } from '@analys/samples-select'

export class Samples {
  constructor (samples, title, types) {
    this.data = samples
    this.title = title
    this.types = types
  }
  get length () { return this.data.length }
  static from (samples) { return new Samples(samples) }

  select (fields, { mutate = true }) {
    const data = samplesSelect.call(this.data, fields)
    return mutate ? this.boot({ data, types: [] }) : this.copy({ data, types: [] })
  }

  find (filter, { mutate = true }) {
    const data = samplesFind.call(this.data, filter)
    return mutate ? this.boot({ data }) : this.copy({ data })
  }

  group (configs) { return Samples.from(samplesGroup.call(this.data, configs)) }
  crosTab (tablespec) { return samplesPivot.call(this.data, tablespec) }

  /** @returns {Samples} */
  boot ({ data, types } = {}, mutate) {
    if (mutate) {
      if (data) this.data = data
      if (types) this.types = types
      return this
    } else {
      return this.copy({ types, head, data })
    }
  }

  /** @returns {Samples} */
  copy ({ data, types } = {}) {
    if (!data) data = this.data.map(sample => Object.assign({}, sample))
    if (!types) types = this.types?.slice()
    return new Samples(data, this.title, types)
  }
}
