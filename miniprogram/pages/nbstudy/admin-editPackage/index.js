// pages/nbstudy/admin-editPackage/index.js

const utils = require('../../../utils.js')

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

const SeatTypeRemote2Local = {
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'VIP',
}

const DurationTypeRemote2Local = {
  1: 'Temp',
  2: 'Week',
  3: 'Month',
  4: 'Season',
  5: 'Year',
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    seatInfosTable: [
      { type: SeatType.VIP, label: 'VIP单间' },
      { type: SeatType.B, label: 'B座位' },
      { type: SeatType.C, label: 'C座位' },
    ],
    durationInfosTable: [
      { type: DurationType.Temp, label: '次卡' },
      { type: DurationType.Week, label: '周卡' },
      { type: DurationType.Month, label: '月卡' },
      { type: DurationType.Season, label: '季卡' },
      { type: DurationType.Year, label: '年卡' }
    ],

    selected: {
      seat: SeatType.B,
      duration: DurationType.Month,
    },
    price: 0,
    giftDayCount: 0,
    packages: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchPackages()
  },

  async fetchPackages() {
    // wx.showLoading({
    //   title: '获取数据',
    // })
    const result = await getApp().getModels().packages.list({
      filter: {
        where: {}
      },
      getCount: true,
    })
    console.log('拉取所有套餐信息: ' + JSON.stringify(result))
    const records = result?.data.records || {}
    if (utils.isEmpty(records)) {
      wx.showToast({
        title: '获取信息失败',
        icon: 'error',
      })
      return
    }
    this.onReceiveRecords(records)
  },

  onReceiveRecords(records) {
    const packageMap = []
    records.forEach(record => {
      const { seatType, durationType } = record
      const seatKey = SeatTypeRemote2Local[seatType]
      const durationKey = DurationTypeRemote2Local[durationType]
      if (!packageMap[seatKey]) {
        packageMap[seatKey] = {}
      }
      if (!packageMap[seatKey][durationKey]) {
        packageMap[seatKey][durationKey] = [] 
      }
      const data = {
        price: record.price,
        giftDayCount: record.giftDayCount,
      }
      packageMap[seatKey][durationKey] = data
    })
    console.log(packageMap) 
    this.setData({
      packages: packageMap
    })
  },

  getPackageData(seatKey, durationKey) {
    const { packages } = this.data
    return packages[seatKey]
  },

  selectSeat(e) {
    const selectedValue = e.currentTarget.dataset.value
    this.setData({
      'selected.seat': selectedValue
    })
    const { selected } = this.data
    console.log(this.getPackageData(selected.seat, selected.duration))
  },

  selectDuration(e) {
    const selectedValue = e.currentTarget.dataset.value
    this.setData({
      'selected.duration': selectedValue
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