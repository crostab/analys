import { CO, LF } from '@spare/enum-chars'

export const parseCsvMap = (csvText, de = CO, lf = LF) => {
  return csvText
    .split(lf)
    .map(row => row.split(de).map(word => word.trim()))
}
