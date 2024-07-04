// pages/nbstudy/onboard/index.js

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentData: {
      avatarUrl: defaultAvatarUrl,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let data = wx.getStorageSync('studentAccountData')
    this.setData({
      studentData: data,
    })
    console.log('获取studentAccountData: ' + data)
    wx.removeStorageSync('studentAccountData')
  },

  onChooseAvatar(e) {
    var filePath = e.detail.avatarUrl
    console.log('获取头像变化: ' + filePath)
    var clouthPath = 'studentAvatars/avatar_' + getApp().getOpenID() + '.png'
    console.log(clouthPath)
    wx.cloud.uploadFile({
      cloudPath: clouthPath,
      filePath: filePath
    }).then(res => {
      console.log('头像上传成功: ' + filePath)
      wx.cloud.getTempFileURL({
        fileList: [res.fileID]
      }).then(res => {
        var avatarUrl = res.fileList[0].tempFileURL + '?t=' + new Date().getTime()
        console.log('头像CloudURL: ' + avatarUrl)
        this.setData({
          'studentData.avatarUrl': avatarUrl
        })
      })
    }).catch(e => {
      console.log('头像上传失败: ' + e)
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