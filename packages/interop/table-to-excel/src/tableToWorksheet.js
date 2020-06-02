import { matchSlice } from '@analys/table-init'
import { utils }      from 'xlsx'

const R1C0 = { origin: { r: 1, c: 0 } }

export const tableToWorksheet = (table) => {
  const { head, rows } = table |> matchSlice
  const worksheet = utils.aoa_to_sheet([head])
  utils.sheet_add_aoa(worksheet, rows, R1C0)
  return worksheet
}
