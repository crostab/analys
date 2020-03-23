export const lookup = function (valueToFind, key, field) {
  const table = this, { head, rows } = table, ki = head.indexOf(key), vi = head.indexOf(field)
  if (ki < 0 || vi < 0) return null
  const row = rows.find(row => row[ki] === valueToFind)
  return row ? row[vi] : null
}

export const lookupMany = function (valuesToFind, key, field) {
  const table = this, { head, rows } = table, ki = head.indexOf(key), vi = head.indexOf(field)
  if (ki < 0 || vi < 0) return valuesToFind.map(() => null)
  return valuesToFind.map(v => {
    const row = rows.find(row => row[ki] === v)
    return row ? row[vi] : null
  })
}



