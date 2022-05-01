import { CR, LF } from '@spare/enum-chars'

export const parseCsvIter = (tx, de = ',', qt = '"') => {
  let q = false, x = 0, y = 0, row = [] // q: true -> inside a quoted field
  const rows = []
  function amprow() { rows[x++] = row = [''], y = 0 }
  function ampcol(row) {
    if (!q) row[y] = row[y].trim()
    row[++y] = ''
  }
  amprow()
  for (let i = 0, c, n = tx[i], l = tx.length; i < l;) {
    c = n
    n = tx[++i]
    if (q) {
      if (c === qt) {
        if (n === qt) { n = tx[++i] } else { q = !q }
      } else {
        row[y] += c
      }
    } else if (c === qt) { // If it's just one 'quote', begin/end quoted field
      q = !q
    } else if (c === de) { // If it's a comma and we're not in a quoted field, move on to the next column
      ampcol(row)
    } else if (c === LF) {
      amprow()
    } else if (c === CR) {
      if (n === LF) n = tx[++i] // If it's a newline (CRLF) and we're not in a quoted field, skip the next char
      amprow()
    } else {
      row[y] += c
    }
  }

  return rows
}
