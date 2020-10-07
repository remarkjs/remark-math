import unified from 'unified' // eslint-disable-line import/no-extraneous-dependencies
import math from 'remark-math'

// $ExpectType Processor<Settings>
unified().use(math)
// $ExpectError
unified().use(math, {invalidProp: true})
