const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
	const { OPENID, modifies } = event.data
	try {
		const result = await db.collection('students')
			.where({ 
				OPENID: OPENID,
			})
			.update({
				data: modifies,
			})
		return {
			code: 0,
      result: result
		}
	} catch (err) {
    return {
      code: -1,
      errMsg: err
    };
  }
};