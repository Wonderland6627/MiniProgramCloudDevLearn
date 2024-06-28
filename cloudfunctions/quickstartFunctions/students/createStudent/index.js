const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
  const { openid } = event.data
  try {
    await db.collection('students').add({
      data: {
        OPENID: openid,
      }
    });
    return {
      code: 0,
    }
  } catch (e) {
    return {
      code: -1,
      err: e,
    }
  }
};