import { keyedColumnsToSamples, selectSamplesByHead } from '@analys/keyed-columns'
import { matchSlice } from '@analys/table-init'

export const tableToSamples = (table, head) =>
  head?.length
    ? selectSamplesByHead.call(table |> matchSlice, head)
    : keyedColumnsToSamples.call(table |> matchSlice)
