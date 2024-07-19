// pages/nbstudy/admin-editPackage/index.js

//与后台枚举选项内容要保持一致
const SeatType = {
  A: 'A',
  B: 'B',
  C: 'C',
  VIP: 'VIP',
}

const DurationType = {
  Temp: '次卡',
  Week: '周卡',
  Month: '月卡',
  Season: '季卡',
  Year: '年卡',
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    seatInfosTable: [
      { type: SeatType.A, label: 'A座位' },
      { type: SeatType.B, label: 'B座位' },
      { type: SeatType.C, label: 'C座位' },
      { type: SeatType.VIP, label: 'VIP座位' }
    ],
    durationInfosTable: [
      { type: DurationType.Temp, label: '次卡' },
      { type: DurationType.Week, label: '周卡' },
      { type: DurationType.Month, label: '月卡' },
      { type: DurationType.Season, label: '季卡' },
      { type: DurationType.Year, label: '年卡' }
    ],

    selectedSeat: SeatType.A,
    selectedDuration: DurationType.Temp,
    price: 0,
    giftDays: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },

  async fetchPackages() {

  },

  selectSeat(e) {
    const selectedValue = e.currentTarget.dataset.value
    this.setData({
      selectedSeat: selectedValue
    })
  },

  selectDuration(e) {
    const selectedValue = e.currentTarget.dataset.value
    this.setData({
      selectedDuration: selectedValue
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