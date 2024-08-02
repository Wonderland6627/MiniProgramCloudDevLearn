const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
  const { phoneNumber, password } = event.data;
  try {
    const result = await db.collection('students')
      .where({ phone: phoneNumber })
      .field({ password: true })
      .get();
    if (result?.data.length == 0) {
      return {
        code: -1,
      };
    }
    const dbPassword = result.data[0].password;
    const matched = (password === dbPassword);
    
    return {
      code: matched ? 0 : -2,
    };
  } catch (err) {
    console.error("登录错误: " + err)
    return {
      code: -3,
    };
  }
};