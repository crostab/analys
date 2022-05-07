const vec = [
  -1,
  0,
  1,
  2
]

for (let n of vec) {
  `[n] (${n}) [!~] (${~n}) [!~] (${~n ? 1 : 0})` |> console.log
}