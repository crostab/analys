import { Foba } from '@foba/table'
import { decoCrostab, decoTable, deco, says } from '@spare/logger'
import { slice } from '@analys/table-init'
import { pivotDev } from '../../src/pivotDev'
import { INCRE } from '@analys/enum-pivot-mode'
import { isNumeric } from '@typen/num-strict'
// import {} from '@cliche/ratio'

const ROSTER = 'BistroDutyRoster'
const table = Foba[ROSTER] |> slice
table |> decoTable |> says[ROSTER + ' original']

const spec = {
  side: 'day',
  banner: 'name',
  cell: [
    { field: 'sold', mode: INCRE },
    { field: 'served', mode: INCRE }
  ],
  filter: { field: 'sold', filter: isNumeric },
  formula: (sold, served) => (sold / served).toFixed(2)
}
spec |> deco |> says[ROSTER + ' tablespec']

pivotDev(table, spec) |> decoCrostab |> says[ROSTER + ' crostab: conversion rate']

//((sold / served) * 100).toFixed(0) + '%',



