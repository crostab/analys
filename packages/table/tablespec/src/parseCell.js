import { NUM, OBJ, STR } from '@typen/enums'
import { COUNT, INCRE } from '@analys/enum-pivot-mode'
import { mapper } from '@vect/vector-mapper'

export const parseCell = (cell, defaultField) => {
  if (cell === void 0 || cell === null) return defaultCell(defaultField)
  switch (typeof cell) {
    case OBJ:
      if (Array.isArray(cell)) return cell.length
        ? mapper(cell, cell => parseCell(cell, defaultField))
        : defaultCell(defaultField)
      cell.field = cell.field ?? defaultField
      cell.mode = cell.mode ?? COUNT
      return cell
    case STR:
    case NUM:
      return { field: cell, mode: INCRE }
    default:
      return defaultCell(defaultField)
  }
}

const defaultCell = defaultField => ({ field: defaultField, mode: COUNT })
