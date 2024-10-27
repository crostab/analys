/**
 * @param {Object<string,function(*):boolean>} filterObject
 * @return {Object[]} - new array
 */
const samplesFind = function (filterObject) {
  let samples = this;
  for (let field in filterObject)
    if (filterObject.hasOwnProperty(field))
      samples = samplesFindOnce.call(samples, field, filterObject[field]);
  return samples
};

/**
 * @param {string} field
 * @param {function(*):boolean} filter
 * @return {Object[]} - new array
 */
const samplesFindOnce = function (field, filter) {
  return this.filter(sample => filter(sample[field]))
};

export { samplesFind };
