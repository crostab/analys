export const groupedToSurject = grouped => {
  const o = {}
  for (let y in grouped) {
    if (Array.isArray(grouped[y])) for (let x of grouped[y]) {
      if (!(x in o)) o[x] = y
    }
  }
  return o
}