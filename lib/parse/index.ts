#! /usr/bin/env node
import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'
import { exec as child_process_exec } from 'child_process'
import { DocBlock, DocBlockTarget } from './types'
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
    })) as DocBlock[]

const parse = (I: string, O: string): void => {
  const data = fs.readFileSync(path.resolve(I), 'utf-8')
  const docs = extractDocBlocks(data, '#(#|!|\\?)#', '(: |:\n)')

  console.log(docs)
}

/*
 * EXPORT
 */
module.exports = ({ I, O }) => parse(I, O)
