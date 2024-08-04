// pages/nbstudy/student-editBasicInfo/index.js

const utils = require('../../../utils/utils.js')
const timeUtils = require('../../../utils/timeUtils.js')
const logger = require('../../../logger.js')

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
      avatarUrl: getApp().globalData.defaultAvatarUrl,
      //birthday：远端数据 timestamp
      //birthdayFormat: 本地数据 dateformat
    },
    birthdaySelectRange: [
      "1900-01-01",
      timeUtils.timeStamp2DateFormat(Date.now()) //Date.now() 返回的是时间戳
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let info = getApp().dataMgr.getStudentInfo()
    this.setData({
      studentInfo: info,
    })
    logger.info('[student-editBasicInfo] 获取studentBasicInfo: ' + JSON.stringify(info))

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
      const birthdayFormat = timeUtils.timeStamp2DateFormat(this.data.studentInfo.birthday)
      this.setData({
        'studentInfo.birthdayFormat': birthdayFormat
      })
    }
    if (!this.data.studentInfo.avatarUrl) {
      this.setData({
        'studentInfo.avatarUrl': getApp().globalData.defaultAvatarUrl
      })
    }
  },

  onChooseAvatar(e) {
    var filePath = e.detail.avatarUrl
    logger.info('[student-editBasicInfo] 获取头像变化: ' + filePath)
    var clouthPath = 'studentAvatars/avatar_' + this.data.studentInfo.OPENID + '.png'
    logger.info(clouthPath)
    wx.cloud.uploadFile({
      cloudPath: clouthPath,
      filePath: filePath
    }).then(res => {
      logger.info('[student-editBasicInfo] 头像上传成功: ' + filePath)
      wx.cloud.getTempFileURL({
        fileList: [res.fileID]
      }).then(res => {
        var avatarUrl = res.fileList[0].tempFileURL + '?t=' + new Date().getTime()
        logger.info('[student-editBasicInfo] 头像CloudURL: ' + avatarUrl)
        this.setData({
          'studentInfo.avatarUrl': avatarUrl
        })
      }).catch(e => {
        logger.error('[student-editBasicInfo] 获取CloudURL失败: ' + e)
      })
    }).catch(e => {
      logger.error('[student-editBasicInfo] 头像上传失败: ' + e)
    })
  },

  bindInputName(e) {
    const name = this.nameJudge(e.detail.value)
    this.setData({
      'studentInfo.studentName': name
    })
    logger.info('[student-editBasicInfo] 修改学生名字: ' + name)
  },

  nameJudge(name) {
    return name.toString().replace(/[^\u4e00-\u9fa5\w]/g,'')
  },

  bindInputPhone(e) {
    const phone = this.phoneJudge(e.detail.value)
    this.setData({
      'studentInfo.phone': phone
    })
    logger.info('[student-editBasicInfo] 修改电话: ' + phone)
  },

  phoneJudge(phone) {
    return phone.toString().replace(/\D/g, '')
  },

  bindBirthdayChange(e) { 
    const birthdayFormat = e.detail.value 
    this.setData({ 
      'studentInfo.birthdayFormat': birthdayFormat
    })
    logger.info('[student-editBasicInfo] 修改生日Format: ' + birthdayFormat)
    this.birthdayParser(birthdayFormat)
  }, 

  birthdayParser(birthdayFormat) {
    if (!birthdayFormat) {
      logger.error('[student-editBasicInfo] 检查选择的生日Format')
      return
    }
    const birthdayTimeStamp = timeUtils.dateFormat2TimeStamp(birthdayFormat)
    this.setData({
      'studentInfo.birthday': birthdayTimeStamp
    })
    logger.info('[student-editBasicInfo] 修改生日TimeStamp: ' + birthdayTimeStamp)
  },

  bindGenderChange(e) {
    const index = e.detail.value
    this.setData({
      'genderIndex': e.detail.value,
      'studentInfo.gender': e.detail.value,
    })
    logger.info('[student-editBasicInfo] 修改性别: ' + this.data.genderArray[index])
  },

  bindGenderTap(e) {
    if (this.data.genderIndex == -1) { //防止第一次点击默认选中的位置不对
      this.setData({
        'genderIndex': 0
      })
    }
  },

  bindInputSchool(e) {
    const name = e.detail.value
    this.setData({
      'studentInfo.school': name
    })
    logger.info('[student-editBasicInfo] 修改学校名字: ' + name)
  },

  bindInputStudyGoal(e) {
    const goal = e.detail.value
    this.setData({
      'studentInfo.studyGoal': goal
    })
    logger.info('[student-editBasicInfo] 修改学习目标: ' + goal)
  },

  saveInfo() {
    logger.info('[student-editBasicInfo] save')
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

        school: studentInfo.school,
        studyGoal: studentInfo.studyGoal,
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
      logger.error('[student-editBasicInfo] 学生基础信息保存错误: ' + err)
    })
    logger.info('[student-editBasicInfo] 学生基础信息保存回应: ' + JSON.stringify(result))
    if (result?.data.count != 1) {
      wx.showToast({
        title: '保存失败',
        icon: 'error',
      })
      logger.info('[student-editBasicInfo] 学生基础信息保存失败')
      return
    }
    wx.showToast({
      title: '保存成功',
      icon: 'success',
    })
    logger.info('[student-editBasicInfo] 学生基础信息保存成功')
    getApp().dataMgr.setStudentInfo(studentInfo)
    this.gotoStudentMain()
  },

  gotoStudentMain() {
    wx.switchTab({
      url: '/pages/nbstudy/student-main/index',
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