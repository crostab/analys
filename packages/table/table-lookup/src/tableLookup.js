/**
 * @param {Object<str,function(*):boolean>} filterObject
 * @return {Table|TableObject} - mutated 'this' {head, rows}
 */
export const tableLookup = function (filterObject) {
  for (let field in filterObject)
    if (filterObject.hasOwnProperty(field))
      tableFindOnce.call(this, field, filterObject[field])
  return this
}
