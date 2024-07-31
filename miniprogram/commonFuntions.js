// commonFuntions.js

const utils = require('./utils/utils.js')

const commonFuntions = {

	showWiFiModal() {
		const wifiName = 'ZXS'
		const password = '88888888'
		wx.showModal({
			title: `WiFi名称: ${wifiName}`,
			content: `密码: ${password}`,
			confirmText: '复制密码',
			complete: (res) => {
				if (res.confirm) {
					wx.setClipboardData({
						data: password,
						success: () => {
							wx.showToast({
								title: '已复制',
								icon: 'success',
								duration: 1000,
							})
						}
					})
				}
			}
		})
	},

	async fetchAccessControlPwd(storeID) {
    wx.showLoading({
      title: '拉取中...',
    })
    const result = await getApp().getModels().stores.get({
      filter: {
        where: {
          storeID: {
            $eq: storeID
          }
        }
      }
    })
    wx.hideLoading()
    console.log(`获取门禁密码回应: ${JSON.stringify(result)}`)
    const pwd = result?.data.accessControlPassword || ''
    if (pwd === '') {
      wx.showToast({
        title: '获取信息失败',
        icon: 'error',
      })
      return
    }
    console.log('当前门禁密码: ' + pwd)
    wx.showModal({
      title: '门禁密码需保密，请不要随意告诉其他人哦～',
      content: `${pwd}#`,
      showCancel: false,
      confirmText: '我知道啦',
      complete: (res) => { }
    })
  },

}

module.exports = commonFuntions