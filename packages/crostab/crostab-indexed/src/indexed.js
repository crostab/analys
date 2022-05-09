export function* indexedOf(crostab) {
  const { side, head, rows } = crostab
  const h = side?.length, w = head?.length
  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++)
    yield [ side[i], head[j], rows[i][j] ]
}

export function* indexedBy(crostab, by) {
  const { side, head, rows } = crostab
  const h = side?.length, w = head?.length
  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++)
    if (by(side[i], head[j], rows[i][j]))
      yield [ side[i], head[j], rows[i][j] ]
}

export function* indexedTo(crostab, to) {
  const { side, head, rows } = crostab
  const h = side?.length, w = head?.length
  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++)
    yield to(side[i], head[j], rows[i][j])
}

export function* indexed(crostab, by, to) {
  if (!to) { return yield* !by ? indexedOf(crostab) : indexedBy(crostab, by) }
  if (!to) return yield* indexedBy(crostab, by)
  const { side, head, rows } = crostab
  const h = side?.length, w = head?.length
  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++)
    if (by(side[i], head[j], rows[i][j]))
      yield to(side[i], head[j], rows[i][j])
}