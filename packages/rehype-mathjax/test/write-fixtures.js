import fs from 'node:fs/promises'
import {fixtures, base} from './fixtures.js'

await Promise.all(
  fixtures.map(async (fixture) => {
    console.log(`Writing fixture for "${fixture.description}"`)
    const input = await fs.readFile(new URL(fixture.input, base))
    const output = await fixture.process(input)
    await fs.writeFile(new URL(fixture.output, base), String(output))
  })
)
