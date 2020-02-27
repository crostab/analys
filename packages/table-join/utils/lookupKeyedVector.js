export const lookupKeyedVector = function (lookupKey) {
  return this.find(({ key }) => key.every((x, i) => x === lookupKey[i]))?.vector
}

export const lookupKeyedVectorIndex = function (lookupKey) {
  return this.findIndex(({ key }) => key.every((x, i) => x === lookupKey[i]))
}
