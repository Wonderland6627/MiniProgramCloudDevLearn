const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
  const result = await db.collection('stores')
    .get();
  return {
    dataList: result?.data,
  };
};