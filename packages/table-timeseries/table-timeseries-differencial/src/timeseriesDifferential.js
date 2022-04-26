// import { Table }          from '@analys/table'
import { roundD2 }        from '@aryth/math'
import { isNumeric }      from '@typen/num-strict'
import { Differentiator } from '@vect/vector-differentiator'
import { iterate }        from '@vect/vector-mapper'

export const timeseriesDifferential = function ({ dateLabel = 'date', fields, mutate = true }) {
  /** @type {Table} */ const table = mutate ? this : this.copy()
  const dateIndex = table.coin(dateLabel)
  const indexes = table.columnIndexes(fields), depth = indexes.length
  if (indexes.includes(dateIndex)) indexes.splice(indexes.indexOf(dateIndex), 1)
  const rows = table.rows
  let pv, cv, prevNum, currNum
  for (const [prev, curr] of Differentiator.build(rows))
    if (equalYear(prev[dateIndex], curr[dateIndex])) {
      iterate(
        indexes,
        i => {
          prevNum = isNumeric(pv = prev[i]), currNum = isNumeric(cv = curr[i])
          if (prevNum) {
            if (currNum) { prev[i] = roundD2(pv - cv) }
            else { curr[i] = 0 }
          }
          else {
            if (currNum) { prev[i] = roundD2(0 - cv) }
            else { prev[i] = null }
          }
        },
        depth
      )
    }
  return rows.pop(), table.boot({ rows })
}

const equalYear = (a, b) => a.slice(0, 4) === b.slice(0, 4)
