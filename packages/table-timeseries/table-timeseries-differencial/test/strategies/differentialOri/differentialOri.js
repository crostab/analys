import { MUTABLE }      from '@analys/enum-mutabilities'
import { Table }        from '@analys/table'
import { tableAcquire } from '@analys/table-merge'
import { roundD2 }      from '@aryth/math'
import { isNumeric }           from '@typen/num-strict'
import { dashToYmd, ymdToInt } from '@valjoux/convert'
import { shiftQuarter }        from '@valjoux/date-shift'
import { mutazip }             from '@vect/vector-zipper'

export const differentialOri = function (table, { dateLabel, excluded }) {
  excluded = excluded && excluded.length ? (excluded.push(dateLabel), excluded) : [dateLabel]
  const { pick, rest } = Table.from(table).divide(excluded, MUTABLE)
  differentialBySide.call(table, pick.column(dateLabel))
  return tableAcquire(pick, rest).popRow(), pick
}

export const differentialBySide = function (side) {
  const table = this, { ht, wd, rows } = table
  let i = 0, next, ndate, curr = rows[i], cdate = side[i] |> dashToYmd
  while (++i < ht) {
    next = rows[i], ndate = side[i] |> dashToYmd
    if (!isContinued(cdate, ndate))
      throw (new Error(`[${this.title}] (date discontinued by quarter) [curr] (${cdate}) [prev] (${ndate})`))
    if (equalYear(cdate, ndate))
      mutazip(curr, next, (c, n) => isNumeric(c) && isNumeric(n) ? roundD2(c - n) : null, wd)
    curr = next, cdate = ndate
  }
  return table
}

const isContinued = (curr, prev) => equalDate(shiftQuarter(curr.slice(), -1), prev)
const equalYear = (a, b) => a[0] === b[0]
const equalDate = (a, b) => ymdToInt(a) === ymdToInt(b)
