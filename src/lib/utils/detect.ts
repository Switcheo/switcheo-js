export function isNodeJS: boolean {
  return (typeof process !== 'undefined') && (process.release.name === 'node')
}
