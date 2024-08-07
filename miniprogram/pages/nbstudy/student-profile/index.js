// pages/nbstudy/student-profile/index.js

const cf = require('../../../commonFuntions.js')
const logger = require('../../../logger.js')
const utils = require('../../../utils/utils.js')
const timeUtils = require('../../../utils/timeUtils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    joinedDays: 0,
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
    settingInfos: [
      {
        title: "修改个人基础信息",
        icon: "../../../images/icons/profile-active.png",
        onTap: "onEditBasicInfoCellClick"
      },
      {
        title: "联系我们",
        icon: "../../../images/icons/contact-us.svg",
        onTap: "onContactUsCellClick"
      },
      {
        title: "意见反馈",
        icon: "../../../images/icons/feedback.svg",
        onTap: "onFeedbackCellClick"
      },
      {
        title: "退出登录",
        icon: "../../../images/icons/logout.svg",
        onTap: "onLogoutCellClick"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let info = getApp().dataMgr.getStudentInfo(false)
    this.setData({
      studentInfo: info,
    })
    logger.info('[student-profile] 获取studentBasicInfo: ' + JSON.stringify(info))

    this.onGetStudentInfo(info)
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

  onViewAccessControlClick(e) {
    cf.fetchAccessControlPwd(this.data.studentInfo.storeID)
  },

  onViewCardKeyClick(e) {
    const { studentInfo } = this.data
    const cardKeyID = studentInfo.cardKeyID
    console.log(cardKeyID)
    const content = cardKeyID === 'UNKNOWN' ? '你还没有领取钥匙扣' : cardKeyID
    wx.showModal({
      title: '我的钥匙扣',
      content: content,
      showCancel: false,
    })
  },

  onEditBasicInfoCellClick(e) {
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