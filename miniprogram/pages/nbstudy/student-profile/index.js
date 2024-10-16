// pages/nbstudy/student-profile/index.js

const cf = require('../../../commonFuntions.js')
const logger = require('../../../logger.js')
const consts = require('../../../consts.js')
const remoteConfig = require('../../../remoteConfig.js')
const utils = require('../../../utils/utils.js')
const timeUtils = require('../../../utils/timeUtils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    joinedDays: -1,
    startDate: null,
    expirationDate: null,
    studentInfo: {},

    toolInfos: [
      // { //后期能否通过日历来实现
      //   title: "打卡记录",
      //   icon: "../../../images/icons/sign-in.svg",
      //   onTap: "onViewSignInClick"
      // },
      {
        title: "查看门禁",
        icon: "../../../images/icons/lock.svg",
        onTap: "onViewAccessControlClick"
      },
      {
        title: "我的钥匙扣",
        icon: "../../../images/icons/cardkey.svg",
        onTap: "onViewCardKeyClick"
      },
    ],
    settingsCells: consts.StudentProfileSettingsCells,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setupMode()
    if (getApp().needLogin()) {
      logger.warn('[student-profile] profile onload failed, need login')
      return
    }
    getApp().dataMgr
      .fetchStudentInfo()
      .then(info => {
        logger.info('[student-profile] 获取studentBasicInfo: ' + JSON.stringify(info))
        this.setData({
          studentInfo: info
        })
        this.onGetStudentInfo(info)
      })
      .catch(error => {
        logger.error(error)
      })
  },

  setupMode() {
    let programMode = remoteConfig.config.programMode
    logger.info(`[student-profile] program mode: ${programMode}`)
    let cells = consts.StudentProfileSettingsCells
    if (programMode == "private") {
      cells = cells.filter((item) => {
          return item.onTap !== "onEditBasicInfoCellClick"
        })
    }
    this.setData({
      settingsCells: cells
    })
  },

  onGetStudentInfo(info) {
    if (info.joinedDate) {
      this.setData({
        joinedDays: timeUtils.calculateDaysDifference(info.joinedDate),
      })
    }
    if (info.packageStartDate) {
      this.setData({
        startDate: timeUtils.timeStamp2DateFormat(info.packageStartDate),
      })
    }
    if (info.packageExpirationDate) {
      this.setData({
        expirationDate: timeUtils.timeStamp2DateFormat(info.packageExpirationDate),
      })
    }
  },

  onNeedLoginClick(e) {
    getApp().navigateToLogin('未登录点击头像 跳转登录')
  },

  onViewAccessControlClick(e) {
    cf.fetchAccessControlPwd(this.data.studentInfo.storeID)
  },

  onViewCardKeyClick(e) {
    if (getApp().needLogin()) {
      getApp().showLoginModal('未登录查看钥匙扣 跳转登录')
      return
    }

    const { studentInfo } = this.data
    console.log(`[student-profile] onViewCardKeyClick`)
    const content = !studentInfo.cardKeyID ? '你还没有领取钥匙扣' : studentInfo.cardKeyID
    wx.showModal({
      title: '我的钥匙扣',
      content: content,
      showCancel: false,
    })
  },

  onEditBasicInfoCellClick(e) {
    if (getApp().needLogin()) {
      getApp().showLoginModal('未登录点击修改个人信息 跳转登录')
      return
    }
    wx.navigateTo({
      url: '/pages/nbstudy/student-editBasicInfo/index',
    })
  },

  onContactUsCellClick(e) {
    wx.navigateTo({
      url: '/pages/nbstudy/student-contact-us/index',
    })
  },

  onFeedbackCellClick(e) {
    if (getApp().needLogin()) {
      getApp().showLoginModal('未登录点击意见反馈 跳转登录')
      return
    }
    wx.navigateTo({
      url: '/pages/nbstudy/student-feedback/index',
    })
  },

  onLogoutCellClick(e) {
    logger.info("[student-profile] onLogoutCellClick")
    getApp().logOut('正在退出登录')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
        this.getTabBar().setData({
        selected: 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.setupMode()
    if (getApp().needLogin()) {
      logger.warn('[student-profile] pull down refresh failed, need login')
      setTimeout(() => {
        wx.stopPullDownRefresh()
      }, 3000)
      return
    }
    getApp().dataMgr
      .fetchStudentInfo()
      .then(info => {
        this.setData({
          studentInfo: info
        })
        this.onGetStudentInfo(info)
        wx.stopPullDownRefresh()
      })
      .catch(error => {
        logger.error(error)
        wx.stopPullDownRefresh()
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})