export const surjectToGrouped = surject => {
  const o = {}
  for (let x in surject) {
    const y = surject[x];
    (o[y] ?? (o[y] = [])).push(x)
  }
}

