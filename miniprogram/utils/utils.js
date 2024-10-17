function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function cloneWithJSON(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function generateGUID() {
  let guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
  return guid
}

module.exports = {
  isEmpty: isEmpty,
  cloneWithJSON: cloneWithJSON,
  generateGUID: generateGUID,
}