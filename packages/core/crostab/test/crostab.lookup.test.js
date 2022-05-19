import { deco, DecoCrostab, says } from '@spare/logger'
import { Crostab as Crostab }      from '../src/Crostab'

const crostab = Crostab.from({
  side: ['RG', 'T', 'M', 'B'],
  head: ['RG', 'L', 'M', 'R'],
  rows: [
    ['', 'US', 'SP', 'IT'],
    ['JP', 1, 2, 3],
    ['UK', 4, 5, 6],
    ['DE', 7, 8, 9]
  ]
})

crostab |> DecoCrostab() |> says['crostab']

const vlkpTable = crostab.vlookupTable('RG', 'R')
vlkpTable |> deco |> says['vlookup util-table']

const hlkpTable = crostab.hlookupTable('RG', 'B')
hlkpTable |> deco |> says['hlookup util-table']

crostab.vlookupMany(['UK', 'DE'], 'RG', 'M') |> deco |> says['vlookup many']

crostab.hlookupMany(['US', 'IT'], 'RG', 'M') |> deco |> says['hlookup many']

crostab.vlookupOne('UK', 'RG', 'M') |> deco |> says['vlookup one']

crostab.hlookupOne('US', 'RG', 'M') |> deco |> says['hlookup one']
