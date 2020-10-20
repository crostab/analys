import { Chrono } from 'elprimero'
import { decoCrostab, says }      from '@spare/logger'
import { PivotVeho }              from '../archive/pivot-veho/Pivot'
import { ACCUM, COUNT, INCRE }    from '@analys/enum-pivot-mode'
import { Pivot }                  from '@analys/pivot'
import { mapper as matrixMapper } from '@vect/matrix-mapper'
import { Cubic }                  from '../../src/Cubic'
import { deco }                   from '@spare/deco'

const duties = {
  head: ['day', 'name', 'served', 'sold', 'adt'],
  rows: [
    [1, 'Joyce', 70, 7, ''],
    [1, 'Joyce', 66, 15, ''],
    [2, 'Joyce', 86, 10, ''],
    [2, 'Joyce', NaN, NaN, ''],
    [3, 'Joyce', 96, 2, ''],
    [1, 'Lance', 98, 15, ''],
    [1, 'Lance', 66, 15, ''],
    [2, 'Lance', 85, 12, ''],
    [2, 'Lance', 63, 12, ''],
    [3, 'Lance', NaN, NaN, ''],
    [1, 'Naomi', 90, 14, ''],
    [1, 'Naomi', 66, 9, ''],
    [2, 'Naomi', NaN, NaN, ''],
    [2, 'Naomi', 93, 16, ''],
    [3, 'Naomi', 78, 8, ''],
  ]
}

class PivotStrategies {
  static testPivot () {
    const { lapse, result } = Chrono.strategies({
      repeat: 1E+4,
      paramsList: {
        simple: [duties.rows, { x: 0, y: 1, z: 2, mode: INCRE, filter: x => !isNaN(x) }],
      },
      funcList: {
        bench: (rows, config) => matrixMapper(rows, x => x),
        fut: (rows, config) => new PivotVeho(config.mode).spreadPivot(rows, config),
        arch: (rows, { x, y, z, mode, filter }) => new Pivot(x, y, z, mode, filter).spreadPivot(rows).toObject(),
      }
    })
    lapse |> decoCrostab |> says.lapse
    result |> decoCrostab |> says.result
    result.queryCell('simple', 'fut') |> decoCrostab |> says.fut
    result.queryCell('simple', 'arch') |> decoCrostab |> says.arch
  }

  static testCubic () {
    const { lapse, result } = Chrono.strategies({
      repeat: 1E+4,
      paramsList: {
        simple: [duties.rows, {
          x: 0,
          y: 1,
          band: [{ index: 2, mode: INCRE }, { index: 3, mode: ACCUM }, { index: 4, mode: COUNT }],
          filter: undefined
        }],
      },
      funcList: {
        bench: (rows, config) => matrixMapper(rows, x => x),
        fut: (rows, config) => new PivotVeho(config.mode).spreadCubic(rows, config),
        arch: (rows, { x, y, band, filter }) => new Cubic(x, y, band, filter).spread(rows).toObject(),
      }
    })
    lapse |> decoCrostab |> says.lapse
    result |> decoCrostab |> says.result
    result.queryCell('simple', 'fut') |> deco |> says.fut
    result.queryCell('simple', 'arch') |> deco |> says.arch
  }
}

PivotStrategies.testCubic()
