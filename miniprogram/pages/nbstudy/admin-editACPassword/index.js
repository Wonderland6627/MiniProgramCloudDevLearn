// pages/nbstudy/admin-editACPassword/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeID: 2,
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
            $eq: this.data.storeID
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
    this.trySavePwdByCloudFunc()
  },

  trySavePwdByCloudFunc() {
    const { storeID, newPwd } = this.data
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'updatePwd',
        data: { storeID, newPwd }
      }
    }).then(res => {
      console.log('门禁密码保存回应: ' + JSON.stringify(res))
      if (res.result.code != 0) {
        console.log('门禁密码保存失败: ' + res.result)
        wx.showToast({
          title: '保存失败',
          icon: 'error',
        })
        return
      }
      if (res.result.result.stats.updated == 0) {
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
      console.error('门禁密码保存错误: ' + err)
      wx.showToast({
        title: '保存错误',
        icon: 'error',
      })
    })
  },

  async trySavePwd() {
    const { newPwd } = this.data
    if (!newPwd || newPwd.length !== 6) {
      wx.showToast({
        title: '输入门禁有误',
        icon: 'error',
      })
      return
    }
    wx.showLoading({
      title: '正在保存',
    })
    const result = await getApp().getModels().stores.update({
      data: {
        _openid: '{openid}',
        accessControlPassword: newPwd,
      },
      filter: {
        where: {
          storeID: {
            $eq: this.data.storeID
          }
        }
      }
    }).catch(err => {
      wx.showToast({
        title: '保存错误',
        icon: 'error',
      })
      console.error('门禁密码保存错误: ' + err)
    })
    console.log('门禁密码保存回应: ' + result)
    if (result?.data.count != 1) {
      wx.showToast({
        title: '保存失败',
        icon: 'error',
      })
      console.log('门禁密码保存失败')
      return
    }
    wx.showToast({
      title: '保存成功',
      icon: 'success',
    })
    console.log('门禁密码保存成功')
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