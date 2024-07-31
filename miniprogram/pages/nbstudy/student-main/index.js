// pages/nbstudy/student-main/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrls: [
      'https://wx3.sinaimg.cn/mw690/b3e366e1gy1hr8fashq9qj20tw0tstbc.jpg',
      'https://ww1.sinaimg.cn/mw690/0070NSSfgy1hrmykbkxnij335s35snp8.jpg',
      'https://img0.baidu.com/it/u=454995986,3330485591&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=375'
    ],

    selectedTabIndex: 0,
    introduces: [
      { title: "关于我们", content: "Tab 1 Content c1" },
      { title: "自习守则", content: "Tab 1 Content c2" },
    ]
  },

  switchTab: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedTabIndex: index
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let info = getApp().dataMgr.getStudentInfo()
    console.log(JSON.stringify(info))
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