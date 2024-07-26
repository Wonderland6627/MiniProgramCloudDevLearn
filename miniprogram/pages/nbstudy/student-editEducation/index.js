// pages/nbstudy/student-editEducation/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let info = wx.getStorageSync('studentBasicInfo')
    this.setData({
      studentInfo: info,
    })
    console.log('[EditEducation] 获取studentBasicInfo: ' + JSON.stringify(info))
    wx.removeStorageSync('studentBasicInfo')

    if (!this.data.studentInfo.OPENID) {
      this.setData({
        'studentInfo.OPENID': getApp().getOpenID(),
      })
    }
  },

  bindInputSchool(e) {
    const name = e.detail.value
    this.setData({
      'studentInfo.school': name
    })
    console.log('修改学校名字: ' + name)
  },

  saveInfo() {
    console.log('save')
    this.tryUpdateStudentInfo()
  },

  async tryUpdateStudentInfo() {
    const { studentInfo } = this.data
    if (!studentInfo.school) {
      wx.showToast({
        title: '请输入学校名称',
        icon: 'error',
      })
      return
    }
    wx.showLoading({
      title: '正在保存',
    })
    const result = await getApp().getModels().students.update({
      data: {
        school: studentInfo.school
      },
      filter: {
        where: {
          OPENID: {
            $eq: studentInfo.OPENID
          }
        }
      }
    }).catch(err => {
      wx.showToast({
        title: '保存错误',
        icon: 'error',
      })
      console.error('学生教育信息保存错误: ' + err)
    })
    console.log('学生教育信息保存回应' + result)
    if (result?.data.count != 1) {
      wx.showToast({
        title: '保存失败',
        icon: 'error',
      })
      console.log('学生教育信息保存失败')
      return
    }
    wx.showToast({
      title: '保存成功',
      icon: 'success',
    })
    console.log('学生教育信息保存成功')
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