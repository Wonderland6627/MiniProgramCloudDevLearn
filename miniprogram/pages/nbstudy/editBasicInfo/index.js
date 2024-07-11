// pages/nbstudy/editBasicInfo/index.js

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
    studentInfo: {
      avatarUrl: defaultAvatarUrl,
      //birthday：远端数据 timestamp
      //birthdayFormat: 本地数据 dateformat
    },
    birthdaySelectRange: [
      "1900-01-01",
      utils.timeStamp2DateFormat(Date.now()) //Date.now() 返回的是时间戳
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let info = wx.getStorageSync('studentBasicInfo')
    this.setData({
      studentInfo: info,
    })
    console.log('[EditBasicInfo] 获取studentBasicInfo: ' + JSON.stringify(info))
    wx.removeStorageSync('studentBasicInfo')

    if (!this.data.studentInfo.OPENID) {
      this.setData({
        'studentInfo.OPENID': getApp().getOpenID(),
      })
    }
    if (this.data.studentInfo.gender) {
      this.setData({
        'genderIndex': this.data.studentInfo.gender
      })
    }
    if (this.data.studentInfo.birthday) {
      const birthdayFormat = utils.timeStamp2DateFormat(this.data.studentInfo.birthday)
      this.setData({
        'studentInfo.birthdayFormat': birthdayFormat
      })
    }
  },

  onChooseAvatar(e) {
    var filePath = e.detail.avatarUrl
    console.log('获取头像变化: ' + filePath)
    var clouthPath = 'studentAvatars/avatar_' + this.data.studentInfo.OPENID + '.png'
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
          'studentInfo.avatarUrl': avatarUrl
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
      'studentInfo.studentName': name
    })
    console.log('修改学生名字: ' + name)
  },

  nameJudge(name) {
    return name.toString().replace(/[^\u4e00-\u9fa5\w]/g,'')
  },

  bindInputPhone(e) {
    const phone = this.phoneJudge(e.detail.value)
    this.setData({
      'studentInfo.phone': phone
    })
    console.log('修改电话: ' + phone)
  },

  phoneJudge(phone) {
    return phone.toString().replace(/\D/g, '')
  },

  bindBirthdayChange(e) { 
    const birthdayFormat = e.detail.value 
    this.setData({ 
      'studentInfo.birthdayFormat': birthdayFormat
    })
    console.log('修改生日Format: ' + birthdayFormat)
    this.birthdayParser(birthdayFormat)
  }, 

  birthdayParser(birthdayFormat) {
    if (!birthdayFormat) {
      console.error('检查选择的生日Format')
      return
    }
    const birthdayTimeStamp = utils.dateFormat2TimeStamp(birthdayFormat)
    this.setData({
      'studentInfo.birthday': birthdayTimeStamp
    })
    console.log('修改生日TimeStamp: ' + birthdayTimeStamp)
  },

  bindGenderChange(e) {
    const index = e.detail.value
    this.setData({
      'genderIndex': e.detail.value,
      'studentInfo.gender': e.detail.value,
    })
    console.log('修改性别: ' + this.data.genderArray[index])
  },

  bindGenderTap(e) {
    if (this.data.genderIndex == -1) { //防止第一次点击默认选中的位置不对
      this.setData({
        'genderIndex': 0
      })
    }
  },

  saveInfo() {
    console.log('save')
    this.tryUpdateStudentInfo()
  },

  async tryUpdateStudentInfo() {
    const { studentInfo } = this.data
    if (!studentInfo.studentName) {
      wx.showToast({
        title: '请输入学生姓名',
        icon: 'error',
      })
      return
    }
    if (!studentInfo.phone || studentInfo.phone.length != 11) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'error',
      })
      return
    }
    if (!(this.data.genderIndex == 0 || this.data.genderIndex == 1)) {
      wx.showToast({
        title: '请选择性别',
        icon: 'error',
      })
      return
    }
    if (!studentInfo.birthday) {
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
        avatarUrl: studentInfo.avatarUrl,
        studentName: studentInfo.studentName,
        phone: studentInfo.phone,
        gender: studentInfo.gender,
        birthday: studentInfo.birthday,
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
      console.error('学生基础信息保存错误: ' + err)
    })
    console.log(result)
    if (result?.data.count != 1) {
      wx.showToast({
        title: '保存失败',
        icon: 'error',
      })
      console.log('学生基础信息保存失败')
      return
    }
    wx.showToast({
      title: '保存成功',
      icon: 'success',
    })
    console.log('学生基础信息保存成功')

    if (utils.isEmpty(
      studentInfo.school ||
      {})) { //todo: check more edu info
      console.log('openid为：' + studentInfo.openid + '的学生教育信息不全，准备补充')
      this.gotoFillEducation(studentInfo)
      return
    }
  },

  gotoFillEducation(info) {
    wx.setStorageSync('studentBasicInfo', info)
    wx.navigateTo({
      url: '/pages/nbstudy/editEducation/index',
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