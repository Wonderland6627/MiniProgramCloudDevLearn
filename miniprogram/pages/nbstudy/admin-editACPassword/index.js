// pages/nbstudy/admin-editACPassword/index.js

const logger = require('../../../logger.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeID: 1,
    currentPwd: -1,
    newPwd: -1,
    pwdValid: false,
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
            $eq: this.data.storeID
          }
        }
      }
    })
    wx.hideLoading()
    const data = result?.data
    logger.info('[admin-editACPassword] 当前门禁密码: ' + data.accessControlPassword)
    this.setData({
      'currentPwd': data.accessControlPassword,
    })
  },

  onInputChange(e) {
    const newPwd = e.detail.value
    this.setData({
      'newPwd': newPwd,
      'pwdValid': newPwd && newPwd.length === 6
    })
    logger.info('[admin-editACPassword] 修改门禁密码: ' + newPwd)
  },

  onSave() {
    const { newPwd, pwdValid } = this.data
    if (!pwdValid) {
      wx.showToast({
        title: '输入门禁有误',
        icon: 'error',
      })
      return
    }

    wx.showModal({
      content: '确认更新密码为: ' + newPwd + ' ?',
      complete: (res) => {
        if (res.confirm) {
          this.trySavePwdByCloudFunc()
        }
      }
    })
  },

  trySavePwdByCloudFunc() {
    wx.showLoading({
      title: '正在保存',
    })
    const { storeID, newPwd } = this.data
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'updatePwd',
        data: { storeID, newPwd }
      }
    }).then(res => {
      logger.info('[admin-editACPassword] 门禁密码保存回应: ' + JSON.stringify(res))
      if (res.result.code != 0) {
        logger.error('[admin-editACPassword] 门禁密码保存失败: ' + res.result)
        wx.showToast({
          title: '保存失败',
          icon: 'error',
        })
        return
      }
      if (res.result.result.stats.updated == 0) {
        logger.error('[admin-editACPassword] 门禁密码保存重复: ' + res.result)
        wx.showToast({
          title: '重复保存',
          icon: 'error',
        })
        return
      }
      wx.showToast({
        title: '保存成功',
        icon: 'success',
      })
      this.setData({
        currentPwd: newPwd,
      })
    }).catch(err => {
      logger.error('[admin-editACPassword] 门禁密码保存错误: ' + err)
      wx.showToast({
        title: '保存错误',
        icon: 'error',
      })
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