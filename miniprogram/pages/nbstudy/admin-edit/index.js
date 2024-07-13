// pages/nbstudy/admin-edit/index.js
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
    console.log(result)
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
        selected: 1
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