import unified from 'unified'
import math from 'remark-math'

// $ExpectType Processor<Settings>
unified().use(math)
// $ExpectType Processor<Settings>
unified().use(math, {inlineMathDouble: true})
// $ExpectError
unified().use(math, {inlineMathDouble: 3})
// $ExpectError
unified().use(math, {invalidProp: true})
