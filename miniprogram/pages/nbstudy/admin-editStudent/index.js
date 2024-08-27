// pages/nbstudy/admin-editStudent/index.js

const utils = require('../../../utils/utils.js')
const timeUtils = require('../../../utils/timeUtils.js')
const logger = require('../../../logger.js')
const consts = require('../../../consts.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    titles: {
      studentName: '姓名',
      phone: '手机号',
      gender: '性别',
      birthday: '出生日期',

      school: '学校',
      studyGoal: '我的目标',

      seatName: '座位名称',
      seatType: '座位类型',
      durationType: '时长类型',
      packageStartDate: '起始日期',
      packageExpirationDate: '到期日期',
    },

    genderIndex: -1,
    genderArray: [
      '女生', '男生',
    ],

    seatTypeIndex: -1,
    seatTypeArray: [],

    durationTypeIndex: -1,
    durationTypeArray: [],

    currentStudentInfo: {}, //初始值
    modifies: {}, //修改值
    studentInfo: { //显示值
      //birthday：远端数据 timestamp
      //birthdayFormat: 本地数据 dateformat
    },
    birthdaySelectRange: [
      "1900-01-01",
      timeUtils.timeStamp2DateFormat(Date.now()) //Date.now() 返回的是时间戳
    ],
    packageSelectRange: [
      "2024-01-01",
      "2025-01-01",
      "2099-01-01",
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let info = wx.getStorageSync('selectedStudentInfo')
    this.onGetStudentInfo(info)
    this.setUpEnumMap()
  },

  onGetStudentInfo(info) {
    this.setData({
      currentStudentInfo: utils.cloneWithJSON(info),
      studentInfo: info,
    })
    logger.info(`[admin-editStudent] 获取studentBasicInfo: ${JSON.stringify(info)}`)

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
    if (this.data.studentInfo.seatType) {
      this.setData({
        'seatTypeIndex': this.data.studentInfo.seatType
      })
    }
    if (this.data.studentInfo.durationType) {
      this.setData({
        'durationTypeIndex': this.data.studentInfo.durationType
      })
    }
    if (this.data.studentInfo.packageStartDate) {
      const packageStartDateFormat = timeUtils.timeStamp2DateFormat(this.data.studentInfo.packageStartDate)
      this.setData({
        'studentInfo.packageStartDateFormat': packageStartDateFormat
      })
    }
    if (this.data.studentInfo.packageExpirationDate) {
      const packageExpirationDateFormat = timeUtils.timeStamp2DateFormat(this.data.studentInfo.packageExpirationDate)
      this.setData({
        'studentInfo.packageExpirationDateFormat': packageExpirationDateFormat
      })
    }
  },

  setUpEnumMap() {
    this.setData({
      'seatTypeArray': consts.SeatTypeLabelMap.map(item => item.label),
      'durationTypeArray': consts.DurationTypeLabelMap.map(item => item.label),
    })
  },

  enableAlertBeforeUnload(enable) {
    logger.info(`[admin-editStudent] 退出前显示未保存修改提示: ${enable}`)
    if (!enable) {
      wx.disableAlertBeforeUnload()
      return
    }
    const { modifies } = this.data
    const modifiesCount = Object.keys(modifies).length
    wx.enableAlertBeforeUnload({
      message: `你有 ${modifiesCount} 条信息修改未保存，确定要退出吗？`,
    })
  },

  modifiesData(newData) {
    this.setData({
      modifies: Object.assign({}, this.data.modifies, newData)
    })
    const { currentStudentInfo, modifies } = this.data
    Object.keys(newData).forEach(key => {
      if (modifies[key] === currentStudentInfo[key]) {
        logger.info(`[admin-editStudent] {'${key}': '${modifies[key]}'} 与初始值相同 移除此key`)
        delete modifies[key]
      }
    })
    this.setData({
      modifies: modifies
    })
    this.updateModifyMark()
    this.enableAlertBeforeUnload(!utils.isEmpty(modifies))
    // logger.info(`[admin-editStudent] modifies: ${JSON.stringify(modifies)}`)
  },

  updateModifyMark() {
    const { titles, modifies } = this.data
    Object.keys(titles).forEach(key => {
      titles[key] = this.setModifyMark(titles[key], false)
    })
    Object.keys(modifies).forEach(key => {
      titles[key] = this.setModifyMark(titles[key], true)
    })
    this.setData({
      titles: titles
    })
  },

  setModifyMark(label, enable) {
    if (enable) {
      return label.replace(/\*+$/, '') + '*'
    }
    return label.replace(/\*/g, '')
  },

  async onChooseAvatar(e) {
    const OPENID = this.data.studentInfo.OPENID;
    const filePath = e.detail.avatarUrl;
    const cloudPath = 'studentAvatars/avatar_' + OPENID + '.png';
    logger.info(`[admin-editStudent] 用户选择本地头像路径: ${filePath} 头像云存储保存路径: ${cloudPath}`);
    try { 
      wx.showLoading({ title: '正在上传头像' });
      const uploadRes = await this.uploadAvatar(filePath, cloudPath);

      wx.showLoading({ title: '获取临时链接' });
      const tempFileRes = await this.getTempFileURL(uploadRes.fileID);
      const avatarUrl = tempFileRes.fileList[0].tempFileURL + '?t=' + new Date().getTime();
      logger.info(`[admin-editStudent] 获取到头像临时链接: ${avatarUrl}`)

      wx.showLoading({ title: '正在更新头像' });
      const modifies = { 'avatarUrl': avatarUrl };
      await this.updateStudent(OPENID, modifies);

      wx.showToast({ title: '头像更新成功', icon: 'success' });
      this.setData({ 'studentInfo.avatarUrl': avatarUrl });
    } catch (error) {
      logger.error(`[admin-editStudent] 头像更新错误: ${error}`);
      wx.showToast({ title: '头像更新错误', icon: 'error' });
    }
  },

  uploadAvatar(filePath, cloudPath) {
    return new Promise((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath: cloudPath,
        filePath: filePath
      }).then(res => {
        logger.info(`[admin-editStudent] 上传头像回应: ${JSON.stringify(res)}`);
        resolve(res);
      }).catch(reject);
    })
  },

  getTempFileURL(fileID) {
    return new Promise((resolve, reject) => {
      wx.cloud.getTempFileURL({
        fileList: [fileID]
      }).then(res => {
        logger.info(`[admin-editStudent] 获取头像临时链接回应: ${JSON.stringify(res)}`);
        resolve(res);
      }).catch(reject);
    })
  },

  updateStudent(OPENID, modifies) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'updateStudent',
          data: { OPENID, modifies },
        }
      }).then(res => {
        logger.info(`[admin-editStudent] 更新学生基础信息回应: ${JSON.stringify(res)}`);
        if (res.result.code !== 0) {
          reject(JSON.stringify(res))
          return
        }
        resolve(res)
      }).catch(reject);
    })
  },

  bindInputName(e) {
    const name = this.nameJudge(e.detail.value)
    this.setData({ 'studentInfo.studentName': name })
    this.modifiesData({ 'studentName': name })
    logger.info('[admin-editStudent] 修改学生名字: ' + name)
  },

  nameJudge(name) {
    return name.toString().replace(/[^\u4e00-\u9fa5\w]/g,'')
  },

  bindInputPhone(e) {
    const phone = this.phoneJudge(e.detail.value)
    this.setData({ 'studentInfo.phone': phone })
    this.modifiesData({ 'phone': phone })
    logger.info('[admin-editStudent] 修改电话: ' + phone)
  },

  phoneJudge(phone) {
    return phone.toString().replace(/\D/g, '')
  },

  bindBirthdayChange(e) { 
    const birthdayFormat = e.detail.value 
    this.setData({ 
      'studentInfo.birthdayFormat': birthdayFormat
    }) //这个值用于转换时间 不要上传
    logger.info('[admin-editStudent] 修改生日Format: ' + birthdayFormat)
    this.birthdayParser(birthdayFormat)
  }, 

  birthdayParser(birthdayFormat) {
    if (!birthdayFormat) {
      logger.error('[admin-editStudent] 检查选择的生日Format')
      return
    }
    const birthdayTimeStamp = timeUtils.dateFormat2TimeStamp(birthdayFormat)
    this.setData({ 'studentInfo.birthday': birthdayTimeStamp })
    this.modifiesData({ 'birthday': birthdayTimeStamp })
    logger.info('[admin-editStudent] 修改生日TimeStamp: ' + birthdayTimeStamp)
  },

  bindGenderChange(e) {
    const index = e.detail.value
    this.setData({
      'genderIndex': index,
      'studentInfo.gender': index,
    })
    this.modifiesData({ 'gender': index })
    logger.info('[admin-editStudent] 修改性别: ' + this.data.genderArray[index])
  },

  bindGenderTap(e) {
    if (this.data.genderIndex == -1) { //防止第一次点击默认选中的位置不对
      this.setData({
        'genderIndex': 0
      })
    }
  },

  bindInputSchool(e) {
    const school = e.detail.value
    this.setData({ 'studentInfo.school': school })
    this.modifiesData({ 'school': school })
    logger.info('[admin-editStudent] 修改学校名字: ' + school)
  },

  bindInputStudyGoal(e) {
    const goal = e.detail.value
    this.setData({ 'studentInfo.studyGoal': goal })
    this.modifiesData({ 'studyGoal': goal })
    logger.info('[admin-editStudent] 修改学习目标: ' + goal)
  },

  bindSeatName(e) {
    const seatName = e.detail.value
    this.setData({ 'studentInfo.seatName': seatName })
    this.modifiesData({ 'seatName': seatName })
    logger.info('[admin-editStudent] 修改座位名称: ' + seatName)
  },

  bindSeatTypeChange(e) {
    const index = e.detail.value
    this.setData({
      'seatTypeIndex': index,
      'studentInfo.seatType': index,
    })
    this.modifiesData({ 'seatType': index })
    logger.info(`[admin-editStudent] 修改座位类型: [${index}: ${this.data.seatTypeArray[index]}]`)
  },

  bindSeatTypeTap(e) {
    if (this.data.seatTypeIndex == -1) { //防止第一次点击默认选中的位置不对
      this.setData({
        'seatTypeIndex': 0
      })
    }
  },

  bindDurationTypeChange(e) {
    const index = e.detail.value
    this.setData({
      'durationTypeIndex': index,
      'studentInfo.durationType': index,
    })
    this.modifiesData({ 'durationType': index })
    logger.info(`[admin-editStudent] 修改时长类型: [${index}: ${this.data.durationTypeArray[index]}]`)
  },

  bindDurationTypeTap(e) {
    if (this.data.seatTypeIndex == -1) { //防止第一次点击默认选中的位置不对
      this.setData({
        'seatTypeIndex': 0
      })
    }
  },

  bindPackageStartDateChange(e) { 
    const startDateFormat = e.detail.value 
    this.setData({ 
      'studentInfo.packageStartDateFormat': startDateFormat
    }) //这个值用于转换时间 不要上传
    logger.info('[admin-editStudent] 修改套餐起始日期Format: ' + startDateFormat)
    this.packageStartDateParser(startDateFormat)
  },

  packageStartDateParser(dateFormat) {
    if (!dateFormat) {
      logger.error('[admin-editStudent] 检查选择的套餐起始日期Format')
      return
    }
    const startDateFormatTimeStamp = timeUtils.dateFormat2TimeStamp(dateFormat)
    this.setData({ 'studentInfo.packageStartDate': startDateFormatTimeStamp })
    this.modifiesData({ 'packageStartDate': startDateFormatTimeStamp })
    logger.info('[admin-editStudent] 修改套餐起始日期TimeStamp: ' + startDateFormatTimeStamp)
  },

  bindPackageExpirationDateChange(e) { 
    const expirationDateFormat = e.detail.value 
    this.setData({ 
      'studentInfo.packageExpirationDateFormat': expirationDateFormat
    }) //这个值用于转换时间 不要上传
    logger.info('[admin-editStudent] 修改套餐到期日期Format: ' + expirationDateFormat)
    this.packageExpirationDateParser(expirationDateFormat)
  },

  packageExpirationDateParser(dateFormat) {
    if (!dateFormat) {
      logger.error('[admin-editStudent] 检查选择的套餐到期日期Format')
      return
    }
    const expirationDateFormatTimeStamp = timeUtils.dateFormat2TimeStamp(dateFormat)
    this.setData({ 'studentInfo.packageExpirationDate': expirationDateFormatTimeStamp })
    this.modifiesData({ 'packageExpirationDate': expirationDateFormatTimeStamp })
    logger.info('[admin-editStudent] 修改套餐到期日期TimeStamp: ' + expirationDateFormatTimeStamp)
  },

  saveInfo() {
    logger.info('[admin-editStudent] 保存个人信息')
    this.tryUpdateStudentInfo()
  },

  async tryUpdateStudentInfo() {
    const { studentInfo } = this.data
    //必填信息 start
    if (!studentInfo.studentName) {
      wx.showToast({ title: '请输入学生姓名', icon: 'error' })
      return
    }
    if (!studentInfo.phone || studentInfo.phone.length != 11) {
      wx.showToast({ title: '请输入手机号', icon: 'error' })
      return
    }
    if (!(this.data.genderIndex == 0 || this.data.genderIndex == 1)) {
      wx.showToast({ title: '请选择性别', icon: 'error' })
      return
    }
    if (!studentInfo.birthday) {
      wx.showToast({ title: '请输入生日', icon: 'error' })
      return
    }
    //必填信息 end
    wx.showLoading({ title: '正在保存' })
    const result = await getApp().getModels().students.list({
      filter: {
        where: {
          phone: {
            $eq: studentInfo.phone
          },
        }
      },
      select: {
        OPENID: true,
        studentName: true,
        phone: true,
      },
      getCount: true,
    })
    logger.info(`[admin-editStudent] 查询手机号是否重复回应: ${JSON.stringify(result)}`)
    if (result.data.total !== 0) {
      logger.info(`[admin-editStudent] 查询手机号: [${studentInfo.phone}] 所属OPENID: [${result.data.records[0].OPENID}]，当前修改用户OPENID: [${studentInfo.OPENID}]`)
      if (result.data.records[0].OPENID !== studentInfo.OPENID) { //查询同样的手机号 且不是当前用户的
        wx.showToast({ 
          title: '该手机号已注册，请联系管理员处理！',
          icon: 'none',
          mask: true,
          duration: 2000,
        })
        return
      }
    }
    try { 
      const { modifies } = this.data
      logger.info(`[admin-editStudent] 本次修改内容 modifies: ${JSON.stringify(modifies)}`)
      const OPENID = studentInfo.OPENID
      await this.updateStudent(OPENID, modifies)
      logger.info('[admin-editStudent] 学生基础信息保存成功')
      wx.showToast({ title: '保存成功', icon: 'success', duration: 1500 })
      this.enableAlertBeforeUnload(false)
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (error) {
      logger.error(`[admin-editStudent] 更新学生基础信息错误: ${error}`)
      wx.showToast({ title: '更新信息错误', icon: 'error' })
    }
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