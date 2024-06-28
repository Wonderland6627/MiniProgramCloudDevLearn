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
    getApp().getOpenID()
  },

  tryWXLogin() {
    wx.showLoading({
      title: '检查登陆状态',
    })
    wx.checkSession({
      success: () => {
        wx.showToast({
          title: '已登陆',
          icon: 'success',
        })
        console.log('微信session有效')
        this.createStudent()
      },
      fail: ()=> {
        wx.showLoading({
          title: '正在登陆',
        })
        console.log('微信session过期')
        wx.login({
          success: (res) => {
            wx.showToast({
              title: '登陆成功',
              icon: 'success',
            })
            if (res.code) { //到这一步获取到code代表登陆成功 后面json2Session主要是为了本地存openid
              console.log('微信登陆凭证 code:' + res.code)
              this.createStudent()
              this.setData({ js_code: res.code })
              const { js_code } = this.data
              wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                  type: 'getJSCode2Session',
                  data: { js_code }
                },
                success: (res) => {
                  console.log('微信登陆凭证校验成功: ' + JSON.stringify(res))
                  if (res.result.errMsg != '') {
                    console.log('微信登陆凭证校验错误: ' + res.result.errMsg)
                    return
                  }
                  console.log('微信登陆凭证校验成功回应: ' + JSON.stringify(res.result.data))
                  getApp().setOpenID(res.result.data.openid)
                },
                fail: (err) => {
                  console.error('微信登陆凭证校验失败: ' + err)
                }
              });
            } else {
              console.log('微信登陆失败: ' + res.errMsg)
            }
          },
          fail: (err) => {
            console.error('微信登陆错误: ' + err)
          }
        })
      }
    })
  },

  async createStudent() {
    wx.showLoading({
      title: '检查用户数据',
    })
    const response = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'createStudent',
      }
    })
    console.log('创建student行回应: ' + JSON.stringify(response))
    if (response.result.code < 0) {
      wx.showToast({
        title: '创建用户出错',
        icon: 'error',
      })
      console.log('创建用户出错')
      return
    }
    const title = response.result.code == 0 ? "创建新信息" : "用户已创建"
    wx.showToast({
      title: title,
    })
    console.log('创建student成功')
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