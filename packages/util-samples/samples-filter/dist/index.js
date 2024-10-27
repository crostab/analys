/**
 * @param {Filter[]|Filter} filterCollection
 * @return {Object[]} - new array
 */
const samplesFilter = function (filterCollection) {
  let samples = this;
  if (!Array.isArray(filterCollection)) return samplesFilterOnce.call(samples, filterCollection)
  for (let filterConfig of filterCollection) samples = samplesFilterOnce.call(samples, filterConfig);
  return samples
};

/**
 * @param {Filter} filterConfig
 * @return {Object[]} - new array
 */
const samplesFilterOnce = function ({ field, filter }) {
  return this.filter(sample => filter(sample[field]))
};

export { samplesFilter };
