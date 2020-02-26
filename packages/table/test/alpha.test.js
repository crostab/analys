import { deco, says } from '@spare/logger'

const alpha = { foo: 1, bar: [2, 4] }
alpha |> deco |>  says.alpha
const beta = alpha
beta.foo = -1
beta |> deco |> says.beta
alpha |> deco |> says.alpha

let { foo, bar } = alpha
const gamma = { foo, bar }
gamma.foo = -3
gamma |> deco |> says.beta
alpha |> deco |> says.alpha
