// pages/nbstudy/admin-edit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    settings: [
      {
        title: "座位设置",
        icon: "../../../images/icons/seat.svg",
        onTap: "onSeatCellClick"
      },
      {
        title: "修改套餐",
        icon: "../../../images/icons/package.svg",
        onTap: "onPackageCellClick"
      },
      {
        title: "修改门禁",
        icon: "../../../images/icons/lock.svg",
        onTap: "onAccessControlPasswordCellClick"
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

  },

  onSeatCellClick(e) {
    console.log("onSeatCellClick")
  },

  onPackageCellClick(e) {
    console.log("onPackageCellClick")
  },

  onAccessControlPasswordCellClick(e) {
    console.log("onAccessControlPasswordCellClick")
    wx.navigateTo({
      url: '/pages/nbstudy/admin-editACPassword/index',
    })
  },

  onLogoutCellClick(e) {
    console.log("onLogoutCellClick")
    wx.showLoading({
      title: '退出登录',
    })
    wx.redirectTo({
      url: '/pages/nbstudy/login/index',
    })
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
