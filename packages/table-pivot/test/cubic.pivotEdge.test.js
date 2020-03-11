import { Foba } from '@foba/table'
import { decoCrostab, decoTable, deco, says } from '@spare/logger'
import { slice } from '@analys/table-init'
import { pivotEdge } from '../src/pivotEdge'
import { COUNT, INCRE } from '@analys/enum-pivot-mode'
import { isNumeric } from '@typen/num-strict'

const ROSTER = 'BistroDutyRoster'
const table = Foba[ROSTER] |> slice
table |> decoTable |> says[ROSTER + ' original']

const tableSpec = {
  side: 'day',
  banner: 'name',
  field: {
    sold: INCRE,
    served: INCRE,
    adt: COUNT,
  },
  filter: { sold: isNumeric },
  // formula: (sold, served) => (sold / served).toFixed(2)
}
tableSpec |> deco |> says[ROSTER + ' tablespec']

pivotEdge(table, tableSpec) |> decoCrostab |> says[ROSTER + ' crostab: conversion rate']

//((sold / served) * 100).toFixed(0) + '%',



