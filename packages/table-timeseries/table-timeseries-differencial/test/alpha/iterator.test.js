import { deco, logger } from '@spare/logger'

let arr = ['a', 'b', 'c']
let iter = arr[Symbol.iterator]()

iter.next() |> deco |> logger// { value: 'a', done: false }
iter.next() |> deco |> logger// { value: 'b', done: false }
iter.next() |> deco |> logger// { value: 'c', done: false }
iter.next() |> deco |> logger// { value: undefined, done: true }

class TimeseriesDifferentiator {

}
