import { RegUtil } from '../../src/RegUtil'

export const parseCsvReg = (text, de = ',', qt = '"') => {
  const reg = RegUtil.csv(de, qt), dualQuote = RegUtil.quoteRep(qt), rows = []
  let ms, sep, qtv, stv, row = []
  while ((ms = reg.exec(text)) && ([ , sep, qtv, stv ] = ms)) {
    if (sep && sep !== de) {
      rows.push(row)
      row = []
    } // if separator is line-feed, push new row.
    row.push(qtv ? qtv.replace(dualQuote, qt) : (stv?.trim() ?? ''))
  } // if the captured value is quoted, unescape double quotes, else push the non-quoted value
  if (row.length) rows.push(row)
  return rows
}

// reg,   // regexp to parse the CSV values
// ditto, // regexp for double quotes
// ms,    // array to hold individual pattern matching groups.
// sep,   // captured separator, can be either delimiter or line-feed.
// qtv,   // captured quoted value.
// stv,   // captured unquoted value.
// wd,    // final processed capture value.
// row,   // data row.