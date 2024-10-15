// dataMgr.js

const utils = require('./utils/utils.js')
const timeUtils = require('./utils/timeUtils.js')
const logger = require('./logger.js')

const dataMgr = {
	studentInfo: {},
	
	setStudentInfo(info) {
    this.studentInfo = utils.cloneWithJSON(info)
    logger.info('[dataMgr] set student info')
  },

  getStudentInfo(checkValid = true) {
    logger.info(`[dataMgr] get student info, checkValid: ${checkValid}`)
    if (checkValid) { //有些页面没有studentInfo不允许打开 返回登录页重新获取
      if (utils.isEmpty(this.studentInfo)) {
        getApp().showLoginModal('数据缺失退出')
        throw new Error('[dataMgr] get student info null, back to login')
      }
    }
    return utils.cloneWithJSON(this.studentInfo)
  },

  fetchStudentInfo() {
    logger.info('[dataMgr] start update student info');
    return new Promise(async (resolve, reject) => {
      const openid = getApp().getOpenID()
      if (openid === '') {
        // todo: back to login
        reject('[dataMgr] fetch student info failed: invalid openid')
        return
      }
      try {
        const result = await getApp().getModels().students.get({
          filter: {
            where: {
              OPENID: {
                $eq: openid,
              }
            }
          }
        })
        const data = result?.data
        if (utils.isEmpty(data)) {
          logger.error(`[dataMgr] openid: ${openid} 的学生信息不存在`)
          reject(`[dataMgr] fetch student info failed: not exists: ${openid}`);
          getApp().logOut('openid有误，学生信息不存在')
          return
        }
        let parsedData = this.parseStudentInfo(data)
        logger.info(`[dataMgr] fetch & update student info success, isVIP: ${parsedData.isVIP}`);
        this.studentInfo = parsedData
        resolve(parsedData);
      } catch (error) {
        logger.error('[dataMgr] fetch student info with error:', error);
        reject(error);
      }
    }) 
  },

  parseStudentInfo(info) {
    let studentInfo = utils.cloneWithJSON(info)
    if (!studentInfo.avatarUrl) {
      studentInfo.avatarUrl = getApp().globalData.defaultAvatarUrl
    }
    if (studentInfo.birthday) {
      studentInfo.birthdayFormat = timeUtils.timeStamp2DateFormat(studentInfo.birthday)
    }
    if (studentInfo.packageStartDate) {
      studentInfo.packageStartDateFormat = timeUtils.timeStamp2DateFormat(studentInfo.packageStartDate)
    }
    let expirationDate = studentInfo.packageExpirationDate
    if (expirationDate) {
      studentInfo.packageExpirationDateFormat = timeUtils.timeStamp2DateFormat(expirationDate)
    }
    studentInfo.isVIP = expirationDate && new Date(expirationDate) > new Date() && studentInfo.seatName !== '' //套餐没到期、有座位名称 就认为是VIP
    studentInfo.isTemp = !expirationDate //如果没有套餐到期日期 就认为是临时用户
    return studentInfo
  },

  clear() {
    logger.info('[dataMgr] clear datas');
    this.studentInfo = {}
    wx.clearStorage()
  },
}

module.exports = dataMgr