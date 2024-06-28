const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
  const { openid } = event.data
  const wxContext = cloud.getWXContext()
  try {
    await db.collection('students').add({
      data: {
        OPENID: wxContext.OPENID,
      }
    });
    return {
      code: 0,
      msg: openid == wxContext.OPENID ? 'openid equals' : 'openid not equals'
    }
  } catch (e) {
    return {
      code: -1,
      msg: e,
    }
  }
};