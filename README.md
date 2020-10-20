### @analys

##### :bar_chart: table and cross-table analytics

[![npm version][badge-npm-version]][url-npm]
[![github commit last][badge-github-last-commit]][url-github]
[![github commit total][badge-github-commit-count]][url-github]
[![npm license][badge-npm-license]][url-npm]

[//]: <> (Shields)
[badge-npm-version]: https://flat.badgen.net/npm/v/@analys/table
[badge-npm-license]: https://flat.badgen.net/npm/license/@analys/table
[badge-github-last-commit]: https://flat.badgen.net/github/last-commit/hoyeungw/analys
[badge-github-commit-count]: https://flat.badgen.net/github/commits/hoyeungw/analys

[//]: <> (Link)
[url-github]: https://github.com/hoyeungw/analys
[url-npm]: https://npmjs.org/package/@analys/vector

#### Features

- Convert between samples and table
- Cross-table analysis for samples/table, incl. combined cross-table query.
- Sort, filter and select fields on samples/table/crostab
- Join two tables by union/intersect/left/right.
- Lightweight and fast.
- ES-module support.

#### Install

```console
$ npm install @analys/<tool-name>
```

#### Tools
|                                                        |                                           |                 |                            |
| ------------------------------------------------------ | ----------------------------------------- | --------------- |--------------------------- |
| [**table**](packages/core/table)                            | Table (contains head and rows)            | core            |![v][table-dm]              |
| [**crostab**](packages/core/crostab)                        | Crostab (contains side, head and rows)    | core            |![v][crostab-dm]            |
| [**samples**](packages/core/samples)                        | Samples (array of identical-keyed object) | core            |![v][samples-dm]            |
| [**convert**](packages/core/convert)                        | Convert between samples and table         | convert         |![v][convert-dm]            |
| [**tablespec**](packages/structs/tablespec)                    | Defines how to query for crostab          | query interface |![v][tablespec-dm]          |
| [**table-join**](packages/table/table-join)                  | Join tables by union/intersect/left/right | table           |![v][table-join-dm]         |
| [**cubic**](packages/structs/cubic)                         | Crostab engine for combined query         | util            |![v][cubic-dm]              |
| [**pivot**](packages/structs/pivot)                         | Crostab engine for single query           | util            |![v][pivot-dm]              |
| [**enum-pivot-mode**](packages/constant/enum-pivot-mode)       | Pivot modes: INCRE/COUNT/ACCUM            | enum            |![v][enum-pivot-mode-dm]    |
| [**enum-tabular-types**](packages/constant/enum-tabular-types) | Tabular types: SAMPLES/TABLE/CROSTAB      | enum            |![v][enum-tabular-types-dm] |
|                                                        |                                           |                 |                            |

[//]: <> (Local routes)
[table-dm]:              https://flat.badgen.net/npm/dm/@analys/table
[crostab-dm]:            https://flat.badgen.net/npm/dm/@analys/crostab
[samples-dm]:            https://flat.badgen.net/npm/dm/@analys/samples
[convert-dm]:            https://flat.badgen.net/npm/dm/@analys/convert
[tablespec-dm]:          https://flat.badgen.net/npm/dm/@analys/tablespec
[table-join-dm]:         https://flat.badgen.net/npm/dm/@analys/table-join
[cubic-dm]:              https://flat.badgen.net/npm/dm/@analys/cubic
[pivot-dm]:              https://flat.badgen.net/npm/dm/@analys/pivot
[enum-pivot-mode-dm]:    https://flat.badgen.net/npm/dm/@analys/enum-pivot-mode
[enum-tabular-types-dm]: https://flat.badgen.net/npm/dm/@analys/enum-tabular-types

#### Meta
[LICENSE (MIT)](LICENSE)
