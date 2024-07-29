const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
	const { phone, OPENID } = event.data
	try {
		const result = await db.collection('students')
			.where({ 
				phone: phone,
				OPENID: 'UNKNOWN',
			})
			.update({
				data: {
					"OPENID": OPENID,
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