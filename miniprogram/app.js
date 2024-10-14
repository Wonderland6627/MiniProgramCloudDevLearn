// app.js

const eventBus = require('eventBus.js')
const { init } = require('@cloudbase/wx-cloud-client-sdk')
const client = init(wx.cloud)
const models = client.models
const dataMgr = require('./dataMgr')
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
        env: 'cloud1-1gv3jdz41b34d301',
        traceUser: true,
      });
    }
  },

  globalData: {
    openid: '',
    pendingOPENID: 'UNKNOWN', //OPENID为 'UNKNOWN' 的表数据视为待绑定数据
    defaultAvatarUrl: 'https://636c-cloud1-1gv3jdz41b34d301-1327447321.tcb.qcloud.la/nbstudy/default_avatar.png?sign=750b4fecbff49b9e2bbeb62e2436a44f&t=1722594682',
  },

  isAdmin: false,
  eventBus: eventBus,
  dataMgr: dataMgr,

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
    return !openid || openid === undefined
  },

  navigateToLogin(toastStr) {
    logger.info(`[app.js] navigate to login: ${toastStr}`)
    this.setAdmin(false)
    dataMgr.clear()
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/nbstudy/login/index',
      })
    }, 1500)
  },

  logOut(toastStr) {
    logger.info(`[app.js] log out: ${toastStr}`)
    this.setAdmin(false)
    dataMgr.clear()
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/nbstudy/login/index',
      })
      wx.showToast({
        title: toastStr,
        icon: 'none',
        mask: true,
        duration: 1500,
      })
    }, 1500)
  },
});
