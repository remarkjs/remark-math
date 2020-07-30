import unified = require('unified')
import math = require('remark-math')

unified().use(math)
unified().use(math, {})
unified().use(math, {inlineMathDouble: true})
