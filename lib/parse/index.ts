#! /usr/bin/env node

const fs = require('fs')
const { exec } = require('child_process')

const makeMD = (I, O) => {
  const rawData = fs.readFileSync(I, 'utf8')
  const blockMatches = rawData.match(/(?<=###)(.*?)(?=\:)/gs)
  const blocks = blockMatches.map(bm => {
    const [comment, reference] = bm.split('\n')
    const kind = bm.split('\n')[0].split(' ')[0]
    return [kind, reference, comment]
  })

  let markdown = ''

  blocks.forEach((block, idx) => {
    const [kind, reference, comment] = block
    if (kind === '.') {
      markdown += `\n\n###\`${reference.replace(
        /^\s+|\s+$/g,
        ''
      )}\`\n\n> ${comment.replace(/!|\?|\.|\*/g, '')}\n\n`
      if (blocks[idx + 1][0] !== '.') {
        markdown +=
          '\n| Name | Description | Options | Default | Required |\n| :--- | :--- | :---: | :---: | :---:|\n'
      }
    }
    if (kind === '?' || kind === '!') {
      const name = '`' + reference.replace(/^\s+|\s+$/g, '') + '`'
      const description = comment
        .replace(/!|\?|\.|\*/g, '')
        .replace(/\[.*?\]/, '')
      const options = comment.match(/(?<=\[)(.*?)(?=\])/gs) || ''
      const req =
        comment.substring(0, 1) === '!'
          ? 'yes'
          : comment.substring(0, 1) === '?'
          ? 'no'
          : ''
      const defVal = comment.match(/(?<=\*\*)(.*?)(?=\*\*)/gs) || ''
      markdown += `| ${name} | ${description} | ${options} | ${defVal} | ${req} |\n`
    }
  })
  fs.writeFileSync(O, markdown)
  exec(`npx prettier --write ${O}`, (err, stdout, stderr) => {
    if (err) {
      console.log(`✘ yaml2md: error occurred!`)
      console.error(err)
    } else {
      console.log(`✔ yaml2md: documentation generated!`)
    }
  })
}

module.exports = ({ I, O }) => makeMD(I, O)
