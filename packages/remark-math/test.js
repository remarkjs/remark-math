import assert from 'node:assert/strict'
import test from 'node:test'
import {u} from 'unist-builder'
import {removePosition} from 'unist-util-remove-position'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkStringify from 'remark-stringify'
import remarkMath from './index.js'

test('remarkMath', async function (t) {
  const toHtml = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeStringify)

  await t.test('should parse inline and block math', async function () {
    assert.deepEqual(
      removePosition(
        unified()
          .use(remarkParse)
          .use(remarkMath)
          .parse('Math $\\alpha$\n\n$$\n\\beta+\\gamma\n$$'),
        true
      ),
      u('root', [
        u('paragraph', [
          u('text', 'Math '),
          u(
            'inlineMath',
            {
              data: {
                hName: 'span',
                hProperties: {className: ['math', 'math-inline']},
                hChildren: [u('text', '\\alpha')]
              }
            },
            '\\alpha'
          )
        ]),
        u(
          'math',
          {
            meta: null,
            data: {
              hName: 'div',
              hProperties: {className: ['math', 'math-display']},
              hChildren: [u('text', '\\beta+\\gamma')]
            }
          },
          '\\beta+\\gamma'
        )
      ])
    )
  })

  await t.test(
    'should ignore an escaped opening dollar sign',
    async function () {
      assert.deepEqual(
        removePosition(
          unified().use(remarkParse).use(remarkMath).parse('\\$\\alpha$'),
          true
        ),
        u('root', [u('paragraph', [u('text', '$\\alpha$')])])
      )
    }
  )

  await t.test(
    'should *not* ignore an escaped closing dollar sign',
    async function () {
      assert.deepEqual(
        removePosition(
          unified().use(remarkParse).use(remarkMath).parse('$\\alpha\\$'),
          true
        ),
        u('root', [
          u('paragraph', [
            u(
              'inlineMath',
              {
                data: {
                  hName: 'span',
                  hProperties: {className: ['math', 'math-inline']},
                  hChildren: [u('text', '\\alpha\\')]
                }
              },
              '\\alpha\\'
            )
          ])
        ])
      )
    }
  )

  await t.test(
    'should support a escaped escape before a dollar sign',
    async function () {
      assert.deepEqual(
        removePosition(
          unified().use(remarkParse).use(remarkMath).parse('\\\\$\\alpha$'),
          true
        ),
        u('root', [
          u('paragraph', [
            u('text', '\\'),
            u(
              'inlineMath',
              {
                data: {
                  hName: 'span',
                  hProperties: {className: ['math', 'math-inline']},
                  hChildren: [u('text', '\\alpha')]
                }
              },
              '\\alpha'
            )
          ])
        ])
      )
    }
  )

  await t.test(
    'should ignore dollar signs in inline code (#1)',
    async function () {
      assert.deepEqual(
        removePosition(
          unified().use(remarkParse).use(remarkMath).parse('`$`\\alpha$'),
          true
        ),
        u('root', [
          u('paragraph', [u('inlineCode', '$'), u('text', '\\alpha$')])
        ])
      )
    }
  )

  await t.test('should allow backticks in math', async function () {
    assert.deepEqual(
      removePosition(
        unified().use(remarkParse).use(remarkMath).parse('$\\alpha`$`'),
        true
      ),
      u('root', [
        u('paragraph', [
          u(
            'inlineMath',
            {
              data: {
                hName: 'span',
                hProperties: {className: ['math', 'math-inline']},
                hChildren: [u('text', '\\alpha`')]
              }
            },
            '\\alpha`'
          ),
          u('text', '`')
        ])
      ])
    )
  })

  await t.test('should support backticks in inline math', async function () {
    assert.deepEqual(
      removePosition(
        unified().use(remarkParse).use(remarkMath).parse('$`\\alpha`$'),
        true
      ),
      u('root', [
        u('paragraph', [
          u(
            'inlineMath',
            {
              data: {
                hName: 'span',
                hProperties: {className: ['math', 'math-inline']},
                hChildren: [u('text', '`\\alpha`')]
              }
            },
            '`\\alpha`'
          )
        ])
      ])
    )
  })

  await t.test(
    'should support a super factorial in inline math',
    async function () {
      assert.deepEqual(
        removePosition(
          unified().use(remarkParse).use(remarkMath).parse('$$ \\alpha$ $$'),
          true
        ),
        u('root', [
          u('paragraph', [
            u(
              'inlineMath',
              {
                data: {
                  hName: 'span',
                  hProperties: {className: ['math', 'math-inline']},
                  hChildren: [u('text', '\\alpha$')]
                }
              },
              '\\alpha$'
            )
          ])
        ])
      )
    }
  )

  await t.test(
    'should support a super factorial in block math',
    async function () {
      assert.deepEqual(
        removePosition(
          unified()
            .use(remarkParse)
            .use(remarkMath)
            .parse('$$\n\\alpha\\$\n$$'),
          true
        ),
        u('root', [
          u(
            'math',
            {
              meta: null,
              data: {
                hName: 'div',
                hProperties: {className: ['math', 'math-display']},
                hChildren: [u('text', '\\alpha\\$')]
              }
            },
            '\\alpha\\$'
          )
        ])
      )
    }
  )

  await t.test(
    'should support a math block right after a paragraph',
    async function () {
      assert.deepEqual(
        removePosition(
          unified()
            .use(remarkParse)
            .use(remarkMath)
            .parse('tango\n$$\n\\alpha\n$$'),
          true
        ),
        u('root', [
          u('paragraph', [u('text', 'tango')]),
          u(
            'math',
            {
              meta: null,
              data: {
                hName: 'div',
                hProperties: {className: ['math', 'math-display']},
                hChildren: [u('text', '\\alpha')]
              }
            },
            '\\alpha'
          )
        ])
      )
    }
  )

  await t.test(
    'should support inline math with double dollars',
    async function () {
      assert.deepEqual(
        removePosition(
          unified().use(remarkParse).use(remarkMath).parse('$$\\alpha$$'),
          true
        ),
        u('root', [
          u('paragraph', [
            u(
              'inlineMath',
              {
                data: {
                  hName: 'span',
                  hProperties: {className: ['math', 'math-inline']},
                  hChildren: [u('text', '\\alpha')]
                }
              },
              '\\alpha'
            )
          ])
        ])
      )
    }
  )

  await t.test(
    'should support block math with triple dollars',
    async function () {
      assert.deepEqual(
        removePosition(
          unified().use(remarkParse).use(remarkMath).parse('$$$\n\\alpha\n$$$'),
          true
        ),
        u('root', [
          u(
            'math',
            {
              meta: null,
              data: {
                hName: 'div',
                hProperties: {className: ['math', 'math-display']},
                hChildren: [u('text', '\\alpha')]
              }
            },
            '\\alpha'
          )
        ])
      )
    }
  )

  await t.test('should support indented block math', async function () {
    assert.deepEqual(
      removePosition(
        unified()
          .use(remarkParse)
          .use(remarkMath)
          .parse('  $$\n    \\alpha\n  $$'),
        true
      ),
      u('root', [
        u(
          'math',
          {
            meta: null,
            data: {
              hName: 'div',
              hProperties: {className: ['math', 'math-display']},
              hChildren: [u('text', '  \\alpha')]
            }
          },
          '  \\alpha'
        )
      ])
    )
  })

  await t.test('should stringify inline and block math', async function () {
    assert.deepEqual(
      unified()
        .use(remarkParse)
        .use(remarkStringify)
        .use(remarkMath)
        .processSync('Math $\\alpha$\n\n$$\n\\beta+\\gamma\n$$\n')
        .toString(),
      'Math $\\alpha$\n\n$$\n\\beta+\\gamma\n$$\n'
    )
  })

  await t.test(
    'should support `singleDollarTextMath: false` (1)',
    async function () {
      assert.deepEqual(
        unified()
          .use(remarkParse)
          .use(remarkStringify)
          .use(remarkMath, {singleDollarTextMath: false})
          .processSync('Math $\\alpha$\n\n$$\\beta+\\gamma$$\n')
          .toString(),
        'Math $\\alpha$\n\n$$\\beta+\\gamma$$\n'
      )
    }
  )

  await t.test(
    'should support `singleDollarTextMath: false` (2)',
    async function () {
      assert.deepEqual(
        unified()
          .use(remarkParse)
          .use(remarkMath, {singleDollarTextMath: false})
          .use(remarkRehype)
          .use(rehypeStringify)
          .processSync('Math $\\alpha$\n\n$$\\beta+\\gamma$$\n')
          .toString(),
        '<p>Math $\\alpha$</p>\n<p><span class="math math-inline">\\beta+\\gamma</span></p>'
      )
    }
  )

  await t.test('should stringify math in a blockquote', async function () {
    assert.deepEqual(
      unified()
        .use(remarkParse)
        .use(remarkStringify)
        .use(remarkMath)
        .processSync('> $$\n> \\alpha\\beta\n> $$\n')
        .toString(),
      '> $$\n> \\alpha\\beta\n> $$\n'
    )
  })

  await t.test(
    'should support an opening fence w/ meta, w/o closing fence',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('$$just two dollars')),
        '<div class="math math-display"></div>'
      )
    }
  )

  await t.test('should support `meta`', async function () {
    assert.deepEqual(
      String(toHtml.processSync('$$  must\n\\alpha\n$$')),
      '<div class="math math-display">\\alpha</div>'
    )
  })

  await t.test(
    'should include values after the opening fence',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('$$  \n\\alpha\n$$')),
        '<div class="math math-display">\\alpha</div>'
      )
    }
  )

  await t.test(
    'should not support values before the closing fence',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('$$\n\\alpha\nmust  $$')),
        '<div class="math math-display">\\alpha\nmust  $$</div>'
      )
    }
  )

  await t.test(
    'should include values before the closing fence (except for spacing #2)',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('$$\n\\alpha\n  $$')),
        '<div class="math math-display">\\alpha</div>'
      )
    }
  )

  await t.test(
    'should exclude spacing after the closing fence',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('$$\n\\alpha\n$$  ')),
        '<div class="math math-display">\\alpha</div>'
      )
    }
  )

  await t.test('should not affect the next block', async function () {
    assert.deepEqual(
      removePosition(
        unified()
          .use(remarkParse)
          .use(remarkMath)
          .parse('$$\n\\alpha\n$$\n```\nbravo\n```\n'),
        true
      ),
      u('root', [
        u(
          'math',
          {
            meta: null,
            data: {
              hName: 'div',
              hProperties: {className: ['math', 'math-display']},
              hChildren: [u('text', '\\alpha')]
            }
          },
          '\\alpha'
        ),
        u('code', {lang: null, meta: null}, 'bravo')
      ])
    )
  })

  await t.test(
    'should support two dollar signs on inline math',
    async function () {
      assert.deepEqual(
        removePosition(
          unified().use(remarkParse).use(remarkMath).parse('$$\\alpha$$'),
          true
        ),
        u('root', [
          u('paragraph', [
            u(
              'inlineMath',
              {
                data: {
                  hName: 'span',
                  hProperties: {className: ['math', 'math-inline']},
                  hChildren: [u('text', '\\alpha')]
                }
              },
              '\\alpha'
            )
          ])
        ])
      )
    }
  )

  await t.test('should stringify a tree', async function () {
    assert.deepEqual(
      unified()
        .use(remarkStringify)
        .use(remarkMath)
        .stringify(
          u('root', [
            u('paragraph', [u('text', 'Math '), u('inlineMath', '\\alpha')]),
            u('math', '\\beta+\\gamma')
          ])
        )
        .toString(),
      'Math $\\alpha$\n\n$$\n\\beta+\\gamma\n$$\n'
    )
  })

  await t.test(
    'should stringify inline math with double dollars using one dollar by default',
    async function () {
      assert.deepEqual(
        unified()
          .use(remarkParse)
          .use(remarkStringify)
          .use(remarkMath)
          .processSync('$$\\alpha$$')
          .toString(),
        '$\\alpha$\n'
      )
    }
  )

  await t.test(
    'should stringify inline math with double dollars using one dollar',
    async function () {
      assert.deepEqual(
        unified()
          .use(remarkParse)
          .use(remarkStringify)
          .use(remarkMath)
          .processSync('$$\\alpha$$')
          .toString(),
        '$\\alpha$\n'
      )
    }
  )

  await t.test('should do markdown-it-katex#01', async function () {
    assert.deepEqual(
      String(toHtml.processSync('$1+1 = 2$')),
      '<p><span class="math math-inline">1+1 = 2</span></p>'
    )
  })

  await t.test('should do markdown-it-katex#02 (deviation)', async function () {
    assert.deepEqual(
      String(toHtml.processSync('$$1+1 = 2$$')),
      '<p><span class="math math-inline">1+1 = 2</span></p>'
    )
  })

  await t.test(
    'should do markdown-it-katex#03: no whitespace before and after is fine',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('foo$1+1 = 2$bar')),
        '<p>foo<span class="math math-inline">1+1 = 2</span>bar</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#04: even when it starts with a negative sign',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('foo$-1+1 = 2$bar')),
        '<p>foo<span class="math math-inline">-1+1 = 2</span>bar</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#05: shouldn’t render empty content',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('aaa $$ bbb')),
        '<p>aaa $$ bbb</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#06: should require a closing delimiter',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('aaa $5.99 bbb')),
        '<p>aaa $5.99 bbb</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#07: paragraph break in inline math is not allowed',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('foo $1+1\n\n= 2$ bar')),
        '<p>foo $1+1</p>\n<p>= 2$ bar</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#08: inline math with apparent markup should not be processed',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('foo $1 *i* 1$ bar')),
        '<p>foo <span class="math math-inline">1 *i* 1</span> bar</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#09: block math can be indented up to 3 spaces',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('   $$\n   1+1 = 2\n   $$')),
        '<div class="math math-display">1+1 = 2</div>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#10: …but 4 means a code block',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('    $$\n    1+1 = 2\n    $$')),
        '<pre><code>$$\n1+1 = 2\n$$\n</code></pre>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#11: multiline inline math',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('foo $1 + 1\n= 2$ bar')),
        '<p>foo <span class="math math-inline">1 + 1\n= 2</span> bar</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#12: multiline display math',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('$$\n\n  1\n+ 1\n\n= 2\n\n$$')),
        '<div class="math math-display">\n  1\n+ 1\n\n= 2\n</div>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#13: text can immediately follow inline math',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('$n$-th order')),
        '<p><span class="math math-inline">n</span>-th order</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#14: display math self-closes at the end of document',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('$$\n1+1 = 2')),
        '<div class="math math-display">1+1 = 2</div>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#15: display and inline math can appear in lists',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('* $1+1 = 2$\n* $$\n  1+1 = 2\n  $$')),
        '<ul>\n<li><span class="math math-inline">1+1 = 2</span></li>\n<li>\n<div class="math math-display">1+1 = 2</div>\n</li>\n</ul>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#16: display math can be written in one line (deviation)',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('$$1+1 = 2$$')),
        '<p><span class="math math-inline">1+1 = 2</span></p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#17: …or on multiple lines with expression starting and ending on delimited lines (deviation)',
    async function () {
      // To do: this is broken.
      assert.deepEqual(
        String(toHtml.processSync('$$\n[\n[1, 2]\n[3, 4]\n]\n$$')),
        '<div class="math math-display">[\n[1, 2]\n[3, 4]\n]</div>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#18: escaped delimiters should not render math (deviated)',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('Foo \\$1$ bar\n\\$\\$\n1\n\\$\\$')),
        '<p>Foo $1<span class="math math-inline"> bar\n\\</span>$\n1\n$$</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#19: numbers can not follow closing inline math (deviated)',
    async function () {
      assert.deepEqual(
        String(
          toHtml.processSync(
            'Thus, $20,000 and USD$30,000 won’t parse as math.'
          )
        ),
        '<p>Thus, <span class="math math-inline">20,000 and USD</span>30,000 won’t parse as math.</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#20: require non whitespace to right of opening inline math (deviated)',
    async function () {
      assert.deepEqual(
        String(toHtml.processSync('It is 2$ for a can of soda, not 1$.')),
        '<p>It is 2<span class="math math-inline"> for a can of soda, not 1</span>.</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#21: require non whitespace to left of closing inline math (deviated)',
    async function () {
      assert.deepEqual(
        String(
          toHtml.processSync(
            'I’ll give $20 today, if you give me more $ tomorrow.'
          )
        ),
        '<p>I’ll give <span class="math math-inline">20 today, if you give me more </span> tomorrow.</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#23: escaped delimiters in math mode (deviated)',
    async function () {
      // #22 “inline blockmath is not (currently) registered” <-- we do support it!
      assert.deepEqual(
        String(toHtml.processSync('Money adds: $\\$X + \\$Y = \\$Z$.')),
        '<p>Money adds: <span class="math math-inline">\\</span>X + $Y = $Z$.</p>'
      )
    }
  )

  await t.test(
    'should do markdown-it-katex#24: multiple escaped delimiters in math module (deviated)',
    async function () {
      assert.deepEqual(
        String(
          toHtml.processSync(
            'Weird-o: $\\displaystyle{\\begin{pmatrix} \\$ & 1\\\\\\$ \\end{pmatrix}}$.'
          )
        ),
        '<p>Weird-o: <span class="math math-inline">\\displaystyle{\\begin{pmatrix} \\</span> &#x26; 1\\$ \\end{pmatrix}}$.</p>'
      )
    }
  )
})
