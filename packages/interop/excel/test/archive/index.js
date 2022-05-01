import { utils as XL } from 'xlsx'

export const tableToWorksheetBeta = (table) => {
  const R1C0 = { origin: { r: 1, c: 0 } }
  const { head, rows } = table
  const worksheet = XL.aoa_to_sheet([ head ])
  XL.sheet_add_aoa(worksheet, rows, R1C0)
  return worksheet
}