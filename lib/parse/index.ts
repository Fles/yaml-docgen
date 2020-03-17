#! /usr/bin/env node
import * as fs from 'fs'
import * as path from 'path'
import { parse } from './parse'

module.exports = ({ I, O }) =>
  ((I: string, O: string): void => {
    const data = fs.readFileSync(path.resolve(I), 'utf-8')
    fs.writeFileSync(path.resolve(O), parse(data))
  })(I, O)
