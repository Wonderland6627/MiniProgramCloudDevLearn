// remoteConfig.js

const logger = require('./logger.js')

const remoteConfig = {
	fetchCount: 0,
	config: { //local default config
		programMode: 'private',
		swiperImagesList: [
			"https://636c-cloud1-8gewsvyn8efe62b8-1327447321.tcb.qcloud.la/nbstudy/swiper_images/default/default_swiper_image_0.jpg?sign=6113607f0ae007858c7387a71eab47ea&t=1750645097",
			"https://636c-cloud1-8gewsvyn8efe62b8-1327447321.tcb.qcloud.la/nbstudy/swiper_images/default/default_swiper_image_1.jpg?sign=66f1316f932b14b9abce88c2fe1cc468&t=1750645106",
			"https://636c-cloud1-8gewsvyn8efe62b8-1327447321.tcb.qcloud.la/nbstudy/swiper_images/default/default_swiper_image_2.jpg?sign=e6ce41cfe54e2514e77670bb5e329bb5&t=1750645114"
		]
	},

	startFetch() {
		setTimeout(() => {
			this.fetchRemoteConfig()
		}, 1000);
		setInterval(() => {
			this.fetchRemoteConfig()
		}, 60000)
	},

	async fetchRemoteConfig() {
		this.fetchCount++
		logger.info(`[remoteConfig] start fetch remote config, fetch count: ${this.fetchCount}`)
		try {
			const result = await getApp().getModels().remoteconfig.list({
				filter: {
					where: {}
				},
				select: {
					configJson: true,
				},
				getCount: true,
			})
			const resultJSON = JSON.stringify(result)
			logger.info(`[remoteConfig] ${resultJSON}`)
			this.config = result.data.records[0].configJson
			logger.info(`[remoteConfig] fetch & update remote config success, remote json: ${resultJSON}, local: ${JSON.stringify(this.config)}`)
		} catch (error) {
			logger.error(`[remoteConfig] fetch remote config with error: ${error}`)
			reject(error)
		}
	},
}

module.exports = remoteConfig