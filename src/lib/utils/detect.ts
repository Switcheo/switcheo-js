export const isNodeJS: boolean =
  (typeof process !== 'undefined') && (process.release.name === 'node')
