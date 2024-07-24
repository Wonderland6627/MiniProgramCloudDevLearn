const cloud = require('wx-server-sdk')
cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
exports.main = async (event, context) => {
	const { modifies } = event.data
	try {
		const results = []
		const tasks = modifies.map(async (pack) => {
			const result = await db.collection('packages').where({
				seatType: pack.seatType,
				durationType: pack.durationType,
			}).update({
				data: {
					"price": pack.price,
					"giftDayCount": pack.giftDayCount,
				}
			})
			results.push(result)
		})
		await Promise.all(tasks)
		return {
			code: 0,
			results: results,
		}
	} catch (err) {
		return {
			code: -2,
			errMsg: err
		}
	}
}