/**
 * @param {Object<str,function(*):boolean>} filterObject
 * @return {Table|TableObject} - mutated 'this' {head, rows}
 */
const tableFind = function (filterObject) {
  for (let field in filterObject) if (filterObject.hasOwnProperty(field)) tableFindOnce.call(this, field, filterObject[field]);

  return this;
};
/**
 * @param {str} field
 * @param {function(*):boolean} filter
 * @return {Table|TableObject} - mutated 'this' {head, rows}
 */

const tableFindOnce = function (field, filter) {
  let j = this.head.indexOf(field);
  if (j >= 0) this.rows = this.rows.filter(row => filter(row[j]));
  return this;
};

export { tableFind, tableFindOnce };
