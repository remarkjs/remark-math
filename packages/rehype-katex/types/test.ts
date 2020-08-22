import unified from 'unified'
import katex from 'rehype-katex'

// $ExpectType Processor<Settings>
unified().use(katex)
// $ExpectType Processor<Settings>
unified().use(katex, {output: 'html'})
// $ExpectError
unified().use(katex, {invalidProp: true})
