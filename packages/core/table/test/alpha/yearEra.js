import { range } from '@vect/vector-init'
import { says } from '@spare/logger'

export const yearEra = year => ~~(year / 5) * 5

// const rg = range(2000, 2021)
//
// for (let year of rg) {
//   says[year](yearEra(year))
// }

