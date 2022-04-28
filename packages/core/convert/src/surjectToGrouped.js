export const surjectToGrouped = surject => {
  const grouped = {}
  for (let x in surject) {
    const y = surject[x];
    (grouped[y] ?? (grouped[y] = [])).push(x)
  }
  return grouped
}

