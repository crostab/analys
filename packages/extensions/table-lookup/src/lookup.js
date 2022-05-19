export const lookup = function (valueToFind, key, field) {
  const table = this, { head, rows } = table, x = head.indexOf(key), y = head.indexOf(field)
  if (x < 0 || y < 0) return null
  const row = rows.find(row => row[x] === valueToFind)
  return row ? row[y] : null
}

export const lookupMany = function (valuesToFind, key, field) {
  const table = this, { head, rows } = table, x = head.indexOf(key), y = head.indexOf(field)
  if (x < 0 || y < 0) return valuesToFind.map(() => null)
  return valuesToFind.map(v => {
    const row = rows.find(row => row[x] === v)
    return row ? row[y] : null
  })
}



