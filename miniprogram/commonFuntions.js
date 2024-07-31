// commonFuntions.js

const utils = require('./utils/utils.js')

const commonFuntions = {

	async fetchAccessControlPwd(storeID) {
    wx.showLoading({
      title: '获取数据',
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
    const pwd = result?.data.accessControlPassword || ''
    if (utils.isEmpty(pwd)) {
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