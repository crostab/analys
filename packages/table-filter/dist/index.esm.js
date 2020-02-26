/**
 * @param {Filter[]|Filter} filterCollection
 * @return {Table} - mutated 'this' {head, rows}
 */
const tableFilter = function (filterCollection) {
  if (!Array.isArray(filterCollection)) return tableFilterOnce.call(this, filterCollection);

  for (let filterConfig of filterCollection) tableFilterOnce.call(this, filterConfig);

  return this;
};
/**
 * @param {Filter} filterConfig
 * @return {Table} - mutated 'this' {head, rows}
 */

const tableFilterOnce = function ({
  field,
  filter
}) {
  let j = this.head.indexOf(field);
  if (j >= 0) this.rows = this.rows.filter(row => filter(row[j]));
  return this;
};

export { tableFilter, tableFilterOnce };
