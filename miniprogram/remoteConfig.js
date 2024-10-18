// remoteConfig.js

const logger = require('./logger.js')

const remoteConfig = {
	fetchCount: 0,
	config: { //local default config
		programMode: 'private',
		swiperImagesList: [
			'https://636c-cloud1-1gv3jdz41b34d301-1327447321.tcb.qcloud.la/nbstudy/swiper_images/default/default_swiper_image_0.jpg?sign=b54c432c8e789905205f9ce55ef54d5f&t=1729231540',
      'https://636c-cloud1-1gv3jdz41b34d301-1327447321.tcb.qcloud.la/nbstudy/swiper_images/default/default_swiper_image_1.jpg?sign=a332cdf6cfc313d9b6dad4d770a8d559&t=1729231530',
      'https://636c-cloud1-1gv3jdz41b34d301-1327447321.tcb.qcloud.la/nbstudy/swiper_images/default/default_swiper_image_2.jpg?sign=2e8907a0c0cbe12293fd0b6f9664ddbb&t=1729231472'
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
			this.config = result.data.records[0].configJson
			logger.info(`[remoteConfig] fetch & update remote config success, remote json: ${resultJSON}, local: ${JSON.stringify(this.config)}`)
		} catch (error) {
			logger.error(`[remoteConfig] fetch remote config with error: ${error}`)
			reject(error)
		}
	},
}

module.exports = remoteConfig