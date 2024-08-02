// pages/nbstudy/student-contact-us/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrCodeUrl: 'https://636c-cloud1-1gv3jdz41b34d301-1327447321.tcb.qcloud.la/studentAvatars/avatar_o1fcV7QtbIWVcW3cjnxSkyCpT5MM.png?t=1722326686415',
    // 'https://cdn.jsdelivr.net/gh/Wonderland6627/cloudres@latest/nbstudy/storeqrcode.png',
    contactInfo: {
      landline: '0412-7358885',
      phone: '19904208286',
      email: 'nbstudy.online@163.com',
    }
  },

  onContactCallClick(e) {
    const numberType = e.currentTarget.dataset.numberType
    let phontNumber = this.data.contactInfo.phone
    if (numberType === 'landline') {
      phontNumber = this.data.contactInfo.landline
    }
    wx.makePhoneCall({
      phoneNumber: phontNumber,
      success: () => {
        console.log('电话调起成功')
      },
      fail: (err) => {
        console.error(`电话调起失败: ${JSON.stringify(err)}`)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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