import { DataGram }                from '@analys/data-gram'
import { NestGram }                from '@analys/nest-gram'
import { modeToInit, modeToTally } from 'archive/util-pivot'
import { iterate }                 from '@vect/vector-mapper'
import { mutazip }                 from '@vect/vector-zipper'

export class Cubic {
  side
  head
  field
  accum
  data
  /** @type {Function} */ cell

  /**
   *
   * @param {{key:number, to:Function?}[]} side
   * @param {{key:number, to:Function?}[]} head
   * @param {{key:number, to:number}[]} field
   */
  constructor(side, head, field) {
    if (side.length === 1 && head.length === 1) {
      this.nested = false;
      [this.side] = side;
      [this.head] = head
    } else {
      this.nested = true
      this.side = side
      this.head = head
    }
    if (field.length === 1) {
      this.cubic = false
      const [_field] = field
      this.field = { key: _field.key, accum: modeToTally(_field.to) }
      this.data = (this.nested ? NestGram : DataGram).build(modeToInit(_field.to))
    } else {
      this.cubic = true
      const initList = field.map(({ to }) => modeToInit(to))
      this.field = field.map(({ key, to }) => ({ key, accum: modeToTally(to) }))
      this.data = (this.nested ? NestGram : DataGram).build(() => initList.map(fn => fn()))
    }
  }

  static build(side, head, field) { return new Cubic(side, head, field) }

  record(samples) {
    iterate(samples, Notes.init(this.nested, this.cubic, this))
    if (this.nested) {
      const { side, head, data } = this
      if (side.length === 1) data.side = data.side.map(([label]) => label)
      if (head.length === 1) data.head = data.head.map(([label]) => label)
    }
    return this
  }

  toObject() {
    const { side, head, rows } = this.data
    return { side, head, rows }
  }
}

class Notes {
  static init(nested, cubic, thisArg) {
    return nested
      ? cubic
        ? Notes.nestedCubic.bind(thisArg)
        : Notes.nestedPivot.bind(thisArg)
      : cubic
        ? Notes.simpleCubic.bind(thisArg)
        : Notes.simplePivot.bind(thisArg)
  }
  static simplePivot(sample) {
    const { data, side, head, field } = this
    const s = side.to ? side.to(sample[side.key]) : sample[side.key]
    const b = head.to ? head.to(sample[head.key]) : sample[head.key]
    return data.mutate(s, b, target => field.accum(target, sample[field.key]))
  }
  static simpleCubic(sample) {
    const { data, side, head, field } = this
    const s = side.to ? side.to(sample[side.key]) : sample[side.key]
    const b = head.to ? head.to(sample[head.key]) : sample[head.key]
    return mutazip(data.cell(s, b), field, (target, { key, accum }) => accum(target, sample[key]))
  }
  static nestedPivot(sample) {
    const { data, side, head, field } = this
    const s = side.map(({ key, to }) => to ? to(sample[key]) : sample[key])
    const b = head.map(({ key, to }) => to ? to(sample[key]) : sample[key])
    return data.mutate(s, b, target => field.accum(target, sample[field.key]))
  }
  static nestedCubic(sample) {
    const { data, side, head, field } = this
    const s = side.map(({ key, to }) => to ? to(sample[key]) : sample[key])
    const b = head.map(({ key, to }) => to ? to(sample[key]) : sample[key])
    return mutazip(data.cell(s, b), field, (target, { key, accum }) => accum(target, sample[key]))
  }
}

// Xr().side(s).head(b).field(data.upQueryCell(s, b)|> deco) |> says['sample']
