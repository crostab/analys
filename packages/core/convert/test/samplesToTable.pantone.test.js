import { DecoTable, says, Xr } from '@spare/logger'
import { samplesToTable }      from '../src/samplesToTable'
import { time }                from '@valjoux/timestamp-pretty'
import { Vinylize }            from '@flua/vinylize'
import gulp                    from 'gulp'
import { Markdown }            from '@spare/markdown'

says['pantone'].attach(time)

const ROOT = process.cwd()
const SRC = 'static/util-samples'
const DEST = 'static/build'

const test = async () => {
  'start reading' |> says['pantone']
  const { PANTONE_SAMPLES } = await import(ROOT + '/' + SRC + '/' + 'pantone-util-samples.js')
  'end reading' |> says['pantone']
  'start convert' |> says['pantone']
  const table = samplesToTable(PANTONE_SAMPLES)
  'end convert' |> says['pantone']
  table |> DecoTable({ top: 12, bottom: 6 }) |> says['samplesToTable']
  'start writing' |> says['pantone']
  const FILENAME = 'pantone-util-samples.md'
  await Vinylize(FILENAME)
    .p(table |> Markdown.table)
    .asyncPipe(gulp.dest(ROOT + '/' + DEST))
  'end writing' |> says['pantone']
}

test().then()

