// pages/nbstudy/student-editBasicInfo/index.js

const remoteConfig = require('../../../remoteConfig.js')
const utils = require('../../../utils/utils.js')
const timeUtils = require('../../../utils/timeUtils.js')
const logger = require('../../../logger.js')
const cf = require('../../../commonFuntions.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    programMode: 'private',
    isNewUser: false,
    showNeedHelp: false,

    titles: {
      studentName: '姓名',
      phone: '手机号',
      gender: '性别',
      birthday: '出生日期',

      school: '学校',
      studyGoal: '我的目标',
    },
    genderIndex: -1,
    genderArray: [
      '女生', '男生',
    ],
    currentStudentInfo: {}, //初始值
    modifies: {}, //修改值
    studentInfo: { //显示值
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
    this.setupMode()
    let isNewUser = options.isNewUser
    let _id = options._id
    let info = getApp().dataMgr.getStudentInfo()
    logger.info(`[student-editBasicInfo] isNewUser: ${isNewUser} _id: ${_id} 获取studentBasicInfo: ${JSON.stringify(info)}`)
    this.setData({
      isNewUser: isNewUser,
      currentStudentInfo: utils.cloneWithJSON(info),
      studentInfo: getApp().dataMgr.parseStudentInfo(info),
    })
    if (!this.data.studentInfo._id) {
      this.setData({
        'studentInfo._id': _id,
      })
    }
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
  },

  setupMode() {
    let programMode = remoteConfig.config.programMode
    logger.info(`[student-editBasicInfo] program mode: ${programMode}`)
    this.setData({
      programMode: programMode
    })
  },

  enableAlertBeforeUnload(enable) {
    logger.info(`[student-editBasicInfo] 退出前显示未保存修改提示: ${enable}`)
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
        logger.info(`[student-editBasicInfo] {'${key}': '${modifies[key]}'} 与初始值相同 移除此key`)
        delete modifies[key]
      }
    })
    this.setData({
      modifies: modifies
    })
    this.updateModifyMark()
    this.enableAlertBeforeUnload(!utils.isEmpty(modifies))
    // logger.info(`[student-editBasicInfo] modifies: ${JSON.stringify(modifies)}`)
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
    const _id = this.data.studentInfo._id
    const filePath = e.detail.avatarUrl;
    const cloudPath = 'studentAvatars/avatar_' + OPENID + '.png';
    logger.info(`[student-editBasicInfo] 用户选择本地头像路径: ${filePath} 头像云存储保存路径: ${cloudPath}`);
    try { 
      wx.showLoading({ title: '正在上传头像', mask: true });
      const uploadRes = await this.uploadAvatar(filePath, cloudPath);

      wx.showLoading({ title: '获取临时链接', mask: true });
      const tempFileRes = await this.getTempFileURL(uploadRes.fileID);
      const avatarUrl = tempFileRes.fileList[0].tempFileURL + '?t=' + new Date().getTime();
      logger.info(`[student-editBasicInfo] 获取到头像临时链接: ${avatarUrl}`)

      wx.showLoading({ title: '正在更新头像', mask: true });
      const modifies = { 'avatarUrl': avatarUrl };
      await this.updateStudent(_id, modifies);

      wx.showToast({ title: '头像更新成功', icon: 'success', mask: true });
      this.setData({ 'studentInfo.avatarUrl': avatarUrl });
    } catch (error) {
      logger.error(`[student-editBasicInfo] 头像更新错误: ${error}`);
      wx.showToast({ title: '头像更新错误', icon: 'error', mask: true });
    }
  },

  uploadAvatar(filePath, cloudPath) {
    return new Promise((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath: cloudPath,
        filePath: filePath
      }).then(res => {
        logger.info(`[student-editBasicInfo] 上传头像回应: ${JSON.stringify(res)}`);
        resolve(res);
      }).catch(reject);
    })
  },

  getTempFileURL(fileID) {
    return new Promise((resolve, reject) => {
      wx.cloud.getTempFileURL({
        fileList: [fileID]
      }).then(res => {
        logger.info(`[student-editBasicInfo] 获取头像临时链接回应: ${JSON.stringify(res)}`);
        resolve(res);
      }).catch(reject);
    })
  },

  updateStudent(_id, modifies) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'updateStudentByDocID',
          data: { _id, modifies },
        }
      }).then(res => {
        logger.info(`[student-editBasicInfo] 更新学生基础信息回应: ${JSON.stringify(res)}`);
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
    logger.info('[student-editBasicInfo] 修改学生名字: ' + name)
  },

  nameJudge(name) {
    return name.toString().replace(/[^\u4e00-\u9fa5\w]/g,'')
  },

  bindInputPhone(e) {
    const phone = this.phoneJudge(e.detail.value)
    this.setData({ 'studentInfo.phone': phone })
    this.modifiesData({ 'phone': phone })
    logger.info('[student-editBasicInfo] 修改电话: ' + phone)
  },

  phoneJudge(phone) {
    return phone.toString().replace(/\D/g, '')
  },

  bindBirthdayChange(e) { 
    const birthdayFormat = e.detail.value 
    this.setData({ 
      'studentInfo.birthdayFormat': birthdayFormat
    }) //这个值用于转换时间 不要上传
    logger.info('[student-editBasicInfo] 修改生日Format: ' + birthdayFormat)
    this.birthdayParser(birthdayFormat)
  }, 

  birthdayParser(birthdayFormat) {
    if (!birthdayFormat) {
      logger.error('[student-editBasicInfo] 检查选择的生日Format')
      return
    }
    const birthdayTimeStamp = timeUtils.dateFormat2TimeStamp(birthdayFormat)
    this.setData({ 'studentInfo.birthday': birthdayTimeStamp })
    this.modifiesData({ 'birthday': birthdayTimeStamp })
    logger.info('[student-editBasicInfo] 修改生日TimeStamp: ' + birthdayTimeStamp)
  },

  bindGenderChange(e) {
    const index = e.detail.value
    this.setData({
      'genderIndex': index,
      'studentInfo.gender': index,
    })
    this.modifiesData({ 'gender': index })
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
    const school = e.detail.value
    this.setData({ 'studentInfo.school': school })
    this.modifiesData({ 'school': school })
    logger.info('[student-editBasicInfo] 修改学校名字: ' + school)
  },

  bindInputStudyGoal(e) {
    const goal = e.detail.value
    this.setData({ 'studentInfo.studyGoal': goal })
    this.modifiesData({ 'studyGoal': goal })
    logger.info('[student-editBasicInfo] 修改学习目标: ' + goal)
  },

  bindNeedHelp(e) {
    wx.showModal({
      title: '很抱歉带来了不好的体验',
      content: `请点击'上报数据'来协助我们为你解决问题，请稍后重新尝试注册，感谢配合！`,
      confirmText: '上报数据',
      complete: (res) => {
        if (res.confirm) {
          let content = `[student-editBasicInfo] need help, studentInfo: ${JSON.stringify(this.data.studentInfo)}, modifies: ${JSON.stringify(this.data.modifies)}`
          cf.createFeedback(content)
        }
      }
    })
  },

  saveInfo() {
    logger.info('[student-editBasicInfo] 保存个人信息')
    this.tryUpdateStudentInfo(true)
  },

  async tryUpdateStudentInfo(checkRequired = true) {
    const { studentInfo } = this.data
    if (checkRequired) {
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
    }
    wx.showLoading({ title: '正在保存', mask: true })
    if (checkRequired) {
      const result = await getApp().getModels().students.list({
        filter: {
          where: {
            phone: {
              $eq: studentInfo.phone
            },
          }
        },
        select: {
          _id: true,
          OPENID: true,
          studentName: true,
          phone: true,
        },
        getCount: true,
      })
      logger.info(`[student-editBasicInfo] 查询手机号是否重复回应: ${JSON.stringify(result)}`)
      if (result.data.total !== 0) {
        logger.info(`[student-editBasicInfo] 查询手机号: [${studentInfo.phone}] 所属OPENID&_id: [${result.data.records[0].OPENID} -- ${result.data.records[0]._id}]，当前修改用户OPENID&_id: [${studentInfo.OPENID} -- ${studentInfo._id}]`)
        if (result.data.records[0]._id !== studentInfo._id) { //查询同样的手机号 且不是当前用户的
          wx.showToast({
            title: '该手机号已注册，请联系管理员处理！',
            icon: 'none',
            mask: true,
            duration: 2000,
          })
          return
        }
      }
    }
    try { 
      const { modifies } = this.data
      logger.info(`[student-editBasicInfo] 本次修改内容 modifies: ${JSON.stringify(modifies)}`)
      logger.info(`[student-editBasicInfo] 本次修改后的studentInfo: ${JSON.stringify(studentInfo)}`)
      const _id = studentInfo._id
      await this.updateStudent(_id, modifies)
      logger.info('[student-editBasicInfo] 学生基础信息保存成功')
      wx.showToast({ title: '保存成功', icon: 'success', mask: true, duration: 1500 })
      getApp().dataMgr.setStudentInfo(studentInfo)
      this.enableAlertBeforeUnload(false)
      setTimeout(() => {
        if (this.data.isNewUser) {
          wx.switchTab({ url: '/pages/nbstudy/student-main/index' })      
          return
        }
        wx.navigateBack()
      }, 1500)
    } catch (error) {
      logger.error(`[student-editBasicInfo] 更新学生基础信息错误: ${error}`)
      this.setData({
        showNeedHelp: true,
      })
      wx.showToast({ title: '更新信息错误', icon: 'error', mask: true })
    }
  },

  saveInfoPrivately() {
    logger.info('[student-editBasicInfo] 保存个人信息 privately')
    if (!this.data.studentInfo.phone) {
      let phoneGUID = utils.generateGUID()
      this.setData({ 'studentInfo.phone': phoneGUID })
      this.modifiesData({ 'phone': phoneGUID })
    }
    this.tryUpdateStudentInfo(false)
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