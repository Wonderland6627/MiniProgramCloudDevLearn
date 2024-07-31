// pages/nbstudy/student-profile/index.js

const utils = require('../../../utils/utils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentInfo: {},

    toolInfos: [
      {
        title: "打卡记录",
        icon: "../../../images/icons/sign-in.svg",
        onTap: "onViewSignInClick"
      },
      {
        title: "查看门禁",
        icon: "../../../images/icons/lock.svg",
        onTap: "onViewAccessControlClick"
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
    let info = getApp().dataMgr.getStudentInfo()
    this.setData({
      studentInfo: info,
    })
    console.log('[student-profile] 获取studentBasicInfo: ' + JSON.stringify(info))
  },

  onViewAccessControlClick(e) {
    this.fetchAccessControlPwd(this.data.studentInfo.storeID)
  },

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

  onLogoutCellClick(e) {
    console.log("onLogoutCellClick")
    wx.showLoading({
      title: '正在退出登录',
      mask: true,
    })
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/nbstudy/login/index',
      })
    }, 1500)
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