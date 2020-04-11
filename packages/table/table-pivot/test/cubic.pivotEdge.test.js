import { Foba }                               from '@foba/table'
import { deco, decoCrostab, decoTable, says } from '@spare/logger'
import { slice }               from '@analys/table-init'
import { tablePivot }          from '../src/tablePivot'
import { ACCUM, COUNT, INCRE } from '@analys/enum-pivot-mode'
import { isNumeric }                          from '@typen/num-strict'

const ROSTER = 'BistroDutyRoster'
const table = Foba[ROSTER] |> slice
table |> decoTable |> says[ROSTER + ' original']

const tableSpec = {
  side: 'day',
  banner: 'name',
  field: {
    sold: INCRE,
    served: ACCUM,
    adt: COUNT,
  },
  filter: { sold: isNumeric },
  // formula: (sold, served) => (sold / served).toFixed(2)
}
tableSpec |> deco |> says[ROSTER + ' tablespec']

tablePivot(table, tableSpec) |> decoCrostab |> says[ROSTER + ' crostab: conversion rate']

//((sold / served) * 100).toFixed(0) + '%',



