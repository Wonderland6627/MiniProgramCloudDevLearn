function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function cloneWithJSON(obj) {
  return JSON.parse(JSON.stringify(obj))
}

module.exports = {
  isEmpty: isEmpty,
  cloneWithJSON: cloneWithJSON
}