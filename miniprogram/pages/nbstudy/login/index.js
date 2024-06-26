// pages/nbstudy/login/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    angle: 0,
    phoneValid: false,
    phoneNumber: '',
    password: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },

  async fetchStoresList() {
    this.setData({ isLoading: true });
    const res = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: { type: 'fetchStoresList' },
    });
    const storesList = res?.result?.dataList || [];
    this.setData({
      isLoading: false,
      storesList
    });
  },

  tryLogin: function() {
    console.log("try login")
    //this.fetchStoresList();
    this.login();
    // wx.switchTab({
    //   url: '/pages/nbstudy/student-main/index',
    // })
  },

  async login() {
    // this.setData({ isLoading: true });
    const { phoneNumber, password } = this.data;
    console.log(phoneNumber)
    console.log(password)
    const response = await wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'checkLogin',
          data: {
            phoneNumber, password
          }
        }
    });
    const result = response?.result;
    console.log("登陆回应：" + JSON.stringify(result))
    if (result == null) {
      wx.showToast({
        title: '登陆无效',
        icon: 'error',
      });
      return
    }
    const success = result.code == 0;
    if (!success) {
      wx.showToast({
        title: '登陆无效: ' + result.code,
        icon: 'error',
      });
      return;
    }
    wx.showToast({
      title: '登陆成功',
      icon: 'success',
    });
  },

  contactUs: function() {
    console.log("contact us")
  },

  checkPhoneNumber: function(e) {
    const phone = e.detail.value
    console.log(phone)
    this.setData({
      phoneNumber: phone,
      phoneValid: phone.length == 11
    })
  },

  checkPassword(e) {
    const password = e.detail.value
    console.log(password)
    this.setData({
      password: password
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