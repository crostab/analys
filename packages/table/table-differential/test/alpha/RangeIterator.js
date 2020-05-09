import { delogger } from '@spare/logger'

class RangeIterator {
  constructor (start, stop) {
    this.value = start
    this.stop = stop
  }

  [Symbol.iterator] () { return this }

  next () {
    const value = this.value
    if (value < this.stop) {
      this.value++
      return { done: false, value: value }
    }
    return { done: true, value: undefined }
  }
}

const range = (start, stop) => new RangeIterator(start, stop)

for (const value of range(0, 3)) {
  console.log(value) // 0, 1, 2
}

range(0, 3) |> delogger
