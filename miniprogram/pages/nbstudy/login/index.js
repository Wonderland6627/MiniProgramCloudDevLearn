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
    js_code: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },

  tryWXLogin() {
    wx.checkSession({
      success: () => {
        console.log('session 有效')
      },
      fail: ()=> {
        console.log('session 过期')
        wx.login({
          success: (res) => {
            if (res.code) {
              console.log('登陆凭证 code:' + res.code)
              this.setData({
                js_code: res.code
              })
              const { js_code } = this.data
              wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                  type: 'getJSCode2Session',
                  data: {
                    js_code
                  }
                },
                success: (res) => {
                  console.log('666 ' + JSON.stringify(res))
                },
                fail: (err) => {
                  console.error('6666 ' + err)
                }
              });
            } else {
              console.log('登陆失败' + res.errMsg)
            }
          },
          fail: (err) => {
            console.error('登陆错误' + err)
          }
        })
      }
    })
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

  tryCustomLogin: function() {
    console.log("try custom login")
    //this.fetchStoresList();
    this.customLogin();
    // wx.switchTab({
    //   url: '/pages/nbstudy/student-main/index',
    // })
  },

  async customLogin() {
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