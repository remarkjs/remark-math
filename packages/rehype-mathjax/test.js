const test = require('tape')
const ChtmlRenderer = require('./renderer/chtml')
const SvgRenderer = require('./renderer/svg')
const BrowserRenderer = require('./renderer/browser')
const unified = require('unified')
const parseMarkdown = require('remark-parse')
const remark2rehype = require('remark-rehype')
const parseHtml = require('rehype-parse')
const stringify = require('rehype-stringify')
const math = require('../remark-math')
const toHtml = require('hast-util-to-html')

test('rehype-mathjax', function (t) {
  for (const output of ['./chtml', './svg', './browser']) {
    let renderer
    let options
    if (output === './chtml') {
      options = {}
      renderer = new ChtmlRenderer(options)
    } else if (output === './svg') {
      options = {fontCache: 'none'}
      renderer = new SvgRenderer(options)
    } else {
      options = {displayMath: ['\\[', '\\]'], inlineMath: ['\\(', '\\)']}
      renderer = new BrowserRenderer(options)
    }

    t.deepEqual(
      unified()
        .use(parseHtml, {fragment: true, position: false})
        .use(require(output), options)
        .use(stringify)
        .processSync(
          [
            '<p>Inline math <span class="math-inline">\\alpha</span>.</p>',
            '<p>Block math:</p>',
            '<div class="math-display">\\gamma</div>'
          ].join('\n')
        )
        .toString(),
      unified()
        .use(parseHtml, {fragment: true, position: false})
        .use(stringify)
        .processSync(
          [
            '<p>Inline math <span class="math-inline">' +
              toHtml(renderer.render('\\alpha', {display: false})) +
              '</span>.</p>',
            '<p>Block math:</p>',
            '<div class="math-display">' +
              toHtml(renderer.render('\\gamma', {display: true})) +
              '</div>' +
              toHtml(renderer.styleSheet)
          ].join('\n')
        )
        .toString(),
      `should transform math with mathjax with ${output}`
    )

    t.deepEqual(
      unified()
        .use(parseMarkdown, {position: false})
        .use(math)
        .use(remark2rehype)
        .use(require(output), options)
        .use(stringify)
        .processSync(
          [
            'Inline math $\\alpha$.',
            '',
            'Block math:',
            '',
            '$$',
            '\\gamma',
            '$$'
          ].join('\n')
        )
        .toString(),
      unified()
        .use(parseHtml, {fragment: true, position: false})
        .use(stringify)
        .processSync(
          [
            '<p>Inline math <span class="math math-inline">' +
              toHtml(renderer.render('\\alpha', {display: false})) +
              '</span>.</p>',
            '<p>Block math:</p>',
            '<div class="math math-display">' +
              toHtml(renderer.render('\\gamma', {display: true})) +
              '</div>' +
              toHtml(renderer.styleSheet)
          ].join('\n')
        )
        .toString(),
      `should integrate with 'remark-math' with ${output}`
    )

    t.deepEqual(
      unified()
        .use(parseHtml, {fragment: true, position: false})
        .use(require(output), options)
        .use(stringify)
        .processSync(
          '<p>Double math <span class="math-inline math-display">\\alpha</span>.</p>'
        )
        .toString(),
      unified()
        .use(parseHtml, {fragment: true, position: false})
        .use(stringify)
        .processSync(
          '<p>Double math <span class="math-inline math-display">' +
            toHtml(renderer.render('\\alpha', {display: true})) +
            '</span>.</p>' +
            toHtml(renderer.styleSheet)
        )
        .toString(),
      `should transform \`.math-inline.math-display\` math with \`displayMode: true\` with ${output}`
    )

    t.deepEqual(
      unified()
        .use(parseHtml, {fragment: true, position: false})
        .use(require(output), options)
        .use(stringify)
        .processSync('<p>No math</p>')
        .toString(),
      unified()
        .use(parseHtml, {fragment: true, position: false})
        .use(stringify)
        .processSync('<p>No math</p>')
        .toString(),
      `Should not be insert stylesheet if it is no math with ${output}`
    )
    t.deepEqual(
      unified()
        .use(parseHtml, {fragment: true, position: false})
        .use(require(output))
        .use(stringify)
        .processSync('')
        .toString(),
      unified()
        .use(parseHtml, {fragment: true, position: false})
        .use(stringify)
        .processSync('')
        .toString(),
      `Default options is \`{}\``
    )
  }

  t.end()
})
