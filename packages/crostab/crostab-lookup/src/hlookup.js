export const hlookup = function (valueToFind, keyField, valueField) {
  const crostab = this, { side, rows } = crostab
  const y = (rows[side.indexOf(keyField)] || []).indexOf(valueToFind)
  const valueRow = rows[side.indexOf(valueField)] || []
  return valueRow[y]
}

export const hlookupMany = function (valuesToFind, keyField, valueField) {
  const crostab = this, { side, rows } = crostab
  const krow = rows[side.indexOf(keyField)] || []
  const vrow = rows[side.indexOf(valueField)] || []
  return valuesToFind.map(v => vrow[krow.indexOf(v)])
}



