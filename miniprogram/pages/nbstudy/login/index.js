// pages/nbstudy/login/index.js

const utils = require('../../../utils.js')

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
    wx.showLoading({
      title: '检查登陆状态',
    })
    const openid = getApp().getOpenID()
    const openidValid = openid !== ''
    console.log('OpneID: [' + openid + '], ' + (openidValid ? '有效' : '无效'))
    wx.checkSession({
      success: () => {
        console.log('微信session有效')
        wx.showToast({
          title: '已登陆',
          icon: 'success',
        })
        if (openidValid) { //session有效 且本地有openid 直接检查用户数据
          this.checkStudentInfoExists(openid)
          return
        }
        this.getWXContextOpenID(this.checkStudentInfoExists) //session有效 但本地没有openid 获取openid再继续
      },
      fail: () => {
        console.log('微信session过期')
        wx.showLoading({
          title: '正在登陆',
        })
        wx.login({
          success: (res) => {
            if (res.code) { //到这一步获取到code代表登陆成功 后面json2Session主要是为了本地存openid
              console.log('微信登陆凭证 code: ' + res.code)
              this.setData({
                js_code: res.code
              })
              if (openidValid) { //session无效 登陆成功 且本地有openid 去检查用户数据
                console.log('微信openid存在')
                wx.showToast({
                  title: '登陆成功',
                  icon: 'success',
                })
                this.checkStudentInfoExists(openid)
                return
              }
              console.log('微信openid不存在，尝试获取')
              this.getJSCode2Session() //session无效 获取openid 去检查用户数据
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

  getWXContextOpenID(callback) {
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getOpenId'
      }
    }).then(res => {
      console.log('获取WXContext: ' + JSON.stringify(res))
      const openid = res.result.openid
      console.log('通过WXContext获取微信openid成功: ' + openid)
      getApp().setOpenID(openid)
      callback(openid)
    }).catch(err => {
      console.error('获取WXContext失败: ' + err)
    })
  },

  getJSCode2Session() {
    const {
      js_code
    } = this.data
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getJSCode2Session',
        data: {
          js_code
        }
      },
      success: (res) => {
        console.log('微信登陆凭证校验成功: ' + JSON.stringify(res))
        if (res.result.errMsg != '') {
          console.log('微信登陆凭证校验错误: ' + res.result.errMsg)
          return
        }
        console.log('微信登陆凭证校验成功回应: ' + JSON.stringify(res.result.data))
        const oid = res.result.data.openid
        console.log('通过JSCode2Session获取微信openid成功: ' + oid)
        getApp().setOpenID(oid) //通过JSCode2Session获取openid
        this.checkStudentInfoExists(oid)
      },
      fail: (err) => {
        console.error('微信登陆凭证校验失败: ' + err)
      }
    })
  },

  async checkStudentInfoExists(openid) {
    wx.showLoading({
      title: '检查用户数据',
    })
    const result = await getApp().getModels().students.get({
      filter: {
        where: {
          OPENID: {
            $eq: openid,
          }
        }
      }
    })
    wx.hideLoading()
    const data = result?.data
    if (utils.isEmpty(data)) {
      console.log('openid为：' + openid + '的学生信息不存在，准备创建')
      this.createStudentInfo(openid)
      return
    }
    if (utils.isEmpty(
      data?.studentName ||
      data?.phone ||
      data?.gender ||
      data?.birthday ||
      {})) { //todo: check more stu info
      console.log('openid为：' + openid + '的学生基础信息不全，准备补充')
      this.gotoFillAccount(data)
      return
    }
    if (utils.isEmpty(
      data?.school ||
      {})) { //todo: check more edu info
      console.log('openid为：' + openid + '的学生教育信息不全，准备补充')
      this.gotoFillEducation(data)
      return
    }
    console.log('openid为：' + openid + '的学生基础信息完整')
    this.gotoStudentMain()
  },

  async createStudentInfo(openid) {
    wx.showLoading({
      title: '创建信息',
    })
    const result = await getApp().getModels().students.create({
      data: {
        OPENID: openid
      },
    })
    wx.showToast({
      title: '创建信息成功',
      icon: 'success',
    })
    const info = result?.data
    console.log(info)
    this.gotoFillAccount(info)
  },

  gotoFillAccount(info) {
    wx.setStorageSync('studentBasicInfo', info)
    wx.navigateTo({
      url: '/pages/nbstudy/editBasicInfo/index',
    })
  },

  gotoFillEducation(info) {
    wx.setStorageSync('studentBasicInfo', info)
    wx.navigateTo({
      url: '/pages/nbstudy/editEducation/index',
    })
  },

  gotoStudentMain() {
    wx.switchTab({
      url: '/pages/nbstudy/student-main/index',
    })
  },

  async fetchStoresList() {
    this.setData({
      isLoading: true
    });
    const res = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'fetchStoresList'
      },
    });
    const storesList = res?.result?.dataList || [];
    this.setData({
      isLoading: false,
      storesList
    });
  },

  tryCustomLogin: function () {
    console.log("try custom login")
    //this.fetchStoresList();
    this.customLogin();
    // wx.switchTab({
    //   url: '/pages/nbstudy/student-main/index',
    // })
  },

  async customLogin() {
    // this.setData({ isLoading: true });
    const {
      phoneNumber,
      password
    } = this.data;
    console.log(phoneNumber)
    console.log(password)
    const response = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'checkLogin',
        data: {
          phoneNumber,
          password
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

  contactUs: function () {
    console.log("contact us")
  },

  checkPhoneNumber: function (e) {
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