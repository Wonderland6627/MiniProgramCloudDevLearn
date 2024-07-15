const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
  const { storeID, newPwd } = event.data;
  try {
    const result = await db.collection('stores')
      .where({ storeID: storeID })
      .update({
        data: {
          "accessControlPassword": newPwd,
        }
      })
    if (!result) {
      return {
        code: -1,
        errMsg: "empty update result"
      }
    }
    return {
      code: 0,
      result: result
    }
  } catch (err) {
    return {
      code: -2,
      errMsg: err
    };
  }
};