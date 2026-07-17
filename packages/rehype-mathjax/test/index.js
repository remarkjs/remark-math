/* eslint-disable no-await-in-loop */
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import test from 'node:test'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import {unified} from 'unified'
import rehypeMathJaxChtml from 'rehype-mathjax/chtml'
import rehypeMathJaxSvg from '../lib/svg.js'
import {fixtures, base} from './fixtures.js'

test('rehype-mathjax', async function (t) {
  await t.test(
    'should expose the public api for `rehype-mathjax`',
    async function () {
      assert.deepEqual(Object.keys(await import('rehype-mathjax')).sort(), [
        'default'
      ])
    }
  )

  await t.test(
    'should expose the public api for `rehype-mathjax/browser`',
    async function () {
      assert.deepEqual(
        Object.keys(await import('rehype-mathjax/browser')).sort(),
        ['default']
      )
    }
  )

  await t.test(
    'should expose the public api for `rehype-mathjax/chtml`',
    async function () {
      assert.deepEqual(
        Object.keys(await import('rehype-mathjax/chtml')).sort(),
        ['default']
      )
    }
  )

  await t.test(
    'should expose the public api for `rehype-mathjax/svg`',
    async function () {
      assert.deepEqual(Object.keys(await import('rehype-mathjax/svg')).sort(), [
        'default'
      ])
    }
  )

  await t.test('should crash for CHTML w/o `fontURL`', async function () {
    try {
      await unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxChtml)
        .use(rehypeStringify)
        .process(
          await fs.readFile(new URL('equation-numbering-2-svg.html', base))
        )
      assert.fail()
    } catch (error) {
      assert.match(
        String(error),
        /rehype-mathjax: missing `fontURL` in options/
      )
    }
  })

  for (const fixture of fixtures) {
    await t.test(fixture.description, async function () {
      const input = await fs.readFile(new URL(fixture.input, base))
      const expected = String(await fs.readFile(new URL(fixture.output, base)))
      const actual = String(await fixture.process(input))
      assert.equal(actual.trim(), expected.trim())
    })
  }

  await t.test(
    'should catch MathJax exceptions to file messages',
    async function () {
      const file = await unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxSvg)
        .use(rehypeStringify)
        .process(await fs.readFile(new URL('error.html', base)))
      assert.deepEqual(file.messages.map(String), [
        '1:1-1:44: Could not render math with mathjax'
      ])
    }
  )
})
