import { Ar, Mx }     from 'veho'
import { PivotModes } from './PivotModes'
import { PivotUtils } from './PivotUtils'
import { ACCUM }      from '@analys/enum-pivot-mode'

const { select, map: mapAr } = Ar
let s, b, mx
const { nullifierLauncher, pivotMode } = PivotUtils

export class PivotVeho {

  constructor (mode = PivotModes.array) {
    /**
     * @field {*[]} s
     * @field {*[]} b
     * @field {*[][]} mx
     * @field {function():(Array|number)} nf
     */
    this.reboot(mode)
  }

  reboot () {
    this.side = []
    this.head = []
    this.mx = []
  }

  clearMatrix (mode) {
    this.mx = Mx.ini(this.side?.length, this.head?.length, nullifierLauncher(mode))
  }

  x (x) {
    return this.side.indexOf(x)
  }

  y (y) {
    return this.head.indexOf(y)
  }

  /**
   * Expand the side, 's' and the structs, 'mx'.
   * @param {*} x
   * @param {function():[]|function():number} nf
   * @returns {number}
   * @private
   */
  rAmp (x, nf) {
    ({ s, mx } = this)
    mx.length ? mx.push(mx[0].map(nf)) : mx.push([])
    return s.push(x)
  }

  /**
   * Expand the banner, 'b' and the structs, 'mx'.
   * @param {*} y
   * @param {function():[]|function():number} nf
   * @returns {number}
   * @private
   */
  cAmp (y, nf) {
    ({ b, mx } = this)
    for (let i = mx.length - 1; i >= 0; i--) mx[i].push(nf())
    return b.push(y)
  }

  xAmp (x, nf) {
    let i = this.side.indexOf(x)
    if (i < 0) i += this.rAmp(x, nf)
    return i
  }

  yAmp (y, nf) {
    let j = this.head.indexOf(y)
    if (j < 0) j += this.cAmp(y, nf)
    return j
  }

  amp (x, y, nf) {
    this.xAmp(x, nf)
    this.yAmp(y, nf)
  }

  add (x, y, v) {
    this.mx[this.x(x)][this.y(y)] += v
  }

  pile (x, y, v) {
    this.mx[this.x(x)][this.y(y)].push(v)
  }

  addAmp (x, y, v, nf) {
    this.mx[this.xAmp(x, nf)][this.yAmp(y, nf)] += v
  }

  pileAmp (x, y, v, nf) {
    this.mx[this.xAmp(x, nf)][this.yAmp(y, nf)].push(v)
  }

  isomorph ([x, y], vs, modes, hi) {
    const vec = this.mx[this.x(x)][this.y(y)]
    for (--hi; hi >= 0b0; hi--) !modes[hi] ? vec[hi].push(vs[hi]) : vec[hi] += modes[hi] - 1 ? 1 : vs[hi]
  }

  isomorphAmp ([x, y], vs, modes, hi, nf) {
    const vec = this.mx[this.xAmp(x, nf)][this.yAmp(y, nf)]
    for (--hi; hi >= 0b0; hi--) !modes[hi] ? vec[hi].push(vs[hi]) : vec[hi] += modes[hi] - 1 ? 1 : vs[hi]
  }

  accumLauncher (mode = PivotModes.array, boot = true, include) {
    let fn
    const accum = this[(!mode ? 'pile' : 'add') + (boot ? 'Amp' : '')].bind(this)
    const nf = boot ? nullifierLauncher(mode) : undefined
    if (typeof include === 'function') {
      fn = (mode === PivotModes.count)
        ? ([x, y, v]) => {include(v) ? accum(x, y, 1, nf) : this.amp(x, y, nf)}
        : ([x, y, v]) => {include(v) ? accum(x, y, v, nf) : this.amp(x, y, nf)}
    } else {
      fn = (mode === PivotModes.count)
        ? ([x, y,]) => accum(x, y, 1, nf)
        : ([x, y, v]) => accum(x, y, v, nf)
    }
    return (row, indexes) => fn(select(row, indexes, 3))
  }

  isomorphLauncher (modes, boot = true) {
    let nf
    const hi = modes.length
    if (boot) {
      const nfs = mapAr(modes, nullifierLauncher, hi)
      nf = () => mapAr(nfs, fn => fn(), hi)
    }
    const accums = this['isomorph' + (boot ? 'Amp' : '')].bind(this)
    return (row, [x, y], vs) => accums(
      select(row, [x, y], 2),
      select(row, vs, hi),
      modes, hi, nf
    )
  }

  spreadPivot (rows, { x, y, z, mode, filter }) {return this.pivot(rows, [x, y, z], { mode, filter })}
  recordPivot (rows, { x, y, z, mode, filter }) {return this.pivot(rows, [x, y, z], { mode, boot: false, filter })}
  spreadCubic (rows, { x, y, band, filter }) {return this.pivotMulti(rows, [x, y], band, { filter })}
  recordCubic (rows, { x, y, band, filter }) {return this.pivotMulti(rows, [x, y], band, { boot: false, filter })}

  pivot (rows, [x, y, v], { mode = PivotModes.array, boot = true, filter } = {}) {
    if (boot) { this.reboot() } else { this.clearMatrix(mode) }
    const
      { s, b, mx } = this,
      accum = this.accumLauncher(mode, boot, filter)
    for (let i = 0, { length } = rows; i < length; i++)
      accum(rows[i], [x, y, v])
    return { side: s, banner: b, matrix: mx }
  }

  /**
   *
   * @param {*[][]} rows
   * @param {number} x
   * @param {number} y
   * @param {[string,string|function][]} cells - Array of [fieldIndex, stat]
   * @param {boolean} [boot]
   * @param {function} [filter]
   * @returns {{side: *, banner: *, structs: *}}
   */
  pivotMulti (rows, [x, y], cells, { boot = true, filter } = {}) {
    if (boot) { this.reboot() } else {this.clearMatrix(mode)}
    const hi = cells.length, vs = Array(hi), modes = Array(hi), arStatQueue = []
    let i = 0
    for (let { index, mode } of cells) {
      vs[i++] = index
      mode = pivotMode(mode)
      if (mode === ACCUM) arStatQueue.push([i, mode])
      modes[i] = mode
    }
    // for (let i = 0, stat, mode; i < hi; i++) {
    //   ([vs[i], stat] = cells[i])
    //   mode = pivotMode(stat)
    //   if (mode === ACCUM) arStatQueue.push([i, stat])
    //   modes[i] = mode
    // }
    const accumVec = this.isomorphLauncher(modes, boot), hiSQ = arStatQueue.length
    for (let i = 0, l = rows.length; i < l; i++) accumVec(rows[i], [x, y], vs)
    if (hiSQ) {
      this.mx = Mx.map(this.mx, vec => {
        mapAr(arStatQueue, ([i, stat]) => { vec[i] = stat(vec[i])}, hiSQ)
        return vec
      })
    }
    return { side: this.side, banner: this.head, matrix: this.mx }
  }
}
