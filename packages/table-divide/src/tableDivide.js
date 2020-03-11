import { MUTABLE, IMMUTABLE } from '@analys/enum-mutabilities'

/**
 * @param {Object<str,function(*):boolean>} filterObject
 * @return {{includes:Table,excludes:Table}} - mutated 'this' {head, rows}
 */
export const tableDivide = function ({ includes, excludes }) {
  /** @type {Table} */
  let body = this
  if (includes && includes.length) {
    const [regenerated, body] = [
      body.spliceColumns(includes, IMMUTABLE),
      body.select(includes, MUTABLE)
    ]
    return { includes: body, excludes: regenerated }
  }
  if (excludes && includes.length) {
    const [regenerated, body] = [
      body.select(excludes, IMMUTABLE),
      body.spliceColumns(excludes, MUTABLE)
    ]
    return { includes: regenerated, excludes: body }
  }
  return { includes: body, excludes: body }
}

