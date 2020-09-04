import { INCRE, MERGE }        from '@analys/enum-pivot-mode'
import { decoCrostab, logger } from '@spare/logger'
import { Cubic }               from '../src/Cubic'

const CitySurveyStats = {
  head: ['iso', 'mhi', 'year', 'seg', 'spend', 'pref'],
  rows: [
    ['CHN', 'H', 2020, 'urb', 600, ['c']],
    ['CHN', 'M', 2020, 'urb', 400, ['c']],
    ['CHN', 'L', 2020, 'urb', 200, ['c']],
    ['CHN', 'H', 2010, 'urb', 300, ['c']],
    ['CHN', 'M', 2010, 'urb', 200, ['c']],
    ['CHN', 'L', 2010, 'urb', 100, ['c']],
    ['CHN', 'H', 2000, 'urb', 60, ['c']],
    ['CHN', 'M', 2000, 'urb', 40, ['c']],
    ['CHN', 'L', 2000, 'urb', 20, ['c']],
    ['CHN', 'H', 2020, 'urb', 10, ['d']],
    ['CHN', 'M', 2020, 'urb', 10, ['d']],
    ['CHN', 'L', 2020, 'urb', 10, ['d']],
    ['CHN', 'H', 2010, 'urb', 10, ['d']],
    ['CHN', 'M', 2010, 'urb', 10, ['d']],
    ['CHN', 'L', 2010, 'urb', 10, ['d']],
    ['CHN', 'H', 2000, 'urb', 10, ['d']],
    ['CHN', 'M', 2000, 'urb', 10, ['d']],
    ['CHN', 'L', 2000, 'urb', 10, ['d']],
    ['USA', 'H', 2020, 'urb', 1000, ['u']],
    ['USA', 'M', 2020, 'urb', 600, ['u']],
    ['USA', 'L', 2020, 'urb', 200, ['u']],
    ['USA', 'H', 2010, 'urb', 800, ['u']],
    ['USA', 'M', 2010, 'urb', 500, ['u']],
    ['USA', 'L', 2010, 'urb', 150, ['u']],
    ['USA', 'H', 2000, 'urb', 500, ['u']],
    ['USA', 'M', 2000, 'urb', 300, ['u']],
    ['USA', 'L', 2000, 'urb', 100, ['u']],
    ['JPN', 'H', 2020, 'urb', 800, ['j']],
    ['JPN', 'M', 2020, 'urb', 600, ['j']],
    ['JPN', 'L', 2020, 'urb', 400, ['j']],
    ['JPN', 'H', 2010, 'urb', 700, ['j']],
    ['JPN', 'M', 2010, 'urb', 500, ['j']],
    ['JPN', 'L', 2010, 'urb', 400, ['j']],
    ['JPN', 'H', 2000, 'urb', 400, ['j']],
    ['JPN', 'M', 2000, 'urb', 300, ['j']],
    ['JPN', 'L', 2000, 'urb', 200, ['j']],

  ]


}

const pivot = new Cubic(
  [
    { key: 0, to: null },
    { key: 1, to: null }
  ],
  [
    { key: 2, to: null },
    // { key: 3, to: null }
  ],
  [
    { key: 4, to: INCRE },
    { key: 5, to: MERGE }
  ],
)

pivot.record(CitySurveyStats.rows).toObject() |> decoCrostab |> logger