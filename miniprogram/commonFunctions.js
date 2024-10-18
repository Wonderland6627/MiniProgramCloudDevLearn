// commonFunctions.js

const consts = require('./consts.js')
const utils = require('./utils/utils.js')
const logger = require('./logger.js')

const commonFunctions = {

  showWiFiModal() {
    if (getApp().needLogin()) {
      getApp().showLoginModal('未登录查看Wifi 跳转登录')
      return
    }
    if (!getApp().dataMgr.getStudentInfo().isVIP) {
      wx.showToast({
        title: '无权限查看',
        icon: 'error',
      })
      return
    }

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
                icon: 'none',
                duration: 1000,
              })
            }
          })
        }
      }
    })
  },

  async fetchAccessControlPwd(storeID) {
    if (getApp().needLogin()) {
      getApp().showLoginModal('未登录查看门禁密码 跳转登录')
      return
    }
    if (!getApp().dataMgr.getStudentInfo().isVIP) {
      wx.showToast({
        title: '无权限查看',
        icon: 'error',
      })
      return
    }

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
    logger.info(`[commonFunction] 获取门禁密码回应: ${JSON.stringify(result)}`)
    const pwd = result?.data.accessControlPassword || ''
    if (pwd === '') {
      wx.showToast({
        title: '获取信息失败',
        icon: 'error',
      })
      return
    }
    logger.info('[commonFunction] 当前门禁密码: ' + pwd)
    wx.showModal({
      title: '门禁密码需保密，请不要随意告诉其他人哦～',
      content: `${pwd}#`,
      showCancel: false,
      confirmText: '我知道啦',
      complete: (res) => { }
    })
  },

  async createFeedback(content) {
    const openid = getApp().getOpenID()
    if (openid === '') {
      logger.error('[commonFunction] openid为空，检查登录状态')
      wx.showToast({
        title: '请检查登录状态',
        icon: 'error',
      })
      return
    }
    wx.showLoading({
      title: '正在提交',
    })
    const time = Date.now()
    await getApp().getModels().feedbacks.create({
      data: {
        feedbackOPENID: openid,
        feedbackTime: time,
        feedbackContent: content,
      }
    })
    wx.showToast({
      title: '提交成功，我们会认真聆听你的反馈～',
      icon: 'none',
      duration: 1500,
      mask: true,
    })
    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  },

  getMapperNickname(key) {
    const nicknames = consts.Nicknames
    const hashCode = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const index = hashCode % nicknames.length
    return nicknames[index]
  }
}

module.exports = commonFunctions