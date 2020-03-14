export type DocBlockTarget = {
  start: '#(#|!|\\?)#'
  end: '(: |:\n)'
}
export type DocBlock = {
  payload: string
  type?: '!' | '?'
  reference: string
}
