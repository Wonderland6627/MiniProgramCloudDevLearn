// pages/nbstudy/student-feedback/index.js

const logger = require('../../../logger.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedbackContent: "",
    feedbackLength: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },

  inputFeedback(e) {
    let value = e.detail.value;
    let length = value.length;
    this.setData({
      feedbackContent: value,
      feedbackLength: length
    })
  },

  onSubmitClick(e) {
    this.createFeedback()
  },

  async createFeedback() {
    const openid = getApp().getOpenID()
    if (openid === '') {
      logger.error('[student-feedback] openid为空，检查登录状态')
      wx.showToast({
        title: '请检查登录状态',
        icon: 'error',
      })
      return
    }
    wx.showLoading({
      title: '正在提交',
    })
    const { feedbackContent } = this.data
    const time = Date.now()
    await getApp().getModels().feedbacks.create({
      data: {
        feedbackOPENID: openid,
        feedbackTime: time,
        feedbackContent: feedbackContent
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
    }, 1500);
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