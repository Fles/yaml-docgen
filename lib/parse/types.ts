export type DocBlockTarget = {
  start: '#(#|!|\\?)#'
  end: '(: |:\n)'
}

export type DocBlockType = '!' | '?' | '#'

export type DocBlock = {
  payload: string
  type?: DocBlockType
  reference: string
  options?: string[]
}
