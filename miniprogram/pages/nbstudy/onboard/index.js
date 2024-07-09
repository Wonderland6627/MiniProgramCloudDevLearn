// pages/nbstudy/onboard/index.js

const utils = require('../../../utils.js')
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    genderIndex: -1,
    genderArray: [
      '女生', '男生',
    ],
    studentData: {
      avatarUrl: defaultAvatarUrl,
      //birthday：远端数据 timestamp
      //birthdayFormat: 本地数据 dateformat
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
    console.log('获取studentAccountData: ' + JSON.stringify(data))
    wx.removeStorageSync('studentAccountData')

    if (!this.data.studentData.OPENID) {
      this.setData({
        'studentData.OPENID': getApp().getOpenID(),
      })
    }
    if (this.data.studentData.birthday) {
      const birthdayFormat = utils.TimeStamp2DateFormat(this.data.studentData.birthday)
      this.setData({
        'studentData.birthdayFormat': birthdayFormat
      })
    }
  },

  onChooseAvatar(e) {
    var filePath = e.detail.avatarUrl
    console.log('获取头像变化: ' + filePath)
    var clouthPath = 'studentAvatars/avatar_' + this.data.studentData.OPENID + '.png'
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
      }).catch(e => {
        console.error('获取CloudURL失败: ' + e)
      })
    }).catch(e => {
      console.error('头像上传失败: ' + e)
    })
  },

  bindInputName(e) {
    const name = this.nameJudge(e.detail.value)
    this.setData({
      'studentData.studentName': name
    })
    console.log('修改学生名字: ' + name)
  },

  nameJudge(name) {
    return name.toString().replace(/[^\u4e00-\u9fa5\w]/g,'')
  },

  bindInputPhone(e) {
    const phone = this.phoneJudge(e.detail.value)
    this.setData({
      'studentData.phone': phone
    })
    console.log('修改电话: ' + phone)
  },

  phoneJudge(phone) {
    return phone.toString().replace(/\D/g, '')
  },

  bindBirthdayChange(e) { 
    const birthdayFormat = e.detail.value 
    this.setData({ 
      'studentData.birthdayFormat': birthdayFormat
    })
    console.log('修改生日Format: ' + birthdayFormat)
    this.birthdayParser(birthdayFormat)
  }, 

  birthdayParser(birthdayFormat) {
    if (!birthdayFormat) {
      console.error('检查选择的生日Format')
      return
    }
    const birthdayTimeStamp = utils.DateFormat2TimeStamp(birthdayFormat)
    this.setData({
      'studentData.birthday': birthdayTimeStamp
    })
    console.log('修改生日TimeStamp: ' + birthdayTimeStamp)
  },

  bindGenderChange(e) {
    this.setData({
      'genderIndex': e.detail.value
    })
  },

  saveInfo() {
    console.log('save')
    this.tryUpdateStudentData()
  },

  async tryUpdateStudentData() {
    const { studentData } = this.data
    if (!studentData.studentName) {
      wx.showToast({
        title: '请输入学生姓名',
        icon: 'error',
      })
      return
    }
    if (!studentData.phone || studentData.phone.length != 11) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'error',
      })
      return
    }
    if (!studentData.birthday) {
      wx.showToast({
        title: '请输入生日',
        icon: 'error',
      })
      return
    }
    wx.showLoading({
      title: '正在保存',
    })
    const result = await getApp().getModels().students.update({
      data: {
        avatarUrl: studentData.avatarUrl,
        studentName: studentData.studentName,
        phone: studentData.phone,
        birthday: studentData.birthday,
      },
      filter: {
        where: {
          OPENID: {
            $eq: studentData.OPENID
          }
        }
      }
    }).catch(err => {
      wx.showToast({
        title: '保存错误',
        icon: 'error',
      })
      console.error('学生信息保存错误: ' + err)
    })
    console.log(result)
    if (result?.data.count != 1) {
      wx.showToast({
        title: '保存失败',
        icon: 'error',
      })
      console.log('学生信息保存失败')
      return
    }
    wx.showToast({
      title: '保存成功',
      icon: 'success',
    })
    console.log('学生信息保存成功')
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