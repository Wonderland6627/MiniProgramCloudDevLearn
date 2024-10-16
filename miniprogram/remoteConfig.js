// remoteConfig.js

const logger = require('./logger.js')

const remoteConfig = {
	fetchCount: 0,
	config: {
		isInReview: true,
	},

	startFetch() {
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