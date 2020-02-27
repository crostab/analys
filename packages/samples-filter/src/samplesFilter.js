/**
 * @param {Filter[]|Filter} filterCollection
 * @return {Table} - mutated 'this' {head, samples}
 */
export const samplesFilter = function (filterCollection) {
  if (!Array.isArray(filterCollection)) return samplesFilterOnce.call(this, filterCollection)
  for (let filterConfig of filterCollection) samplesFilterOnce.call(this, filterConfig)
  return this
}

/**
 * @param {Filter} filterConfig
 * @return {Table} - mutated 'this' {head, samples}
 */
export const samplesFilterOnce = function ({ field, filter }) {
  return this.samples = this.samples.filter(sample => filter(sample[field])), this
}
