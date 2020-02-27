import { Er } from './utils/er/Er'
import { Ob } from './Ob'
import { Pivot } from './utils/pivot/Pivot'
import { PivotModes } from './utils/pivot/PivotModes'

const { isArray: isAr } = Array
/**
 *
 * @param {*[]} arr
 * @param {[*,number][]} fieldToIndex
 */
const picker = (arr, fieldToIndex) => {
  let o = {}
  for (let [k, i] of fieldToIndex) o[k] = arr[i]
  return o
}

/**
 * Transform between Json table and Json of samples.
 * A Json table is formed like :
 *  {
 *    head:[a, b, ...],
 *    rows:*[][]
 *  }.
 * A Json of samples is formed like :
 *  [
 *    {a:*, b:*, ...},
 *    {a:*, b:*, ...},
 *    ...
 *  ]
 */
export class Samples {
  /**
   *
   * @param {*[]} head
   * @param {*[][]} rows
   * @param {*[]|[*,*][]} [fields]
   * @return {Object[]}
   */
  static fromTable ({ head, rows }, fields) {
    if (!isAr(head)) throw new Er('The input \'head\' is not valid.')
    if (!isAr(rows)) throw new Er('The input \'rows\' is not valid.')
    const [row] = rows
    if (!isAr(row)) return []
    if (!isAr(fields)) {
      return rows.map(row => Ob.ini(head, row))
    } else {
      const field_ind = fields.map(x => isAr(x) ? [x[1], head.indexOf(x[0])] : [x, head.indexOf(x)])
      return rows.map(row => Ob.fromEntries(field_ind, i => row[i]))
    }
  }

  /**
   *
   * @param {Object[]} samples
   * @param {string} [title]
   * @param {string[]|[*,*][]} [fields]
   * @param {string} [h]
   * @param {string} [r]
   * @returns {null|{head:*[],rows:*[][]}}
   */
  static toTable (samples, {
    title,
    fields,
    label: {
      head: h = 'head',
      rows: r = 'rows'
    } = {}
  } = {}) {
    if (!isAr(samples)) throw new Er('The input \'rows\' is not an Array')
    const [sample] = samples
    if (typeof sample !== 'object') return Ob.of([h, []], [r, [[]]])
    if (!fields) {
      return Ob.of([h, Object.keys(sample)], [r, samples.map(Object.values)])
    } else {
      const { length } = fields, [_b, b] = [Array(length), Array(length)]
      for (let i = 0, x; i < length; i++) {
        x = fields[i];
        [_b[i], b[i]] = isAr(x) ? [x[0], x[1]] : [x, x]
      }
      return Ob.of([h, b],
        [r, samples.map(sample => Ob.selectValues(sample, _b, 0, length))]
      )
    }
  }

  /**
   *
   * @param {Object[]} samples
   * @param {*[]|[*,*][]} fields
   * @returns {Object[]}
   */
  static select (samples, fields) {
    if (!isAr(samples)) throw new Er('The input \'rows\' is not an Array')
    if (!fields?.length) return samples
    const
      { length } = fields,
      keyToNKeys = fields.map(x => isAr(x) ? [x[0], x[1]] : [x, x])
    return samples.map(sample => Ob.selectReplKeys(sample, keyToNKeys, 0, length))
  }

  /**
   *
   * @param {*[][]} matrix
   * @param {*[]} side
   * @param {*[]} banner
   * @param {string} [sideLabel]
   * @returns {Object[]}
   */
  static fromCrosTab ({ matrix, side, banner }, { sideLabel = '_' } = {}) {
    const
      sides = side.map(x => Ob.of([sideLabel, x])),
      rows = matrix.map(row => Ob.ini(banner, row)),
      { length } = sides
    for (let i = 0; i < length; i++) Object.assign(sides[i], rows[i])
    return sides
  }

  static toCrosTab (samples, { side, banner, field }, { mode = PivotModes.array, include } = {}) {
    return new Pivot(samples).pivot([side, banner, field], { mode, include })
  }
}
