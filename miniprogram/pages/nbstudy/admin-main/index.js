// pages/nbstudy/admin-main/index.js

const logger = require('../../../logger.js')
const consts = require('../../../consts.js')
const utils = require('../../../utils/utils.js')
const timeUtils = require('../../../utils/timeUtils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedTabIndex: 0,
    tabs: [
      { title: '所有学生', filter: student => true },
      { title: '套餐内学生', filter: student => new Date(student.packageExpirationDate) >= new Date() },
      { title: '待绑定学生', filter: student => student.OPENID == getApp().globalData.pendingOPENID },
    ],

    constsInfo: {
      durations: consts.DurationTypeInfoMap,
      seats: consts.SeatTypeInfoMap,
    },

    scroll: {
      scrollTop: 0,
      refresherTriggered: false,
    },
    selectedTabStudents: [],
    allStudents: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchStudents()
  },

  fetchStudents() {
    return new Promise((resolve, reject) => {
      wx.showLoading({ title: '拉取列表中', mask: true })
      getApp().getModels().students.list({
        filter: {
          where: {}
        },
        select: {
          _id: true,
          OPENID: true,
          avatarUrl: true,
          studentName: true,
          seatName: true,
          seatType: true,
          durationType: true,
          packageExpirationDate: true,
        },
        pageSize: 100,
        getCount: true,
      }).then(result => {
        const list = result?.data.records || []
        logger.info(`[admin-main] 拉取所有学生列表 长度: ${list.length} ↓`)
        logger.info(list)
        if (list.length == 0) {
          wx.showToast({ title: '无数据', mask: true })
          reject('无数据')
          return
        }
        wx.showToast({
          title: '拉取成功',
          icon: 'success',
          mask: true,
        })
        this.onGetStudentInfosList(list)
        this.onSwitchTabChanged(this.data.selectedTabIndex)
        resolve(list)
      }).catch(error => {
        logger.error(`[admin-main] 拉取所有学生列表错误: ${error}`)
        wx.showToast({
          title: '拉取错误',
          icon: 'error',
          mask: true,
        })
        reject(error)
      })
    })
  },

  onGetStudentInfosList(list) {
    let allStudents = list
    allStudents = this.sortStudents(allStudents)
    allStudents = this.setupStudents(allStudents)
    this.setData({
      allStudents: allStudents
    })
  },

  setupStudents(list) {
    list.forEach((student) => {
      const packageExpirationDate = student.packageExpirationDate
      if (packageExpirationDate) {
        student['packageExpirationDateFormat'] = timeUtils.timeStamp2DateFormat(packageExpirationDate)
        student['isInPackage'] = new Date(packageExpirationDate) >= new Date()
      }
    })
    return list
  },

  sortStudents(list) {
    list.sort((a, b) => {
      const seatTypeA = a.seatType
      const seatTypeB = b.seatType
      if (seatTypeA === '0') {
        return 1
      }
      if (seatTypeB === '0') {
        return -1
      }
      if (seatTypeA !== seatTypeB) {
        return seatTypeA - seatTypeB
      }
      const seatNameA = a.seatName || ""
      const seatNameB = b.seatName || ""
      if (seatNameA === "" && seatNameB !== "") {
        return 1
      } else if (seatNameA !== "" && seatNameB === "") {
        return -1
      }
      if (seatNameA !== seatNameB) {
        return seatNameB.localeCompare(seatNameA)
      }
      if (a.durationType !== b.durationType) {
        return a.durationType - b.durationType
      }
      return a.studentName.localeCompare(b.studentName)
    })
    return list
  },
	
	handleCellTap(e) {
		const index = e.currentTarget.dataset.index
    const studentInfo = this.data.selectedTabStudents[index]
    const _id = studentInfo?._id
    if (_id == '') {
      logger.info(`[admin-main] 选择学生_id为空`)
      wx.showToast({
        title: `所选_id为空，请联系管理员处理`,
        icon: 'none',
      })
      return
    }
    logger.info('[admin-main] 选择学生: ' + JSON.stringify(studentInfo))
    this.fetchStudentInfo(_id)
    .then(info => {
      wx.setStorageSync('selectedStudentInfo', info)
		  wx.navigateTo({
		  	url: '/pages/nbstudy/admin-editStudent/index',
		  })
    })
  },

  fetchStudentInfo(_id) {
    return new Promise((resolve, reject) => {
      wx.showLoading({ title: '拉取信息中', mask: true, })
      getApp().getModels().students.get({
        filter: {
          where: {
            _id: {
              $eq: _id,
            }
          }
        }
      })
      .then(result => {
        const data = result?.data
        if (utils.isEmpty(data)) {
          const log = `[admin-main] fetch student info failed: not exists: ${_id}`
          logger.error(log)
          wx.showToast({
            title: `拉取数据为空，请联系管理员处理`,
            icon: 'none',
          })
          reject(log)
          return
        }
        logger.info(`[admin-main] fetch student info success: ${_id}`)
        wx.hideLoading()
        resolve(data)
      })
      .catch(error => {
        const log = `[admin-main] fetch student info error: ${error}`
        logger.error(log);
        wx.showToast({
          title: `数据拉取错误，请联系管理员处理`,
          icon: 'none',
        })
        reject(log)
      })
    })
  },

  switchTab: function(e) {
    const index = e.currentTarget.dataset.index
    const tab = this.data.tabs[index]
    this.setData({
      selectedTabIndex: index,
    })
    logger.info(`[adming-main] 切换学生列表tab: [${index}, ${tab.title}]`)
    this.onSwitchTabChanged(index)
  },

  onSwitchTabChanged(index) {
    this.scrollToTop()
    const tab = this.data.tabs[index]
    const filtedList = this.data.allStudents.filter(tab.filter)
    this.setData({
      selectedTabStudents: filtedList,
    })
  },

  scrollToTop() {
    this.setData({
      'scroll.scrollTop': 0,
    })
  },

  onScrollRefresh() {
    logger.info(`[admin-main] pull down refresh`)
    const endRefresh = () => {
      this.setData({
        'scroll.refresherTriggered': false,
      })
    }
    this.fetchStudents()
    .then(info => endRefresh())
    .catch(error => endRefresh())
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
        this.getTabBar().setData({
        selected: 0
      })
    }
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