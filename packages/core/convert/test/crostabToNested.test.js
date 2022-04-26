import { deco }            from '@spare/deco'
import { logger }          from '@spare/logger'
import { crostabToNested } from '../src/crostabToNested'
import { CROSTAB }         from './asset/Upper_Upper'

crostabToNested(CROSTAB)  |> deco  |> logger