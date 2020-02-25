import { clone, Mx } from 'veho'
import { sortKeyedVectors } from '@analys/util-pivot'
import { NUM_ASC, STR_ASC } from '@aryth/comparer'
import { mapper, mutate } from '@vect/vector-mapper'
import { select } from '@vect/vector-select'
import { zipper } from '@vect/vector-zipper'
import { unwind } from '@vect/entries-unwind'
import { transpose, ROWWISE, COLUMNWISE } from '@vect/matrix'
import { init as initMatrix } from '@vect/matrix-init'
import { mapper as mapperMatrix } from '@vect/matrix-mapper'
import { mutate as mutateColumn } from '@vect/column-mapper'
import { column } from '@vect/column-getter'
import { select as selectColumns } from '@vect/columns-select'
import { mapper as mapperColumns } from '@vect/columns-mapper'
import {
  push as pushColumn, pop as popColumn, shift as shiftColumn, unshift as unshiftColumn
} from '@vect/columns-update'
import { wind as windOb } from '@vect/object-init'

/**
 * A number, or a string containing a number.
 * @typedef {(number|string)} str
 * @typedef {{field:str,mode:number,filter:}} CubeCell
 * @typedef {{field:str,filter:function(*):boolean}} Filter
 * @typedef {{
 *  side:string,
 *  head:string,
 *  filter:Filter[]|Filter,
 *  cell:CubeCell[]|CubeCell,
 *  formula:function():number,
 * }} TableSpec
 */

/**
 *
 */
export class CrosTab {
  /** @type {*[]} */ side
  /** @type {*[]} */ banner
  /** @type {*[][]} */ matrix
  /** @type {string} */ title

  /**
   *
   * @param {*[]} side
   * @param {*[]} banner
   * @param {*[][]} matrix
   * @param {string} [title]
   */
  constructor (side, banner, matrix, title) {
    this.side = side
    this.banner = banner
    this.matrix = matrix
    this.title = title || ''
  }

  /**
   * Shallow copy
   * @param {*[]} side
   * @param {*[]} banner
   * @param {*[][]} matrix
   * @param {string} [title]
   * @return {CrosTab}
   */
  static from ({ side, banner, matrix, title }) {
    return new CrosTab(side, banner, matrix, title)
  }

  /**
   * Shallow copy
   * @param {*[]} side
   * @param {*[]} banner
   * @param {function(number,number):*} func
   * @param {string} [title]
   * @return {CrosTab}
   */
  static init ({ side, banner, func, title }) {
    const matrix = initMatrix(side?.length, banner?.length, (x, y) => func(x, y))
    return CrosTab.from({ side, banner, matrix, title })
  }

  /**
   *
   * @param {number} direct - rowwise:1, columnwise:2
   * @param {*[]|boolean} [sideLabels]
   * @param {*[]|boolean} [bannerLabels]
   * @returns {*}
   */
  toSamples ({ direct = ROWWISE, side: sideLabels, banner: bannerLabels }) {
    const { side, banner, matrix } = this.select({ side: sideLabels, banner: bannerLabels, mutate: false })
    if (direct === ROWWISE) {
      const samples = mapper(matrix, row => windOb(banner, row))
      return zipper(side, samples, (label, samples) => Object.assign({ index: label }, samples))
    }
    if (direct === COLUMNWISE) {
      const samples = mapperColumns(matrix, column => windOb(side, column))
      return zipper(banner, samples, (label, samples) => Object.assign({ index: label }, samples))
    }
    return []
  }

  get toJson () {
    return {
      side: this.side.slice(),
      banner: this.banner.slice(),
      matrix: this.matrix |> clone,
      title: this.title
    }
  }

  /** @returns {*[][]} */
  get columns () { return transpose(this.matrix) }
  get size () { return [this.ht, this.wd] }
  get ht () { return this.side?.length }
  get wd () { return this.banner?.length }
  roin (r) { return this.side.indexOf(r) }
  coin (c) { return this.banner.indexOf(c) }
  cell (r, c) { return (r = this.row(this.roin(r))) ? r[this.coin(c)] : null }
  element (x, y) { return this.matrix[x][y] }
  coordinate (r, c) { return { x: this.roin(r), y: this.coin(c) } }
  row (r) { return this.matrix[this.roin(r)] }
  column (c) { return column(this.matrix, this.coin(c), this.ht) }
  setRow (r, row) { return this.matrix[this.roin(r)] = row, this }
  setRowBy (r, fn) { return mutate(this.row(r), fn, this.wd), this }
  setColumn (c, column) { return mutateColumn(this.matrix, this.coin(c), (_, i) => column[i], this.ht), this }
  setColumnBy (c, fn) { return mutateColumn(this.matrix, this.coin(c), fn, this.ht), this }

  map (fn, { mutate = true } = {}) {
    return this.boot(mutate, { matrix: mapperMatrix(this.matrix, fn, this.ht, this.wd) })
  }
  mapSide (fn, { mutate = true } = {}) { return this.boot(mutate, { side: mapper(this.side, fn) }) }
  mapBanner (fn, { mutate = true } = {}) { return this.boot(mutate, { banner: mapper(this.banner, fn) }) }

  pushRow (label, row) { return this.side.push(label), this.matrix.push(row), this }
  unshiftRow (label, row) { return this.side.unshift(label), this.matrix.unshift(row), this }
  pushColumn (label, col) { return this.banner.push(label), pushColumn(this.matrix, col), this }
  unshiftColumn (label, col) { return this.banner.unshift(label), unshiftColumn(this.matrix, col), this }
  popRow () { return this.matrix.pop() }
  shiftRow () { return this.matrix.shift() }
  popColumn () { return popColumn(this.matrix) }
  shiftColumn () { return shiftColumn(this.matrix) }

  /**
   *
   * @param {str|[*,*]} [label]
   * @returns {[str,number]}
   */
  lookUpSideIndex (label) {
    if (!Array.isArray(label)) return [label, this.coin(label)]
    let [currS, newS] = label
    return [newS, this.roin(currS)]
  }

  /**
   *
   * @param {(str|[*,*])[]} sides
   * @returns {[str,number][]}
   */
  lookUpSideIndexes (sides) { return mapper(sides, this.lookUpSideIndex.bind(this)) }

  /**
   *
   * @param {str|[*,*]} [label]
   * @returns {[str,number]}
   */
  lookUpBannerIndex (label) {
    if (!Array.isArray(label)) return [label, this.coin(label)]
    let [currB, newB] = label
    return [newB, this.roin(currB)]
  }

  /**
   *
   * @param {(str|[*,*])[]} banners
   * @returns {[str,number][]}
   */
  lookUpBannerIndexes (banners) { return mapper(banners, this.lookUpBannerIndex.bind(this)) }

  selectRows (sideLabels, mutate = false) {
    const sideIndexes = this.lookUpSideIndexes(sideLabels)
    const [side, indexes] = unwind(sideIndexes)
    const matrix = select(this.matrix, indexes, this.ht)
    return this.boot(mutate, { matrix, side })
  }
  selectColumns (bannerLabels, mutate = false) {
    const bannerIndexes = this.lookUpBannerIndexes(bannerLabels)
    const [banner, indexes] = unwind(bannerIndexes)
    const matrix = selectColumns(this.matrix, indexes)
    return this.boot(mutate, { matrix, banner })
  }
  select ({ side: sideLabels, banner: bannerLabels, mutate = false } = {}) {
    let { matrix, side, banner } = this, indexes
    if (sideLabels?.length) {
      let sideIndexes = this.lookUpSideIndexes(sideLabels);
      ([side, indexes] = unwind(sideIndexes))
      matrix = select(matrix, indexes, this.ht)
    }
    if (bannerLabels?.length) {
      const bannerIndexes = this.lookUpBannerIndexes(bannerLabels);
      ([banner, indexes] = unwind(bannerIndexes))
      matrix = selectColumns(matrix, indexes)
    }
    return this.boot(mutate, { matrix, side, banner })
  }

  slice ({ top, bottom, left, right, mutate = true } = {}) {
    let { side: s, banner: b, matrix: mx } = this
    if (top || bottom) s = s.slice(top, bottom), mx = mx.slice(top, bottom)
    if (left || right) b = b.slice(left, right), mx = mx.map(row => row.slice(left, right))
    return this.boot(mutate, { matrix: mx, side: s, banner: b })
  }

  sort ({ direct = ROWWISE, field, comparer = NUM_ASC, mutate = false } = {}) {
    let { side, banner, matrix } = this
    if (direct === ROWWISE) {
      [side, matrix] = sortKeyedVectors(side, matrix, comparer, this.coin(field))
      return this.boot(mutate, { matrix, side, banner })
    }
    if (direct === COLUMNWISE) {
      [banner, matrix] = sortKeyedVectors(banner, transpose(matrix), comparer, this.roin(field))
      return this.boot(mutate, { matrix: transpose(matrix), side, banner })
    }
    return this.boot(mutate)
  }

  sortByLabels ({ direct = ROWWISE, comparer = STR_ASC, mutate = false }) {
    let { side, banner, matrix } = this
    if (direct === ROWWISE) {
      [side, matrix] = sortKeyedVectors(side, matrix, comparer)
      return this.boot(mutate, { matrix, side, banner })
    }
    if (direct === COLUMNWISE) {
      [banner, matrix] = sortKeyedVectors(banner, transpose(matrix), comparer)
      return this.boot(mutate, { matrix: transpose(matrix), side, banner })
    }
    return this.boot(mutate)
  }

  transpose (newTitle, { mutate = true } = {}) {
    const { banner: side, side: banner, columns: matrix } = this
    return this.boot(mutate, { matrix, side, banner })
  }

  boot (mutate, { matrix, side, banner } = {}) {
    return (mutate) ? this.reboot(matrix, side, banner) : this.clone(matrix, side, banner)
  }

  /**
   *
   * @param {*[][]} [matrix]
   * @param {*[]} [side]
   * @param {*[]} [banner]
   * @returns {CrosTab}
   */
  reboot (matrix, side, banner) {
    if (matrix) this.matrix = matrix
    if (side) this.side = side
    if (banner) this.banner = banner
    return this
  }

  /**
   * Shallow copy
   * @param {*[][]} [matrix]
   * @param {*[]} [side]
   * @param {*[]} [banner]
   * @return {CrosTab}
   */
  clone (matrix, side, banner) {
    return new CrosTab(
      side || this.side.slice(),
      banner || this.banner.slice(),
      matrix || Mx.clone(this.matrix),
      this.title
    )
  }
}
