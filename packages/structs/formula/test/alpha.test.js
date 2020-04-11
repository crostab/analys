import { delogger } from '@spare/deco'

const vec = ['a', 'b', 'c']
Object.keys(vec) |> delogger
Object.values(vec) |> delogger
Object.entries(vec) |> delogger
