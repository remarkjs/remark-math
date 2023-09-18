import assert from 'node:assert/strict'
import test from 'node:test'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkStringify from 'remark-stringify'
import {unified} from 'unified'
import {removePosition} from 'unist-util-remove-position'
import remarkMath from './index.js'

test('remarkMath', async function (t) {
  const toHtml = unified()
    .use(remarkParse)
    .use(remarkMath)
    // @ts-expect-error: to do: remove when `remark-rehype` is released.
    .use(remarkRehype)
    .use(rehypeStringify)

  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('remark-math')).sort(), [
      'default'
    ])
  })

  await t.test('should parse inline and block math', async function () {
    const tree = unified()
      .use(remarkParse)
      .use(remarkMath)
      .parse('Math $\\alpha$\n\n$$\n\\beta+\\gamma\n$$')

    removePosition(tree, {force: true})

    assert.deepEqual(tree, {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {type: 'text', value: 'Math '},
            {
              type: 'inlineMath',
              data: {
                hName: 'code',
                hProperties: {className: ['language-math', 'math-inline']},
                hChildren: [{type: 'text', value: '\\alpha'}]
              },
              value: '\\alpha'
            }
          ]
        },
        {
          type: 'math',
          meta: null,
          data: {
            hName: 'pre',
            hChildren: [
              {
                type: 'element',
                tagName: 'code',
                properties: {className: ['language-math', 'math-display']},
                children: [{type: 'text', value: '\\beta+\\gamma'}]
              }
            ]
          },
          value: '\\beta+\\gamma'
        }
      ]
    })
  })

  await t.test(
    'should ignore an escaped opening dollar sign',
    async function () {
      const tree = unified()
        .use(remarkParse)
        .use(remarkMath)
        .parse('\\$\\alpha$')

      removePosition(tree, {force: true})

      assert.deepEqual(tree, {
        type: 'root',
        children: [
          {type: 'paragraph', children: [{type: 'text', value: '$\\alpha$'}]}
        ]
      })
    }
  )

  await t.test(
    'should *not* ignore an escaped closing dollar sign',
    async function () {
      const tree = unified()
        .use(remarkParse)
        .use(remarkMath)
        .parse('$\\alpha\\$')

      removePosition(tree, {force: true})

      assert.deepEqual(tree, {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'inlineMath',

                data: {
                  hName: 'code',
                  hProperties: {className: ['language-math', 'math-inline']},
                  hChildren: [{type: 'text', value: '\\alpha\\'}]
                },
                value: '\\alpha\\'
              }
            ]
          }
        ]
      })
    }
  )

  await t.test(
    'should support a escaped escape before a dollar sign',
    async function () {
      const tree = unified()
        .use(remarkParse)
        .use(remarkMath)
        .parse('\\\\$\\alpha$')

      removePosition(tree, {force: true})

      assert.deepEqual(tree, {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {type: 'text', value: '\\'},
              {
                type: 'inlineMath',
                data: {
                  hName: 'code',
                  hProperties: {className: ['language-math', 'math-inline']},
                  hChildren: [{type: 'text', value: '\\alpha'}]
                },
                value: '\\alpha'
              }
            ]
          }
        ]
      })
    }
  )

  await t.test(
    'should ignore dollar signs in inline code (#1)',
    async function () {
      const tree = unified()
        .use(remarkParse)
        .use(remarkMath)
        .parse('`$`\\alpha$')

      removePosition(tree, {force: true})

      assert.deepEqual(tree, {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {type: 'inlineCode', value: '$'},
              {type: 'text', value: '\\alpha$'}
            ]
          }
        ]
      })
    }
  )

  await t.test('should allow backticks in math', async function () {
    const tree = unified().use(remarkParse).use(remarkMath).parse('$\\alpha`$`')

    removePosition(tree, {force: true})

    assert.deepEqual(tree, {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'inlineMath',
              data: {
                hName: 'code',
                hProperties: {className: ['language-math', 'math-inline']},
                hChildren: [{type: 'text', value: '\\alpha`'}]
              },
              value: '\\alpha`'
            },
            {type: 'text', value: '`'}
          ]
        }
      ]
    })
  })

  await t.test('should support backticks in inline math', async function () {
    const tree = unified().use(remarkParse).use(remarkMath).parse('$`\\alpha`$')

    removePosition(tree, {force: true})

    assert.deepEqual(
      tree,

      {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'inlineMath',
                data: {
                  hName: 'code',
                  hProperties: {className: ['language-math', 'math-inline']},
                  hChildren: [{type: 'text', value: '`\\alpha`'}]
                },
                value: '`\\alpha`'
              }
            ]
          }
        ]
      }
    )
  })

  await t.test(
    'should support a super factorial in inline math',
    async function () {
      const tree = unified()
        .use(remarkParse)
        .use(remarkMath)
        .parse('$$ \\alpha$ $$')

      removePosition(tree, {force: true})

      assert.deepEqual(tree, {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'inlineMath',
                data: {
                  hName: 'code',
                  hProperties: {className: ['language-math', 'math-inline']},
                  hChildren: [{type: 'text', value: '\\alpha$'}]
                },
                value: '\\alpha$'
              }
            ]
          }
        ]
      })
    }
  )

  await t.test(
    'should support a super factorial in block math',
    async function () {
      const tree = unified()
        .use(remarkParse)
        .use(remarkMath)
        .parse('$$\n\\alpha\\$\n$$')

      removePosition(tree, {force: true})

      assert.deepEqual(tree, {
        type: 'root',
        children: [
          {
            type: 'math',

            meta: null,
            data: {
              hName: 'pre',
              hChildren: [
                {
                  type: 'element',
                  tagName: 'code',
                  properties: {className: ['language-math', 'math-display']},
                  children: [{type: 'text', value: '\\alpha\\$'}]
                }
              ]
            },
            value: '\\alpha\\$'
          }
        ]
      })
    }
  )

  await t.test(
    'should support a math block right after a paragraph',
    async function () {
      const tree = unified()
        .use(remarkParse)
        .use(remarkMath)
        .parse('tango\n$$\n\\alpha\n$$')

      removePosition(tree, {force: true})

      assert.deepEqual(
        tree,

        {
          type: 'root',
          children: [
            {type: 'paragraph', children: [{type: 'text', value: 'tango'}]},
            {
              type: 'math',

              meta: null,
              data: {
                hName: 'pre',
                hChildren: [
                  {
                    type: 'element',
                    tagName: 'code',
                    properties: {
                      className: ['language-math', 'math-display']
                    },
                    children: [{type: 'text', value: '\\alpha'}]
                  }
                ]
              },
              value: '\\alpha'
            }
          ]
        }
      )
    }
  )

  await t.test(
    'should support inline math with double dollars',
    async function () {
      const tree = unified()
        .use(remarkParse)
        .use(remarkMath)
        .parse('$$\\alpha$$')

      removePosition(tree, {force: true})

      assert.deepEqual(tree, {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'inlineMath',

                data: {
                  hName: 'code',
                  hProperties: {className: ['language-math', 'math-inline']},
                  hChildren: [{type: 'text', value: '\\alpha'}]
                },
                value: '\\alpha'
              }
            ]
          }
        ]
      })
    }
  )

  await t.test(
    'should support block math with triple dollars',
    async function () {
      const tree = unified()
        .use(remarkParse)
        .use(remarkMath)
        .parse('$$$\n\\alpha\n$$$')

      removePosition(tree, {force: true})

      assert.deepEqual(tree, {
        type: 'root',
        children: [
          {
            type: 'math',

            meta: null,
            data: {
              hName: 'pre',
              hChildren: [
                {
                  type: 'element',
                  tagName: 'code',
                  properties: {className: ['language-math', 'math-display']},
                  children: [{type: 'text', value: '\\alpha'}]
                }
              ]
            },
            value: '\\alpha'
          }
        ]
      })
    }
  )

  await t.test('should support indented block math', async function () {
    const tree = unified()
      .use(remarkParse)
      .use(remarkMath)
      .parse('  $$\n    \\alpha\n  $$')

    removePosition(tree, {force: true})

    assert.deepEqual(tree, {
      type: 'root',
      children: [
        {
          type: 'math',
          meta: null,
          data: {
            hName: 'pre',
            hChildren: [
              {
                type: 'element',
                tagName: 'code',
                properties: {className: ['language-math', 'math-display']},
                children: [{type: 'text', value: '  \\alpha'}]
              }
            ]
          },
          value: '  \\alpha'
        }
      ]
    })
  })

  await t.test('should stringify inline and block math', async function () {
    assert.deepEqual(
      String(
        await unified()
          .use(remarkParse)
          .use(remarkStringify)
          .use(remarkMath)
          .process('Math $\\alpha$\n\n$$\n\\beta+\\gamma\n$$\n')
      ),
      'Math $\\alpha$\n\n$$\n\\beta+\\gamma\n$$\n'
    )
  })

  await t.test(
    'should support `singleDollarTextMath: false` (1)',
    async function () {
      assert.deepEqual(
        String(
          await unified()
            .use(remarkParse)
            .use(remarkStringify)
            .use(remarkMath, {singleDollarTextMath: false})
            .process('Math $\\alpha$\n\n$$\\beta+\\gamma$$\n')
        ),
        'Math $\\alpha$\n\n$$\\beta+\\gamma$$\n'
      )
    }
  )

  await t.test(
    'should support `singleDollarTextMath: false` (2)',
    async function () {
      assert.deepEqual(
        String(
          await unified()
            .use(remarkParse)
            .use(remarkMath, {singleDollarTextMath: false})
            // @ts-expect-error: to do: remove when `remark-rehype` is released.
            .use(remarkRehype)
            .use(rehypeStringify)
            .process('Math $\\alpha$\n\n$$\\beta+\\gamma$$\n')
        ),
        '<p>Math $\\alpha$</p>\n<p><code class="language-math math-inline">\\beta+\\gamma</code></p>'
      )
    }
  )

  await t.test('should stringify math in a blockquote', async function () {
    assert.deepEqual(
      String(
        await unified()
          .use(remarkParse)
          .use(remarkStringify)
          .use(remarkMath)
          .process('> $$\n> \\alpha\\beta\n> $$\n')
      ),
      '> $$\n> \\alpha\\beta\n> $$\n'
    )
  })

  await t.test(
    'should support an opening fence w/ meta, w/o closing fence',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('$$just two dollars')),
        '<pre><code class="language-math math-display"></code></pre>'
      )
    }
  )

  await t.test('should support `meta`', async function () {
    assert.deepEqual(
      String(await toHtml.process('$$  must\n\\alpha\n$$')),
      '<pre><code class="language-math math-display">\\alpha</code></pre>'
    )
  })

  await t.test(
    'should include values after the opening fence',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('$$  \n\\alpha\n$$')),
        '<pre><code class="language-math math-display">\\alpha</code></pre>'
      )
    }
  )

  await t.test(
    'should not support values before the closing fence',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('$$\n\\alpha\nmust  $$')),
        '<pre><code class="language-math math-display">\\alpha\nmust  $$</code></pre>'
      )
    }
  )

  await t.test(
    'should include values before the closing fence (except for spacing #2)',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('$$\n\\alpha\n  $$')),
        '<pre><code class="language-math math-display">\\alpha</code></pre>'
      )
    }
  )

  await t.test(
    'should exclude spacing after the closing fence',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('$$\n\\alpha\n$$  ')),
        '<pre><code class="language-math math-display">\\alpha</code></pre>'
      )
    }
  )

  await t.test('should not affect the next block', async function () {
    const tree = unified()
      .use(remarkParse)
      .use(remarkMath)
      .parse('$$\n\\alpha\n$$\n```\nbravo\n```\n')

    removePosition(tree, {force: true})

    assert.deepEqual(tree, {
      type: 'root',
      children: [
        {
          type: 'math',
          meta: null,
          data: {
            hName: 'pre',
            hChildren: [
              {
                type: 'element',
                tagName: 'code',
                properties: {className: ['language-math', 'math-display']},
                children: [{type: 'text', value: '\\alpha'}]
              }
            ]
          },
          value: '\\alpha'
        },
        {type: 'code', lang: null, meta: null, value: 'bravo'}
      ]
    })
  })

  await t.test(
    'should support two dollar signs on inline math',
    async function () {
      const tree = unified()
        .use(remarkParse)
        .use(remarkMath)
        .parse('$$\\alpha$$')

      removePosition(tree, {force: true})

      assert.deepEqual(tree, {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'inlineMath',
                data: {
                  hName: 'code',
                  hProperties: {className: ['language-math', 'math-inline']},
                  hChildren: [{type: 'text', value: '\\alpha'}]
                },
                value: '\\alpha'
              }
            ]
          }
        ]
      })
    }
  )

  await t.test('should stringify a tree', async function () {
    assert.deepEqual(
      String(
        await unified()
          .use(remarkStringify)
          .use(remarkMath)
          .stringify({
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {type: 'text', value: 'Math '},
                  {type: 'inlineMath', value: '\\alpha'}
                ]
              },
              {type: 'math', value: '\\beta+\\gamma'}
            ]
          })
      ),
      'Math $\\alpha$\n\n$$\n\\beta+\\gamma\n$$\n'
    )
  })

  await t.test(
    'should stringify inline math with double dollars using one dollar by default',
    async function () {
      assert.deepEqual(
        String(
          await unified()
            .use(remarkParse)
            .use(remarkStringify)
            .use(remarkMath)
            .process('$$\\alpha$$')
        ),
        '$\\alpha$\n'
      )
    }
  )

  await t.test(
    'should stringify inline math with double dollars using one dollar',
    async function () {
      assert.deepEqual(
        String(
          await unified()
            .use(remarkParse)
            .use(remarkStringify)
            .use(remarkMath)
            .process('$$\\alpha$$')
        ),
        '$\\alpha$\n'
      )
    }
  )

  await t.test('should do markdown-it-katex#01', async function () {
    assert.deepEqual(
      String(await toHtml.process('$1+1 = 2$')),
      '<p><code class="language-math math-inline">1+1 = 2</code></p>'
    )
  })

  await t.test('should do markdown-it-katex#02 (deviation)', async function () {
    assert.deepEqual(
      String(await toHtml.process('$$1+1 = 2$$')),
      '<p><code class="language-math math-inline">1+1 = 2</code></p>'
    )
  })

  await t.test(
    'should do markdown-it-katex#03: no whitespace before and after is fine',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('foo$1+1 = 2$bar')),
        '<p>foo<code class="language-math math-inline">1+1 = 2</code>bar</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#04: even when it starts with a negative sign',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('foo$-1+1 = 2$bar')),
        '<p>foo<code class="language-math math-inline">-1+1 = 2</code>bar</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#05: shouldn’t render empty content',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('aaa $$ bbb')),
        '<p>aaa $$ bbb</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#06: should require a closing delimiter',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('aaa $5.99 bbb')),
        '<p>aaa $5.99 bbb</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#07: paragraph break in inline math is not allowed',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('foo $1+1\n\n= 2$ bar')),
        '<p>foo $1+1</p>\n<p>= 2$ bar</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#08: inline math with apparent markup should not be processed',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('foo $1 *i* 1$ bar')),
        '<p>foo <code class="language-math math-inline">1 *i* 1</code> bar</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#09: block math can be indented up to 3 spaces',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('   $$\n   1+1 = 2\n   $$')),
        '<pre><code class="language-math math-display">1+1 = 2</code></pre>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#10: …but 4 means a code block',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('    $$\n    1+1 = 2\n    $$')),
        '<pre><code>$$\n1+1 = 2\n$$\n</code></pre>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#11: multiline inline math',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('foo $1 + 1\n= 2$ bar')),
        '<p>foo <code class="language-math math-inline">1 + 1\n= 2</code> bar</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#12: multiline display math',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('$$\n\n  1\n+ 1\n\n= 2\n\n$$')),
        '<pre><code class="language-math math-display">\n  1\n+ 1\n\n= 2\n</code></pre>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#13: text can immediately follow inline math',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('$n$-th order')),
        '<p><code class="language-math math-inline">n</code>-th order</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#14: display math self-closes at the end of document',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('$$\n1+1 = 2')),
        '<pre><code class="language-math math-display">1+1 = 2</code></pre>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#15: display and inline math can appear in lists',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('* $1+1 = 2$\n* $$\n  1+1 = 2\n  $$')),
        '<ul>\n<li><code class="language-math math-inline">1+1 = 2</code></li>\n<li>\n<pre><code class="language-math math-display">1+1 = 2</code></pre>\n</li>\n</ul>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#16: display math can be written in one line (deviation)',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('$$1+1 = 2$$')),
        '<p><code class="language-math math-inline">1+1 = 2</code></p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#17: …or on multiple lines with expression starting and ending on delimited lines (deviation)',
    async function () {
      // To do: this is broken.
      assert.deepEqual(
        String(await toHtml.process('$$\n[\n[1, 2]\n[3, 4]\n]\n$$')),
        '<pre><code class="language-math math-display">[\n[1, 2]\n[3, 4]\n]</code></pre>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#18: escaped delimiters should not render math (deviated)',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('Foo \\$1$ bar\n\\$\\$\n1\n\\$\\$')),
        '<p>Foo $1<code class="language-math math-inline"> bar\n\\</code>$\n1\n$$</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#19: numbers can not follow closing inline math (deviated)',
    async function () {
      assert.deepEqual(
        String(
          await toHtml.process(
            'Thus, $20,000 and USD$30,000 won’t parse as math.'
          )
        ),
        '<p>Thus, <code class="language-math math-inline">20,000 and USD</code>30,000 won’t parse as math.</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#20: require non whitespace to right of opening inline math (deviated)',
    async function () {
      assert.deepEqual(
        String(await toHtml.process('It is 2$ for a can of soda, not 1$.')),
        '<p>It is 2<code class="language-math math-inline"> for a can of soda, not 1</code>.</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#21: require non whitespace to left of closing inline math (deviated)',
    async function () {
      assert.deepEqual(
        String(
          await toHtml.process(
            'I’ll give $20 today, if you give me more $ tomorrow.'
          )
        ),
        '<p>I’ll give <code class="language-math math-inline">20 today, if you give me more </code> tomorrow.</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#23: escaped delimiters in math mode (deviated)',
    async function () {
      // #22 “inline blockmath is not (currently) registered” <-- we do support it!
      assert.deepEqual(
        String(await toHtml.process('Money adds: $\\$X + \\$Y = \\$Z$.')),
        '<p>Money adds: <code class="language-math math-inline">\\</code>X + $Y = $Z$.</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#24: multiple escaped delimiters in math module (deviated)',
    async function () {
      assert.deepEqual(
        String(
          await toHtml.process(
            'Weird-o: $\\displaystyle{\\begin{pmatrix} \\$ & 1\\\\\\$ \\end{pmatrix}}$.'
          )
        ),
        '<p>Weird-o: <code class="language-math math-inline">\\displaystyle{\\begin{pmatrix} \\</code> &#x26; 1\\$ \\end{pmatrix}}$.</p>'
      )
    }
  )
})
