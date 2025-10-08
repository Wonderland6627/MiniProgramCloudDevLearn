// pages/nbstudy/admin-main/index.js

const remoteConfig = require('../../../remoteConfig.js')
const logger = require('../../../logger.js')
const consts = require('../../../consts.js')
const utils = require('../../../utils/utils.js')
const timeUtils = require('../../../utils/timeUtils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    programMode: 'private',
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
    
    // 排序相关
    sortTypes: [
      { key: 'default', label: '默认排序' },
      { key: 'expiry', label: '按到期时间' }
    ],
    currentSortType: { key: 'default', label: '默认排序' },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setupMode()
    this.fetchStudents()
  },

  setupMode() {
    let programMode = remoteConfig.config.programMode
    logger.info(`[admin-main] program mode: ${programMode}`)
    this.setData({
      programMode: programMode
    })
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
    allStudents = this.setupStudents(allStudents)
    allStudents = this.sortStudents(allStudents)
    this.setData({
      allStudents: allStudents
    })
  },

  setupStudents(list) {
    let newList = []
    list.forEach((student) => {
      let parsedInfo = getApp().dataMgr.parseStudentInfo(student)
      newList.push(parsedInfo)
    })
    return newList
  },

  sortStudents(list) {
    list.sort((a, b) => {
      if (a.isValidPackage && !b.isValidPackage) {
        return -1
      } else if (!a.isValidPackage && b.isValidPackage) {
        return 1
      }
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
        let [aAlpha, aNum] = [seatNameA.replace(/\d/g, ''), parseInt(seatNameA.replace(/\D/g, ''), 10)]
        let [bAlpha, bNum] = [seatNameB.replace(/\d/g, ''), parseInt(seatNameB.replace(/\D/g, ''), 10)]
        if (aAlpha !== bAlpha) {
          return aAlpha.localeCompare(bAlpha)
        } else {
          return aNum - bNum
        }
      }
      if (a.durationType !== b.durationType) {
        return b.durationType - a.durationType
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
    logger.info(`[admin-main] 切换学生列表tab: [${index}, ${tab.title}]`)
    this.onSwitchTabChanged(index)
  },

  onSwitchTabChanged(index) {
    this.scrollToTop()
    const tab = this.data.tabs[index]
    const filteredList = this.data.allStudents.filter(tab.filter)
    const sortedList = this.applySorting(filteredList)
    this.setData({
      selectedTabStudents: sortedList,
    })
  },

  /**
   * 排序按钮点击事件
   */
  onSortButtonTap() {
    const currentIndex = this.data.sortTypes.findIndex(type => type.key === this.data.currentSortType.key)
    const nextIndex = (currentIndex + 1) % this.data.sortTypes.length
    const nextSortType = this.data.sortTypes[nextIndex]
    
    logger.info(`[admin-main] 切换排序方式: ${this.data.currentSortType.label} -> ${nextSortType.label}`)
    
    this.setData({
      currentSortType: nextSortType
    })
    
    // 重新应用排序
    this.onSwitchTabChanged(this.data.selectedTabIndex)
  },

  /**
   * 应用排序
   */
  applySorting(list) {
    const sortType = this.data.currentSortType.key
    
    switch (sortType) {
      case 'expiry':
        return this.sortByExpiry(list)
      default:
        return this.sortStudents(list) // 使用原有的默认排序
    }
  },

  /**
   * 按到期时间排序
   * 到期时间越接近的排在越前面，没有套餐信息或已过期的排在后面
   */
  sortByExpiry(list) {
    return [...list].sort((a, b) => {
      const now = new Date()
      
      // 处理学生a的到期时间
      let expiryA = null
      if (a.packageExpirationDate) {
        expiryA = new Date(a.packageExpirationDate)
      }
      
      // 处理学生b的到期时间
      let expiryB = null
      if (b.packageExpirationDate) {
        expiryB = new Date(b.packageExpirationDate)
      }
      
      // 没有套餐信息的情况
      if (!expiryA && !expiryB) return 0
      if (!expiryA) return 1  // a没有套餐信息，排在后面
      if (!expiryB) return -1 // b没有套餐信息，排在后面
      
      // 已过期的情况
      const isExpiredA = expiryA < now
      const isExpiredB = expiryB < now
      
      if (isExpiredA && isExpiredB) {
        // 都已过期，按过期时间倒序（过期时间越近的排在前面）
        return expiryB - expiryA
      }
      if (isExpiredA) return 1  // a已过期，排在后面
      if (isExpiredB) return -1 // b已过期，排在后面
      
      // 都未过期，按到期时间升序（到期时间越近的排在前面）
      return expiryA - expiryB
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
   * 右下角加号按钮点击事件
   */
  onAddButtonTap() {
    logger.info('[admin-main] 点击右下角加号按钮，准备添加新学生')
    // 清除可能存在的选中学生信息
    wx.removeStorageSync('selectedStudentInfo')
    // 跳转到编辑页面，传递新增模式标识
    wx.navigateTo({
      url: '/pages/nbstudy/admin-editStudent/index?mode=create'
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