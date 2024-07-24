const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  try {
		const existsResult = await db.collection('students')
			.where({ OPENID: openid })
			.get()
		if (existsResult?.data.length > 0) {
			return {
				code: 1,
				msg: 'data with openid: [' + openid + '] already exists',
			}
		}
    await createData(openid)
    return {
      code: 0,
      msg: 'add new data with openid: [' + openid + '] into students',
    }
  } catch (err) {
    return {
      code: -1,
      msg: err + ', openid: [' + openid + ']',
    }
  }
};

async function checkDataExists(openid) {
  const result = await db.collection('students')
    .where({ OPENID: openid })
    .get()
  return result?.data.length > 0
}

async function createData(openid) {
  await db.collection('students')
    .add({
      data: { OPENID: openid }
    })
}
