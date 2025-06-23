// app.js

const eventBus = require('eventBus.js')
const { init } = require('@cloudbase/wx-cloud-client-sdk')
const client = init(wx.cloud)
const models = client.models
const updateManager = wx.getUpdateManager()
const dataMgr = require('./dataMgr')
const remoteConfig = require('./remoteConfig')
const logger = require('./logger.js')

App({
  onLaunch: function () {
    if (!wx.cloud) {
      logger.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud1-8gewsvyn8efe62b8',
        traceUser: true,
      });
    }
    remoteConfig.startFetch()
  },

  onShow: function () {
    logger.info(`[app.js] app on show, check version update`)
    updateManager.onCheckForUpdate(function (res) {
      logger.info(`[app.js] check version update, hasUpdate: ${res.hasUpdate}`)
      if (!res.hasUpdate) {
        return
      }
      updateManager.onUpdateReady(function() {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              logger.info(`[app.js] 有版本更新，用户点击了更新`)
              updateManager.applyUpdate()
            }
            if (res.cancel) {
              logger.info(`[app.js] 有版本更新，用户点击了取消`)
            }
          }
        })
      })
    })
  },

  globalData: {
    openid: '',
    pendingOPENID: 'UNKNOWN', //OPENID为 'UNKNOWN' 的表数据视为待绑定数据
    defaultAvatarUrl: 'https://636c-cloud1-8gewsvyn8efe62b8-1327447321.tcb.qcloud.la/nbstudy/default_avatar.png?sign=53a45a33e86b7d84e4a8338e7e7f295c&t=1750561315',
  },

  isAdmin: false,
  eventBus: eventBus,
  dataMgr: dataMgr,
  remoteConfig: remoteConfig,

  setAdmin(newValue) {
    this.isAdmin = newValue
    getApp().eventBus.emit('userTypeChange')
  },

  getModels() {
    return models
  },

  setOpenID(openid) {
    this.globalData.openid = openid
    wx.setStorageSync('openid', openid)
    logger.info('[app.js] set openid: ' + openid)
  },

  getOpenID() {
    let openid = this.globalData.openid
    if (openid === '') {
      openid = wx.getStorageSync('openid')
      this.globalData.openid = openid
    }
    logger.info(`[app.js] get openid: [${openid}]`)
    return openid
  },

  needLogin() {
    let openid = this.getOpenID()
    let studentInfo = this.dataMgr.studentInfo
    let needLogin = !openid || openid === undefined 
      || !studentInfo || !studentInfo.studentName
    logger.info(`[app.js] check need login: ${needLogin}`)
    return needLogin
  },

  showLoginModal(toastStr) {
    wx.showModal({
      content: '请在登录后查看此内容',
      confirmText: '去登录',
      cancelText: '算了',
      complete: (res) => {
        if (res.confirm) {
          this.navigateToLogin(toastStr)
        }
      }
    })
  },

  navigateToLogin(toastStr) {
    logger.info(`[app.js] navigate to login: ${toastStr}`)
    wx.showLoading({ title: '准备登录' })
    this.setAdmin(false)
    dataMgr.clear()
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/nbstudy/login/index',
      })
      wx.hideLoading()
    }, 1500)
  },

  logOut(toastStr) {
    logger.info(`[app.js] log out: ${toastStr}`)
    wx.showToast({
      title: toastStr,
      icon: 'none',
      mask: true,
      duration: 3000,
    })
    this.setAdmin(false)
    dataMgr.clear()
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/nbstudy/login/index',
      })
      
    }, 1500)
  },
});
