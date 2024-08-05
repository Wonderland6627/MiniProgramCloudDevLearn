export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export function cloneWithJSON(obj) {
  return JSON.parse(JSON.stringify(obj))
}