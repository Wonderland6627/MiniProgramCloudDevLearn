// pages/nbstudy/admin-main/index.js

const logger = require('../../../logger.js')

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

    selectedTabStudents: [],
    allStudents: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchStudents()
  },

  async fetchStudents() {
    const result = await getApp().getModels().students.list({
      filter: {
        where: {}
      },
      getCount: true,
    })
    const list = result?.data.records || {}
    this.setData({
      allStudents: list
    })
    logger.info(`[admin-main] 获取所有学生列表 长度: ${list.length}`)
    this.onSwitchTabChanged(0)
	},
	
	handleCellTap(e) {
		const index = e.currentTarget.dataset.index
		const studentInfo = this.data.selectedTabStudents[index]
		logger.info('[admin-main] 选择学生: ' + JSON.stringify(studentInfo))
		wx.setStorageSync('selectedStudentInfo', studentInfo)
		wx.navigateTo({
			url: '/pages/nbstudy/admin-editStudent/index',
		})
  },

  switchTab: function(e) {
    const index = e.currentTarget.dataset.index;
    const tab = this.data.tabs[index]
    this.setData({
      selectedTabIndex: index,
    });
    logger.info(`[adming-main] 切换学生列表tab: [${index}, ${tab.title}]`)
    this.onSwitchTabChanged(index)
  },

  onSwitchTabChanged(index) {
    const tab = this.data.tabs[index]
    const filtedList = this.data.allStudents.filter(tab.filter)
    this.setData({
      selectedTabStudents: filtedList,
    });
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