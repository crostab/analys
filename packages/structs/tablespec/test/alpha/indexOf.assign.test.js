import { delogger } from '@spare/deco'

const arr = [1, 2, 3]
arr[-1] = 2
arr |> delogger
