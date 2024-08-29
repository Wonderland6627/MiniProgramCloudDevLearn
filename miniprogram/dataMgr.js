// dataMgr.js

const utils = require('./utils/utils.js')
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
        getApp().logOut('数据缺失退出')
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
        logger.error('无效的 OpenID，无法更新 StudentInfo')
        // todo: back to login
        reject('[dataMgr] fetch student info failed: invalid openid')
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
          getApp().logOut()
          return
        }
        this.studentInfo = data
        logger.info('[dataMgr] update student info success');
        resolve(data);
      } catch (error) {
        logger.error('[dataMgr] fetch student info with error:', error);
        reject(error);
      }
    }) 
  },

  logOut() {
    logger.info('[dataMgr] log out, clear datas');
    this.studentInfo = {}
  },
}

module.exports = dataMgr