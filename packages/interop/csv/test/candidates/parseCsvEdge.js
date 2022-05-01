import { CR, LF } from '@spare/util'

export function parseCsvEdge (csv, de = ',', qt = '"') {
  const o = { q: false, x: 0, y: 0, m: [], w: '' }
  let row = amprow.call(o, [])
  for (let i = 0, c, l = csv.length; i < l; i++) {
    // current char
    if ((c = csv[i]) && o.q) { // if inside a quoted field
      if (c === qt) { csv[i + 1] === qt ? (i++, o.w += c) : o.q ^= true }
      else { o.w += c }
    }
    else if (c === qt) { o.q ^= true } // if is just one 'quote', begin/end quoted field
    else if (c === de) { ampcol.call(o, row) } // if is comma & not in quoted field, move on to the next column
    else if (c === LF) { row = amprow.call(o, row) } // if is line-feed, move on to next row
    else if (c === CR) {i += (csv[i + 1] === LF), row = amprow.call(o, row)} // if carriage-return & not in a quoted field, skip the next char
    else { o.w += c }
  }
  return o.m
}

const amprow = function (row) {
  ampcol.call(this, row)
  return this.y = 0, this.m[this.x++] = row = [], row
}

const ampcol = function (row) {
  if (!this.q) this.w = this.w.trim()
  row[this.y++] = this.w, this.w = ''
}
