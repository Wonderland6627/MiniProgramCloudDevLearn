// dataMgr.js

const utils = require('./utils/utils.js')
const logger = require('./logger.js')

const dataMgr = {
	studentInfo: {},
	
	setStudentInfo(info) {
    this.studentInfo = info
    logger.info('[dataMgr.js] set student info')
  },

  getStudentInfo(checkValid = true) {
    logger.info(`[dataMgr.js] get student info, checkValid: ${checkValid}`)
    if (checkValid) { //有些页面没有studentInfo不允许打开 返回登录页重新获取
      if (utils.isEmpty(this.studentInfo)) {
        getApp().logOut('数据缺失退出')
        throw new Error('[dataMgr.js] get student info null, back to login')
      }
    }
    return this.studentInfo
  },

  fetchStudentInfo() {
    logger.info('[dataMgr.js] start update student info');
    return new Promise(async (resolve, reject) => {
      const openid = getApp().getOpenID()
      if (openid === '') {
        logger.error('无效的 OpenID，无法更新 StudentInfo')
        // todo: back to login
        reject('[dataMgr.js] fetch student info failed: invalid openid')
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
          logger.error(`openid: ${openid} 的学生信息不存在`)
          reject(`[dataMgr.js] fetch student info failed: not exists: ${openid}`);
          //todo: back to login
          return
        }
        this.studentInfo = data
        logger.info('[dataMgr.js] update student info success');
        resolve(data);
      } catch (error) {
        logger.error('[dataMgr.js] fetch student info with error:', error);
        reject(error);
      }
    }) 
  },
}

module.exports = dataMgr