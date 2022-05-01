import { deco, says } from '@spare/logger'
import { RegUtil }    from '../src/RegUtil'

const regexNative = RegUtil.DEFAULT
regexNative.source  |> deco  |> says['RegUtil.csv'].br('native')

const regexDerive = RegUtil.csv(',', '"')
regexDerive.source  |> deco  |> says['RegUtil.csv'].br('derive')