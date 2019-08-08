/* eslint-disable import/no-extraneous-dependencies */
const test = require('tape')
const unified = require('unified')
const parse = require('remark-parse')
const stringify = require('remark-stringify')
const u = require('unist-builder')
const math = require('.')

test('remark-math', function(t) {
  t.deepEqual(
    unified()
      .use(parse, {position: false})
      .use(math)
      .parse('Math $\\alpha$\n\n$$\n\\beta+\\gamma\n$$'),
    u('root', [
      u('paragraph', [
        u('text', 'Math '),
        u(
          'inlineMath',
          {
            data: {
              hName: 'span',
              hProperties: {className: 'inlineMath'},
              hChildren: [u('text', '\\alpha')]
            }
          },
          '\\alpha'
        )
      ]),
      u(
        'math',
        {
          data: {
            hName: 'div',
            hProperties: {className: 'math'},
            hChildren: [u('text', '\\beta+\\gamma')]
          }
        },
        '\\beta+\\gamma'
      )
    ]),
    'should parse inline and block math'
  )

  t.deepEqual(
    unified()
      .use(parse, {position: false})
      .use(math)
      .parse('\\$\\alpha$'),
    u('root', [u('paragraph', [u('text', '$'), u('text', '\\alpha$')])]),
    'should ignore an escaped opening dollar sign'
  )

  t.deepEqual(
    unified()
      .use(parse, {position: false})
      .use(math)
      .parse('$\\alpha\\$'),
    u('root', [u('paragraph', [u('text', '$\\alpha$')])]),
    'should ignore an escaped closing dollar sign'
  )

  t.deepEqual(
    unified()
      .use(parse, {position: false})
      .use(math)
      .parse('\\$\\alpha\\$'),
    u('root', [u('paragraph', [u('text', '$'), u('text', '\\alpha$')])]),
    'should ignore an escaped opening and closing dollar sign'
  )

  t.deepEqual(
    unified()
      .use(parse, {position: false})
      .use(math)
      .parse('\\\\$\\alpha$'),
    u('root', [
      u('paragraph', [
        u('text', '\\'),
        u(
          'inlineMath',
          {
            data: {
              hName: 'span',
              hProperties: {className: 'inlineMath'},
              hChildren: [u('text', '\\alpha')]
            }
          },
          '\\alpha'
        )
      ])
    ]),
    'should support a escaped escape before a dollar sign'
  )

  t.deepEqual(
    unified()
      .use(parse, {position: false})
      .use(math)
      .parse('`$`\\alpha$'),
    u('root', [u('paragraph', [u('inlineCode', '$'), u('text', '\\alpha$')])]),
    'should ignore dollar signs in inline code (#1)'
  )

  t.deepEqual(
    unified()
      .use(parse, {position: false})
      .use(math)
      .parse('$\\alpha`$`'),
    u('root', [u('paragraph', [u('text', '$\\alpha'), u('inlineCode', '$')])]),
    'should ignore dollar signs in inline code (#2)'
  )

  t.deepEqual(
    unified()
      .use(parse, {position: false})
      .use(math)
      .parse('$`\\alpha`$'),
    u('root', [
      u('paragraph', [
        u(
          'inlineMath',
          {
            data: {
              hName: 'span',
              hProperties: {className: 'inlineMath'},
              hChildren: [u('text', '`\\alpha`')]
            }
          },
          '`\\alpha`'
        )
      ])
    ]),
    'should support backticks in inline math'
  )

  t.deepEqual(
    unified()
      .use(parse, {position: false})
      .use(math)
      .parse('$\\alpha\\$$'),
    u('root', [
      u('paragraph', [
        u(
          'inlineMath',
          {
            data: {
              hName: 'span',
              hProperties: {className: 'inlineMath'},
              hChildren: [u('text', '\\alpha\\$')]
            }
          },
          '\\alpha\\$'
        )
      ])
    ]),
    'should support a super factorial in inline math'
  )

  t.deepEqual(
    unified()
      .use(parse, {position: false})
      .use(math)
      .parse('$$\n\\alpha\\$\n$$'),
    u('root', [
      u(
        'math',
        {
          data: {
            hName: 'div',
            hProperties: {className: 'math'},
            hChildren: [u('text', '\\alpha\\$')]
          }
        },
        '\\alpha\\$'
      )
    ]),
    'should support a super factorial in block math'
  )

  t.deepEqual(
    unified()
      .use(parse, {position: false})
      .use(math)
      .parse('tango\n$$\n\\alpha\n$$'),
    u('root', [
      u('paragraph', [u('text', 'tango')]),
      u(
        'math',
        {
          data: {
            hName: 'div',
            hProperties: {className: 'math'},
            hChildren: [u('text', '\\alpha')]
          }
        },
        '\\alpha'
      )
    ]),
    'should support a math block right after a paragraph'
  )

  t.deepEqual(
    unified()
      .use(parse, {position: false})
      .use(math)
      .parse('$$\\alpha$$'),
    u('root', [
      u('paragraph', [
        u(
          'inlineMath',
          {
            data: {
              hName: 'span',
              hProperties: {className: 'inlineMath'},
              hChildren: [u('text', '\\alpha')]
            }
          },
          '\\alpha'
        )
      ])
    ]),
    'should support inline math with double dollars'
  )

  t.deepEqual(
    unified()
      .use(parse, {position: false})
      .use(math)
      .parse('$$$\n\\alpha\n$$$'),
    u('root', [
      u(
        'math',
        {
          data: {
            hName: 'div',
            hProperties: {className: 'math'},
            hChildren: [u('text', '\\alpha')]
          }
        },
        '\\alpha'
      )
    ]),
    'should support block math with triple dollars'
  )

  t.deepEqual(
    unified()
      .use(parse, {position: false})
      .use(math)
      .parse('  $$\n    \\alpha\n  $$'),
    u('root', [
      u(
        'math',
        {
          data: {
            hName: 'div',
            hProperties: {className: 'math'},
            hChildren: [u('text', '  \\alpha')]
          }
        },
        '  \\alpha'
      )
    ]),
    'should support indented block math'
  )

  t.deepEqual(
    unified()
      .use(parse, {position: false})
      .use(stringify)
      .use(math)
      .processSync('Math $\\alpha$\n\n$$\n\\beta+\\gamma\n$$\n')
      .toString(),
    'Math $\\alpha$\n\n$$\n\\beta+\\gamma\n$$\n',
    'should stringify inline and block math'
  )

  t.deepEqual(
    unified()
      .use(parse, {position: false})
      .use(stringify)
      .use(math)
      .processSync('> $$\n> \\alpha\\beta\n> $$\n')
      .toString(),
    '> $$\n> \\alpha\\beta\n> $$\n',
    'should stringify math in a blockquote'
  )

  t.deepEqual(
    unified()
      .use(parse, {position: false})
      .use(math)
      .parse('$$  must\n\\alpha\n$$  be ignored\n'),
    u('root', [
      u(
        'math',
        {
          data: {
            hName: 'div',
            hProperties: {className: 'math'},
            hChildren: [u('text', '\\alpha')]
          }
        },
        '\\alpha'
      )
    ]),
    'should ignore everything after the opening and closing fences'
  )

  t.deepEqual(
    unified()
      .use(parse, {position: false})
      .use(math)
      .parse('$$\n\\alpha\n$$\n```\nbravo\n```\n'),
    u('root', [
      u(
        'math',
        {
          data: {
            hName: 'div',
            hProperties: {className: 'math'},
            hChildren: [u('text', '\\alpha')]
          }
        },
        '\\alpha'
      ),
      u('code', {lang: null, meta: null}, 'bravo')
    ]),
    'should not affect the next block'
  )

  t.deepEqual(
    unified()
      .use(parse, {position: false})
      .use(math, {inlineMathDouble: true})
      .parse('$$\\alpha$$'),
    u('root', [
      u('paragraph', [
        u(
          'inlineMath',
          {
            data: {
              hName: 'span',
              hProperties: {className: 'inlineMath inlineMathDouble'},
              hChildren: [u('text', '\\alpha')]
            }
          },
          '\\alpha'
        )
      ])
    ]),
    'should add a `inlineMathDouble` class to inline math with double dollars if `inlineMathDouble: true`'
  )

  t.end()
})
