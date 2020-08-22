import unified from 'unified'
import html from 'remark-html-katex'

// $ExpectType Processor<Settings>
unified().use(html)
// $ExpectType Processor<Settings>
unified().use(html, {output: 'mathml'})
// $ExpectError
unified().use(html, {output: true})
// $ExpectError
unified().use(html, {invalidProp: true})
