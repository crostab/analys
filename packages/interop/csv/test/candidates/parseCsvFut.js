import { CR, LF } from '@spare/util'

export function parseCsvFut (csv, de = ',', qt = '"') {
  const rows = []
  let q = false, x = 0, y = 0, wd = ''
  const amprow = row => {
    ampcol(row)
    return y = 0, rows[x++] = row = [], row
  }
  const ampcol = row => {
    if (!q) wd = wd.trim()
    row[y++] = wd, wd = ''
  }
  let row = amprow([])
  for (let i = 0, c, l = csv.length; i < l; i++) {
    if ((c = csv[i]) && q) { // if inside a quoted field
      if (c === qt) { csv[i + 1] === qt && i++ ? wd += c : q ^= true }
      else { wd += c }
    }
    else if (c === de) { ampcol(row) } // if is comma & not in quoted field, move on to the next column
    else if (c === LF) { row = amprow(row) } // if is line-feed, move on to next row
    else if (c === CR) { i += (csv[i + 1] === LF), row = amprow(row) } // if carriage-return & not in a quoted field, skip the next char
    else if (c === qt) { q ^= true } // if is just one 'quote', begin/end quoted field
    else { wd += c }
  }
  return rows
}
