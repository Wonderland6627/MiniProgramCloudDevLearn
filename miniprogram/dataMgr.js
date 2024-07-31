// dataMgr.js

const utils = require('./utils/utils.js')

const dataMgr = {
	studentInfo: {},
	
	setStudentInfo(info) {
    this.studentInfo = info
    console.log('[dataMgr.js] set student info')
  },

  getStudentInfo() {
    console.log('[dataMgr.js] get student info')
    return this.studentInfo
  },

  fetchStudentInfo() {
    console.log('[dataMgr.js] start update student info');
    return new Promise(async (resolve, reject) => {
      const openid = getApp().getOpenID()
      if (openid === '') {
        console.error('无效的 OpenID，无法更新 StudentInfo')
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
          console.error(`openid: ${openid} 的学生信息不存在`)
          reject(`[dataMgr.js] fetch student info failed: not exists: ${openid}`);
          //todo: back to login
          return
        }
        this.studentInfo = data
        console.log('[dataMgr.js] update student info success');
        resolve(data);
      } catch (error) {
        console.error('[dataMgr.js] fetch student info with error:', error);
        reject(error);
      }
    }) 
  },
}

module.exports = dataMgr