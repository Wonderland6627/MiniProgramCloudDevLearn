// pages/nbstudy/admin-editPackage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedSeat: 'A',
    selectedDuration: '次卡'
  },
  selectSeatA: function() {
    this.setData({ selectedSeat: 'A' });
  },
  selectSeatB: function() {
    this.setData({ selectedSeat: 'B' });
  },
  selectSeatC: function() {
    this.setData({ selectedSeat: 'C' });
  },
  selectSeatVIP: function() {
    this.setData({ selectedSeat: 'VIP' });
  },
  selectDurationOnce: function() {
    this.setData({ selectedDuration: '次卡' });
  },
  selectDurationWeek: function() {
    this.setData({ selectedDuration: '周卡' });
  },
  selectDurationMonth: function() {
    this.setData({ selectedDuration: '月卡' });
  },
  selectDurationYear: function() {
    this.setData({ selectedDuration: '年卡' });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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