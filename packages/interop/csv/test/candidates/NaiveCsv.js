import { tableToSamples } from '@analys/convert'
import { transpose }      from '@vect/matrix-algebra'
import { decode }         from 'iconv-lite'
import { parseCsvMap }    from './parseCsvMap'
import { parseCsvReg }    from './parseCsvReg'
import { popBlank }       from './popBlank'

export class NaiveCsv {
  /**
   *
   * @param {string|*} csvText
   * @param {string} [de=',']
   * @param {string} [lf='\x\n']
   * @param {string?} [qt]
   * @param {string?} [decode]
   * @param {boolean} [transpose]
   * @param {boolean} [popBlank]
   * @returns {*[][]}
   */
  static toRows(csvText, {
    de = ',',
    lf = '\r\n', // lf not applicable if qt is specified
    qt = '\"',
    decode: dc,
    transpose: tp,
    popBlank: pb
  } = {}) {
    if (dc) csvText = decode(csvText, dc)
    let mx = qt
      ? parseCsvReg(csvText, de, qt)
      : parseCsvMap(csvText, de, lf)
    if (tp) mx = pb
      ? transpose(popBlank(mx))
      : transpose(mx)
    return pb
      ? popBlank(mx)
      : mx
  }

  /**
   *
   * @param {string|*} csvText
   * @param {string} [de=',']
   * @param {string} [lf='\x\n']
   * @param {string?} [qt]
   * @param {string?} [decode]
   * @param {boolean} [transpose]
   * @param {boolean} [popBlank]
   * @param {string} [title]
   * @returns {{head, rows, title}}
   */
  static toTable(csvText, {
    de = ',',
    lf = '\r\n',
    qt,
    decode,
    transpose,
    popBlank,
    title
  } = {}) {
    const
      rows = NaiveCsv.toRows(csvText, { de, lf, qt, decode, transpose, popBlank }),
      head = rows.shift()
    return { head, rows, title }
  }

  /**
   *
   * @param {string|*} csvText
   * @param {string} [de=',']
   * @param {string} [lf='\x\n']
   * @param {string?} [qt]
   * @param {string?} [decode]
   * @param {boolean} [transpose]
   * @param {boolean} [popBlank]
   * @param {string} [title]
   * @returns {Object[]}
   */
  static toSamples(csvText, {
    de = ',', lf = '\r\n', qt,
    transpose, decode, popBlank
  } = {}) {
    const
      rows = NaiveCsv.toRows(csvText, { de, lf, qt, decode, transpose, popBlank }),
      head = rows.shift()
    return tableToSamples({ head, rows })
  }
}
