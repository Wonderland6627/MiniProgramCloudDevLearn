// pages/nbstudy/admin-main/index.js

const log = require('../../../log.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    students: [

    ]
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
      students: list
    })
    log.info(result)
	},
	
	handleCellTap(e) {
		const index = e.currentTarget.dataset.index
		const studentInfo = this.data.students[index]
		log.info('选择学生: ' + JSON.stringify(studentInfo))
		wx.setStorageSync('selectedStudentInfo', studentInfo)
		wx.navigateTo({
			url: '/pages/nbstudy/admin-editStudent/index',
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