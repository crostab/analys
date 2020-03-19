export class TableSpec {
  /** @type {TableObject} */ table
  /** @type {str} */ side
  /** @type {str} */ banner
  /** @type {CubeCell[]|CubeCell} */ cell
  /** @type {Filter[]|Filter} */ filter
  /** @type {function():number} */ formula

  /**
   * @param {str} side
   * @param {str} banner
   * @param {CubeCell[]|CubeCell} [cell]
   * @param {Filter[]|Filter} [filter]
   * @param {function():number} formula - formula is valid only when cell is CubeCell array.
   */
  constructor (side, banner, cell, filter, formula) {
    Object.assign(this, { side, banner, cell, filter, formula })
  }

  /**
   * @param {str} side
   * @param {str} banner
   * @param {CubeCell[]|CubeCell} [cell]
   * @param {Filter[]|Filter} [filter]
   * @param {function():number} formula - formula is valid only when cell is CubeCell array.
   */
  static build ({ side, banner, cell, filter, formula }) {
    return new TableSpec(side, banner, cell, filter, formula)
  }

  toJson () {
    const { side, banner, cell, filter, formula } = this
    return { side, banner, cell, filter, formula }
  }
}
