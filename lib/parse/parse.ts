#! /usr/bin/env node
import * as util from 'util'
import { exec as child_process_exec } from 'child_process'
import { DocBlock, DocBlockType, DocBlockTarget } from './types'
const exec = util.promisify(child_process_exec)

/**
 * **Extract DocBlock's from raw data**
 * @param {string} data - source
 * @param {DocBlockTarget.start} start - start of block
 * @param {DocBlockTarget.end} end - end of block (last character of next line)
 * @returns {DocBlock[]} list of DocBlocks
 */
const extractDocBlocks = (
  data: string,
  start: DocBlockTarget['start'],
  end: DocBlockTarget['end']
): DocBlock[] =>
  data
    .match(new RegExp(`(?=${start})(.*?)(?=${end})`, 'gs'))
    .map(db => db.split('\n'))
    .map(db => ({
      payload: db[0].substring(4),
      reference: db[1].replace(/^\s+|\s+$/g, ''),
      type: db[0].charAt(1),
      options: db[0].match(/(?<=\[)(.*?)(?=\])/gs),
    })) as DocBlock[]

const parseDocBLockToMD = (
  { reference, type, payload }: DocBlock,
  hasTable: boolean
): string => {
  let res = ''
  if (type === '#') {
    res += `\n# \`${reference}\`\n${payload}\n\n`
  }
  if (hasTable) {
    res += `> | Type | Description |\n> |---|---|\n`
  }
  if (type === '?' || type === '!') {
    res += `> |\`${reference}\`|${payload}|\n`
  }
  return res
}

const generateMarkdown = (collection: DocBlock[]): string => {
  return collection.reduce(
    (_, docBlock, i, c) =>
      _ +
      parseDocBLockToMD(
        docBlock,
        Boolean(docBlock.type === '#' && c[i + 1] && c[i + 1].type !== '#')
      ),
    ''
  )
}

export const parse = (data: string): string => {
  const docs = extractDocBlocks(data, '#(#|!|\\?)#', '(: |:\n)')
  return generateMarkdown(docs)
}
