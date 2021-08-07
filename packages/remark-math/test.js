import test from 'tape'
import {u} from 'unist-builder'
import {removePosition} from 'unist-util-remove-position'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkStringify from 'remark-stringify'
import remarkMath from './index.js'

test('remarkMath', function (t) {
  const toHtml = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeStringify)

  t.deepEqual(
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
    ]),
    'should parse inline and block math'
  )

  t.deepEqual(
    removePosition(
      unified().use(remarkParse).use(remarkMath).parse('\\$\\alpha$'),
      true
    ),
    u('root', [u('paragraph', [u('text', '$\\alpha$')])]),
    'should ignore an escaped opening dollar sign'
  )

  t.deepEqual(
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
    ]),
    'should *not* ignore an escaped closing dollar sign'
  )

  t.deepEqual(
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
    ]),
    'should support a escaped escape before a dollar sign'
  )

  t.deepEqual(
    removePosition(
      unified().use(remarkParse).use(remarkMath).parse('`$`\\alpha$'),
      true
    ),
    u('root', [u('paragraph', [u('inlineCode', '$'), u('text', '\\alpha$')])]),
    'should ignore dollar signs in inline code (#1)'
  )

  t.deepEqual(
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
    ]),
    'should allow backticks in math'
  )

  t.deepEqual(
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
    ]),
    'should support backticks in inline math'
  )

  t.deepEqual(
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
    ]),
    'should support a super factorial in inline math'
  )

  t.deepEqual(
    removePosition(
      unified().use(remarkParse).use(remarkMath).parse('$$\n\\alpha\\$\n$$'),
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
    ]),
    'should support a super factorial in block math'
  )

  t.deepEqual(
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
    ]),
    'should support a math block right after a paragraph'
  )

  t.deepEqual(
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
    ]),
    'should support inline math with double dollars'
  )

  t.deepEqual(
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
    ]),
    'should support block math with triple dollars'
  )

  t.deepEqual(
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
    ]),
    'should support indented block math'
  )

  t.deepEqual(
    unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkMath)
      .processSync('Math $\\alpha$\n\n$$\n\\beta+\\gamma\n$$\n')
      .toString(),
    'Math $\\alpha$\n\n$$\n\\beta+\\gamma\n$$\n',
    'should stringify inline and block math'
  )

  t.deepEqual(
    unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkMath)
      .processSync('> $$\n> \\alpha\\beta\n> $$\n')
      .toString(),
    '> $$\n> \\alpha\\beta\n> $$\n',
    'should stringify math in a blockquote'
  )

  t.deepEqual(
    String(toHtml.processSync('$$just two dollars')),
    '<div class="math math-display"></div>',
    'should support an opening fence w/ meta, w/o closing fence'
  )
  t.deepEqual(
    String(toHtml.processSync('$$  must\n\\alpha\n$$')),
    '<div class="math math-display">\\alpha</div>',
    'should support `meta`'
  )
  t.deepEqual(
    String(toHtml.processSync('$$  \n\\alpha\n$$')),
    '<div class="math math-display">\\alpha</div>',
    'should include values after the opening fence'
  )
  t.deepEqual(
    String(toHtml.processSync('$$\n\\alpha\nmust  $$')),
    '<div class="math math-display">\\alpha\nmust  $$</div>',
    'should not support values before the closing fence'
  )
  t.deepEqual(
    String(toHtml.processSync('$$\n\\alpha\n  $$')),
    '<div class="math math-display">\\alpha</div>',
    'should include values before the closing fence (except for spacing #2)'
  )
  t.deepEqual(
    String(toHtml.processSync('$$\n\\alpha\n$$  ')),
    '<div class="math math-display">\\alpha</div>',
    'should exclude spacing after the closing fence'
  )

  t.deepEqual(
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
    ]),
    'should not affect the next block'
  )

  t.deepEqual(
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
    ]),
    'should support two dollar signs on inline math'
  )

  t.deepEqual(
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
    'Math $\\alpha$\n\n$$\n\\beta+\\gamma\n$$\n',
    'should stringify a tree'
  )

  t.deepEqual(
    unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkMath)
      .processSync('$$\\alpha$$')
      .toString(),
    '$\\alpha$\n',
    'should stringify inline math with double dollars using one dollar by default'
  )

  t.deepEqual(
    unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkMath)
      .processSync('$$\\alpha$$')
      .toString(),
    '$\\alpha$\n',
    'should stringify inline math with double dollars using one dollar'
  )

  t.deepEqual(
    String(toHtml.processSync('$1+1 = 2$')),
    '<p><span class="math math-inline">1+1 = 2</span></p>',
    'markdown-it-katex#01'
  )
  t.deepEqual(
    String(toHtml.processSync('$$1+1 = 2$$')),
    '<p><span class="math math-inline">1+1 = 2</span></p>',
    'markdown-it-katex#02 (deviation)'
  )
  t.deepEqual(
    String(toHtml.processSync('foo$1+1 = 2$bar')),
    '<p>foo<span class="math math-inline">1+1 = 2</span>bar</p>',
    'markdown-it-katex#03: no whitespace before and after is fine'
  )
  t.deepEqual(
    String(toHtml.processSync('foo$-1+1 = 2$bar')),
    '<p>foo<span class="math math-inline">-1+1 = 2</span>bar</p>',
    'markdown-it-katex#04: even when it starts with a negative sign'
  )
  t.deepEqual(
    String(toHtml.processSync('aaa $$ bbb')),
    '<p>aaa $$ bbb</p>',
    'markdown-it-katex#05: shouldn’t render empty content'
  )
  t.deepEqual(
    String(toHtml.processSync('aaa $5.99 bbb')),
    '<p>aaa $5.99 bbb</p>',
    'markdown-it-katex#06: should require a closing delimiter'
  )
  t.deepEqual(
    String(toHtml.processSync('foo $1+1\n\n= 2$ bar')),
    '<p>foo $1+1</p>\n<p>= 2$ bar</p>',
    'markdown-it-katex#07: paragraph break in inline math is not allowed'
  )
  t.deepEqual(
    String(toHtml.processSync('foo $1 *i* 1$ bar')),
    '<p>foo <span class="math math-inline">1 *i* 1</span> bar</p>',
    'markdown-it-katex#08: inline math with apparent markup should not be processed'
  )
  t.deepEqual(
    String(toHtml.processSync('   $$\n   1+1 = 2\n   $$')),
    '<div class="math math-display">1+1 = 2</div>',
    'markdown-it-katex#09: block math can be indented up to 3 spaces'
  )
  t.deepEqual(
    String(toHtml.processSync('    $$\n    1+1 = 2\n    $$')),
    '<pre><code>$$\n1+1 = 2\n$$\n</code></pre>',
    'markdown-it-katex#10: …but 4 means a code block'
  )
  t.deepEqual(
    String(toHtml.processSync('foo $1 + 1\n= 2$ bar')),
    '<p>foo <span class="math math-inline">1 + 1\n= 2</span> bar</p>',
    'markdown-it-katex#11: multiline inline math'
  )
  t.deepEqual(
    String(toHtml.processSync('$$\n\n  1\n+ 1\n\n= 2\n\n$$')),
    '<div class="math math-display">\n  1\n+ 1\n\n= 2\n</div>',
    'markdown-it-katex#12: multiline display math'
  )
  t.deepEqual(
    String(toHtml.processSync('$n$-th order')),
    '<p><span class="math math-inline">n</span>-th order</p>',
    'markdown-it-katex#13: text can immediately follow inline math'
  )
  t.deepEqual(
    String(toHtml.processSync('$$\n1+1 = 2')),
    '<div class="math math-display">1+1 = 2</div>',
    'markdown-it-katex#14: display math self-closes at the end of document'
  )
  t.deepEqual(
    String(toHtml.processSync('* $1+1 = 2$\n* $$\n  1+1 = 2\n  $$')),
    '<ul>\n<li><span class="math math-inline">1+1 = 2</span></li>\n<li>\n<div class="math math-display">1+1 = 2</div>\n</li>\n</ul>',
    'markdown-it-katex#15: display and inline math can appear in lists'
  )
  t.deepEqual(
    String(toHtml.processSync('$$1+1 = 2$$')),
    '<p><span class="math math-inline">1+1 = 2</span></p>',
    'markdown-it-katex#16: display math can be written in one line (deviation)'
  )
  // To do: this is broken.
  t.deepEqual(
    String(toHtml.processSync('$$\n[\n[1, 2]\n[3, 4]\n]\n$$')),
    '<div class="math math-display">[\n[1, 2]\n[3, 4]\n]</div>',
    'markdown-it-katex#17: …or on multiple lines with expression starting and ending on delimited lines (deviation)'
  )
  t.deepEqual(
    String(toHtml.processSync('Foo \\$1$ bar\n\\$\\$\n1\n\\$\\$')),
    '<p>Foo $1<span class="math math-inline"> bar\n\\</span>$\n1\n$$</p>',
    'markdown-it-katex#18: escaped delimiters should not render math (deviated)'
  )
  t.deepEqual(
    String(
      toHtml.processSync('Thus, $20,000 and USD$30,000 won’t parse as math.')
    ),
    '<p>Thus, <span class="math math-inline">20,000 and USD</span>30,000 won’t parse as math.</p>',
    'markdown-it-katex#19: numbers can not follow closing inline math (deviated)'
  )
  t.deepEqual(
    String(toHtml.processSync('It is 2$ for a can of soda, not 1$.')),
    '<p>It is 2<span class="math math-inline"> for a can of soda, not 1</span>.</p>',
    'markdown-it-katex#20: require non whitespace to right of opening inline math (deviated)'
  )
  t.deepEqual(
    String(
      toHtml.processSync('I’ll give $20 today, if you give me more $ tomorrow.')
    ),
    '<p>I’ll give <span class="math math-inline">20 today, if you give me more </span> tomorrow.</p>',
    'markdown-it-katex#21: require non whitespace to left of closing inline math (deviated)'
  )
  // #22 “inline blockmath is not (currently) registered” <-- we do support it!
  t.deepEqual(
    String(toHtml.processSync('Money adds: $\\$X + \\$Y = \\$Z$.')),
    '<p>Money adds: <span class="math math-inline">\\</span>X + $Y = $Z$.</p>',
    'markdown-it-katex#23: escaped delimiters in math mode (deviated)'
  )
  t.deepEqual(
    String(
      toHtml.processSync(
        'Weird-o: $\\displaystyle{\\begin{pmatrix} \\$ & 1\\\\\\$ \\end{pmatrix}}$.'
      )
    ),
    '<p>Weird-o: <span class="math math-inline">\\displaystyle{\\begin{pmatrix} \\</span> &#x26; 1\\$ \\end{pmatrix}}$.</p>',
    'markdown-it-katex#24: multiple escaped delimiters in math module (deviated)'
  )

  t.end()
})
