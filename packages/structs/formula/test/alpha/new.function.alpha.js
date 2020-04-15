import { deco, delogger } from '@spare/deco'
import { logger }         from '@spare/logger'

const sum = new Function('a', 'b', 'return a + b')

sum.indexes = [1, 2]
sum(1, 2) |> deco |> logger
sum.indexes |> delogger
sum.toString() |> delogger
