// remoteConfig.js

const logger = require('./logger.js')

const remoteConfig = {
	fetchCount: 0,
	config: { //local default config
		programMode: 'private',
		swiperImagesList: [
			'https://636c-cloud1-1gv3jdz41b34d301-1327447321.tcb.qcloud.la/nbstudy/default_swiper_image_0.jpg?sign=51720cb81b3adcdc61bf67d8c964af8e&t=1729218915',
      'https://636c-cloud1-1gv3jdz41b34d301-1327447321.tcb.qcloud.la/nbstudy/default_swiper_image_1.jpg?sign=ac5510fc4eecdbe7c18d9598bdb606a4&t=1729218936',
      'https://636c-cloud1-1gv3jdz41b34d301-1327447321.tcb.qcloud.la/nbstudy/default_swiper_image_2.jpg?sign=10e247f2f1695c50fa50549b2756fd34&t=1729218951'
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