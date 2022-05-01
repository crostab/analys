// import { logger }  from '@spare/logger'
import { RegUtil } from './RegUtil'

/**
 *
 * @param content
 * @param de
 * @param qt
 * @returns {Generator<string[], string[], *>}
 */
export function* indexed(content, { de = ',', qt = '"' } = {}) {
  const regex = RegUtil.csv(de, qt), quote2 = RegUtil.quoteRep(qt)
  let matches, delim, quote, value, row = []
  if (content.startsWith(de)) row.push('')
  while ((matches = regex.exec(content)) && ([ , delim, quote, value ] = matches)) {
    // `[delim] (${delim.replace(/\r?\n/g, '[LF]')}) [quote] (${quote ?? '[UDF]'}) [value] (${value?.replace(/\r?\n/g, '[LF]')})`  |> logger
    if (delim && delim !== de) {
      yield row
      row = []
    } // if separator is line-feed, push new row.
    row.push(quote ? quote.replace(quote2, qt) : value?.trim() ?? '')
  } // if the captured value is quoted, unescape double quotes, else push the non-quoted value
  if (row.length && row.some(x => x?.length)) yield row
}

// regex,    // regex to parse the CSV values
// quoteRep, // regex for double quotes
// matches,  // array to hold individual pattern matching groups.
// delim,    // captured separator, can be either delimiter or line-feed.
// quote,    // captured quoted value.
// value,    // captured unquoted value.
// wd,       // final processed capture value.
// row,      // data row.