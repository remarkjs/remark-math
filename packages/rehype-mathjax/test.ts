import unified from 'unified' // eslint-disable-line import/no-extraneous-dependencies
import mathjax from 'rehype-mathjax'
import chtml from 'rehype-mathjax/chtml'
import browser from 'rehype-mathjax/browser'

// $ExpectType Processor<Settings>
unified().use(mathjax)
// $ExpectType Processor<Settings>
unified().use(mathjax, {minScale: 3})
// $ExpectType Processor<Settings>
unified().use(mathjax, {minScale: 3, tex: {tags: 'ams'}})
// $ExpectError
unified().use(mathjax, {invalidProp: true})

// $ExpectType Processor<Settings>
unified().use(chtml, {fontURL: 'url'})
// $ExpectType Processor<Settings>
unified().use(chtml, {fontURL: 'url', tex: {tags: 'ams'}})
// $ExpectError
unified().use(chtml)
// $ExpectError
unified().use(chtml, {})
// $ExpectError
unified().use(chtml, {adaptiveCSS: true})
// $ExpectError
unified().use(chtml, {fontURL: 'url', invalidProp: true})

// $ExpectType Processor<Settings>
unified().use(browser)
// $ExpectType Processor<Settings>
unified().use(browser, {displayMath: ['$$', '$$']})
// $ExpectType Processor<Settings>
unified().use(browser, {
  displayMath: [
    ['$$', '$$'],
    ['((', '))']
  ]
})
// $ExpectError
unified().use(browser, {displayMath: ['$$']})
// $ExpectError
unified().use(browser, {invalidProp: true})
