// dataMgr.js

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
}

module.exports = dataMgr