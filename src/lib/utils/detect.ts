export const isNodeJS: boolean =
  (typeof process !== 'undefined') && process.release && (process.release.name === 'node')
