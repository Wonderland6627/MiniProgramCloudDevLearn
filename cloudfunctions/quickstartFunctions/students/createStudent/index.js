const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  const { OPENID, modifies } = event.data
  try {
		const existsResult = await db.collection('students')
			.where({ OPENID: OPENID })
			.get()
		if (existsResult?.data.length > 0) {
			return {
				code: -2,
				errMsg: `student info with openid: ${OPENID} already exists`,
			}
		}
    await db.collection('students')
      .add({
        data: modifies,
      })
    return {
      code: 0
    }
  } catch (err) {
    return {
      code: -1,
      errMsg: `student info with openid: ${OPENID} create failed: ${err}`,
    }
  }
};
