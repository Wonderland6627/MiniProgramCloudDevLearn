const request = require('request')
exports.main = async (event, context) => {
  const { js_code } = event.data
  const appid = 'wx44c4c158f1c2daa2'
  const secret = '1aab469022ad2765762d8c53b61ca61b'
  try {
    const result = await code2Session(appid, secret, js_code)
    return js_code + " " + result
  } catch (error) {
    return js_code + " " + error
  }
};

function code2Session(appid, secret, js_code) {
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${js_code}&grant_type=authorization_code`;
  const promise = new Promise((resolve, reject) => {
    request.get(url, (error, response, body) => {
      if (error) {
        reject(error)
      } else {
        const result = JSON.parse(body)
        resolve(result)
      }
    })
  })
  return promise
}