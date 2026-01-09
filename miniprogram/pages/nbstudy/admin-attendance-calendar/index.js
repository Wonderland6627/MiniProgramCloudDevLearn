// pages/nbstudy/admin-attendance-calendar/index.js

const remoteConfig = require('../../../remoteConfig.js')
const logger = require('../../../logger.js')
const timeUtils = require('../../../utils/timeUtils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    programMode: 'private',
    selectedDate: '', // 格式：YYYY-MM-DD
    weekdayText: '', // 星期几
    attendanceList: [], // 当前日期的签到学生列表
    allStudents: [], // 所有学生列表（用于选择）
    showStudentPicker: false, // 是否显示学生选择弹窗
    searchKeyword: '', // 搜索关键词
    filteredStudentList: [], // 过滤后的学生列表
    selectedStudentId: '', // 选中的学生ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setupMode()
    this.initDate()
    this.fetchAllStudents()
    // 注意：这里暂时使用模拟数据，实际应该调用云函数获取签到记录
    this.fetchAttendanceByDate()
  },

  setupMode() {
    let programMode = remoteConfig.config.programMode
    logger.info(`[admin-attendance-calendar] program mode: ${programMode}`)
    this.setData({
      programMode: programMode
    })
  },

  /**
   * 初始化日期（默认今天）
   */
  initDate() {
    const today = new Date()
    const dateStr = timeUtils.date2DateFormatStr(today)
    const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekdayText = weekday[today.getDay()]
    
    this.setData({
      selectedDate: dateStr,
      weekdayText: weekdayText
    })
  },

  /**
   * 日期选择器变化事件
   */
  onDateChange(e) {
    const dateStr = e.detail.value
    const date = timeUtils.dateFormatStr2Date(dateStr)
    const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekdayText = weekday[date.getDay()]
    
    logger.info(`[admin-attendance-calendar] 选择日期: ${dateStr}`)
    
    this.setData({
      selectedDate: dateStr,
      weekdayText: weekdayText
    })
    
    // 重新获取该日期的签到记录
    this.fetchAttendanceByDate()
  },

  /**
   * 获取所有学生列表（用于选择）
   */
  fetchAllStudents() {
    // TODO: 实际应该调用云函数获取所有学生列表
    // 这里使用模拟数据
    logger.info('[admin-attendance-calendar] 获取所有学生列表（模拟数据）')
    
    // 模拟数据
    const mockStudents = [
      {
        _id: 'student1',
        studentName: '张三',
        nickname: 'Emily',
        avatarUrl: getApp().globalData.defaultAvatarUrl,
        durationType: '0',
        cardRemainingCount: 5
      },
      {
        _id: 'student2',
        studentName: '李四',
        nickname: 'Jacob',
        avatarUrl: getApp().globalData.defaultAvatarUrl,
        durationType: '1',
        cardRemainingCount: 0
      }
    ]
    
    this.setData({
      allStudents: mockStudents,
      filteredStudentList: mockStudents
    })
  },

  /**
   * 按日期获取签到记录
   */
  fetchAttendanceByDate() {
    const { selectedDate } = this.data
    
    logger.info(`[admin-attendance-calendar] 获取日期 ${selectedDate} 的签到记录（模拟数据）`)
    
    // TODO: 实际应该调用云函数 getAttendanceByDate
    // wx.cloud.callFunction({
    //   name: 'quickstartFunctions',
    //   data: {
    //     type: 'getAttendanceByDate',
    //     data: {
    //       attendanceDate: selectedDate
    //     }
    //   }
    // }).then(res => {
    //   // 处理返回数据
    // })
    
    // 模拟数据
    const mockAttendance = [
      {
        _id: 'attendance1',
        studentId: 'student1',
        studentName: '张三',
        nickname: 'Emily',
        avatarUrl: getApp().globalData.defaultAvatarUrl,
        durationType: '0',
        cardRemainingCount: 5,
        attendanceTimestamp: Date.now()
      }
    ]
    
    this.setData({
      attendanceList: mockAttendance
    })
  },

  /**
   * 添加签到按钮点击
   */
  onAddAttendance() {
    logger.info('[admin-attendance-calendar] 点击添加签到学生')
    
    // 过滤掉已经签到的学生
    const { attendanceList, allStudents } = this.data
    const attendedStudentIds = attendanceList.map(item => item.studentId)
    const availableStudents = allStudents.map(student => {
      return {
        ...student,
        selected: false
      }
    }).filter(student => !attendedStudentIds.includes(student._id))
    
    this.setData({
      showStudentPicker: true,
      filteredStudentList: availableStudents,
      searchKeyword: '',
      selectedStudentId: ''
    })
  },

  /**
   * 关闭学生选择弹窗
   */
  onCloseStudentPicker() {
    this.setData({
      showStudentPicker: false,
      searchKeyword: '',
      selectedStudentId: ''
    })
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    const keyword = e.detail.value
    const { allStudents, attendanceList } = this.data
    
    logger.info(`[admin-attendance-calendar] 搜索关键词: ${keyword}`)
    
    // 过滤掉已经签到的学生
    const attendedStudentIds = attendanceList.map(item => item.studentId)
    const availableStudents = allStudents.filter(student => !attendedStudentIds.includes(student._id))
    
    // 根据关键词过滤
    let filtered = availableStudents
    if (keyword.trim()) {
      filtered = availableStudents.filter(student => {
        const name = this.data.programMode !== 'private' ? student.studentName : student.nickname
        return name && name.includes(keyword.trim())
      })
    }
    
    // 标记选中状态
    const filteredWithSelected = filtered.map(student => {
      return {
        ...student,
        selected: student._id === this.data.selectedStudentId
      }
    })
    
    this.setData({
      searchKeyword: keyword,
      filteredStudentList: filteredWithSelected
    })
  },

  /**
   * 选择学生
   */
  onSelectStudent(e) {
    const index = e.currentTarget.dataset.index
    const student = this.data.filteredStudentList[index]
    
    logger.info(`[admin-attendance-calendar] 选择学生: ${student._id}`)
    
    // 更新选中状态
    const filteredList = this.data.filteredStudentList.map((item, idx) => {
      return {
        ...item,
        selected: idx === index
      }
    })
    
    this.setData({
      filteredStudentList: filteredList,
      selectedStudentId: student._id
    })
  },

  /**
   * 确认添加签到
   */
  onConfirmAddAttendance() {
    const { selectedStudentId, selectedDate } = this.data
    
    if (!selectedStudentId) {
      wx.showToast({
        title: '请选择学生',
        icon: 'none'
      })
      return
    }
    
    logger.info(`[admin-attendance-calendar] 确认添加签到: studentId=${selectedStudentId}, date=${selectedDate}`)
    
    // TODO: 实际应该调用云函数 addAttendance
    // wx.cloud.callFunction({
    //   name: 'quickstartFunctions',
    //   data: {
    //     type: 'addAttendance',
    //     data: {
    //       studentId: selectedStudentId,
    //       attendanceDate: selectedDate
    //     }
    //   }
    // }).then(res => {
    //   if (res.result.code === 0) {
    //     wx.showToast({
    //       title: '添加成功',
    //       icon: 'success'
    //     })
    //     this.onCloseStudentPicker()
    //     this.fetchAttendanceByDate()
    //   } else {
    //     wx.showToast({
    //       title: res.result.errMsg || '添加失败',
    //       icon: 'none'
    //     })
    //   }
    // })
    
    // 模拟添加成功
    wx.showToast({
      title: '添加成功（模拟）',
      icon: 'success'
    })
    this.onCloseStudentPicker()
    // 重新获取签到记录
    this.fetchAttendanceByDate()
  },

  /**
   * 删除签到记录
   */
  onDeleteAttendance(e) {
    const index = e.currentTarget.dataset.index
    const attendance = this.data.attendanceList[index]
    
    logger.info(`[admin-attendance-calendar] 删除签到记录: ${attendance._id}`)
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条签到记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.doDeleteAttendance(attendance)
        }
      }
    })
  },

  /**
   * 执行删除操作
   */
  doDeleteAttendance(attendance) {
    // TODO: 实际应该调用云函数 deleteAttendance
    // wx.cloud.callFunction({
    //   name: 'quickstartFunctions',
    //   data: {
    //     type: 'deleteAttendance',
    //     data: {
    //       attendanceId: attendance._id,
    //       studentId: attendance.studentId,
    //       attendanceDate: this.data.selectedDate
    //     }
    //   }
    // }).then(res => {
    //   if (res.result.code === 0) {
    //     wx.showToast({
    //       title: '删除成功',
    //       icon: 'success'
    //     })
    //     this.fetchAttendanceByDate()
    //   } else {
    //     wx.showToast({
    //       title: res.result.errMsg || '删除失败',
    //       icon: 'none'
    //     })
    //   }
    // })
    
    // 模拟删除成功
    wx.showToast({
      title: '删除成功（模拟）',
      icon: 'success'
    })
    // 重新获取签到记录
    this.fetchAttendanceByDate()
  },

  /**
   * 阻止事件冒泡
   */
  stopPropagation() {
    // 阻止点击弹窗内容时关闭弹窗
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面显示时刷新数据
    this.fetchAttendanceByDate()
  }
})

