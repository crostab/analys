import { mapper } from '@vect/vector-mapper'
import { ACCUM } from '@analys/enum-pivot-mode'

export const skeleton = ({ s = [], b = [], m = [], n } = {}) =>
  ({ s, b, m, n })

export const increSkeleton = () => skeleton({ n: () => 0 })

export const accumSkeleton = () => skeleton({ n: () => [] })

export const cubicSkeleton = (band) => {
  const nvs = vacancyCreators(band)
  const n = () => mapper(nvs, nv => nv())
  return skeleton({ n })
}

const vacancyCreators = band =>
  band.map(({ mode }) => mode === ACCUM
    ? () => []
    : () => 0)

