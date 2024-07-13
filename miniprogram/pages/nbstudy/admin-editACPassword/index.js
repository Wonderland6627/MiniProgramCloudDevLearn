// pages/nbstudy/admin-editACPassword/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPwd: -1,
    newPwd: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchAccessControlPwd()
  },

  async fetchAccessControlPwd() {
    wx.showLoading({
      title: '获取数据',
    })
    const result = await getApp().getModels().stores.get({
      filter: {
        where: {
          storeID: {
            $eq: 1,
          }
        }
      }
    })
    wx.hideLoading()
    const data = result?.data
    console.log('当前门禁密码: ' + data.accessControlPassword)
    this.setData({
      'currentPwd': data.accessControlPassword,
    })
  },

  onInputChange(e) {
    const newPwd = e.detail.value
    this.setData({
      'newPwd': newPwd,
    })
    console.log('修改门禁密码: ' + newPwd)
  },

  onSave() {
    const { newPwd } = this.data
    console.log('保存密码: ' + newPwd)
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