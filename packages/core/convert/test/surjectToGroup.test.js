import { deco }             from '@spare/deco'
import { surjectToGrouped } from '../src/surjectToGrouped'

const surject = {
  a: '1',
  b: '1',
  c: '1',
  d: '2',
  e: '2',
  f: '3',
  g: '3',
}

surjectToGrouped(surject) |> deco |> console.log