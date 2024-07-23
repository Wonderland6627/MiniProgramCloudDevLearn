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
  Temp: 'Temp',
  Week: 'Week',
  Month: 'Month',
  Season: 'Season',
  Year: 'Year',
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

const SeatTypeLocal2Remote = {
  'A': '1',
  'B': '2',
  'C': '3',
  'VIP': '4',
}

const DurationTypeLocal2Remote = {
  'Temp': '1',
  'Week': '2',
  'Month': '3',
  'Season': '4',
  'Year': '5',
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
    currentPackages: [],
    modifiedPackages: [], //修改了的套餐信息
    modified: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchPackages()
  },

  async fetchPackages() {
    wx.showLoading({
      title: '获取数据',
    })
    const result = await getApp().getModels().packages.list({
      filter: {
        where: {}
      },
      pageSize: 20,
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
    wx.showToast({
      title: '获取信息成功',
      icon: 'success',
      duration: 500,
    })
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
      packageMap[seatKey][durationKey] = {
        price: record.price,
        giftDayCount: record.giftDayCount,
      }
    })
    console.log(packageMap) 
    this.setData({
      currentPackages: packageMap
    })
    this.updateInputs()
  },

  updateInputs() {
    const { selected } = this.data
    const selectPackageData = this.getPackageData(selected.seat, selected.duration)
    this.setData({
      price: selectPackageData.price,
      giftDayCount: selectPackageData.giftDayCount,
    })
  },

  //获取选中套餐的详情 默认返回远端信息 如果本地修改了 显示修改过的
  getPackageData(seatKey, durationKey) {
    const { currentPackages, modifiedPackages } = this.data
    if (modifiedPackages[seatKey] && modifiedPackages[seatKey][durationKey]) {
      return modifiedPackages[seatKey][durationKey]
    }
    return currentPackages[seatKey][durationKey]
  },

  selectSeat(e) {
    const selectedValue = e.currentTarget.dataset.value
    this.setData({
      'selected.seat': selectedValue
    })
    this.updateInputs()
    this.updateModifyMark()
  },

  selectDuration(e) {
    const selectedValue = e.currentTarget.dataset.value
    this.setData({
      'selected.duration': selectedValue
    })
    this.updateInputs()
  },

  updatePrice(e) {
    const newPrice = parseInt(e.detail.value)
    this.updateModifiedPackages('price', newPrice)
  },

  updateGiftDayCount(e) {
    const newGiftDays = parseInt(e.detail.value)
    this.updateModifiedPackages('giftDayCount', newGiftDays)
  },

  updateModifiedPackages(key, value) {
    const { selected, currentPackages, modifiedPackages } = this.data
    const seatType = selected.seat
    const durationType = selected.duration
    if (!modifiedPackages[seatType]) {
      modifiedPackages[seatType] = {}
    }
    if (!modifiedPackages[seatType][durationType]) {
      const curMapValue = JSON.stringify(currentPackages[seatType][durationType])
      modifiedPackages[seatType][durationType] = JSON.parse(curMapValue)
    }
    modifiedPackages[seatType][durationType][key] = value
    if (JSON.stringify(modifiedPackages[seatType][durationType]) ===  JSON.stringify(currentPackages[seatType][durationType])) {
      console.log(`modifiedPackages[${seatType}][${durationType}]修改值重置`)
      delete modifiedPackages[seatType][durationType]
      if (utils.isEmpty(modifiedPackages[seatType])) {
        delete modifiedPackages[seatType]
      }
    }
    console.log(modifiedPackages)
    this.setData({
      modifiedPackages: modifiedPackages,
      modified: !utils.isEmpty(modifiedPackages),
    })
    this.updateModifyMark()
  },

  updateModifyMark() {
    const { selected, seatInfosTable, durationInfosTable, modifiedPackages } = this.data
    seatInfosTable.forEach((seatInfo) => {
      const seatType = seatInfo.type
      const modified = modifiedPackages[seatType]
      seatInfo.label = this.setModifyMark(seatInfo.label, modified)
    })
    durationInfosTable.forEach((durationInfo) => {
      const seatType = selected.seat //时长类型是二级分类 修改标记显示根据座位类型而变化
      const durationType = durationInfo.type
      const modified = modifiedPackages[seatType] && modifiedPackages[seatType][durationType]
      durationInfo.label = this.setModifyMark(durationInfo.label, modified)
    })
    this.setData({
      seatInfosTable: seatInfosTable,
      durationInfosTable: durationInfosTable
    })
  },

  setModifyMark(label, enable) {
    if (enable) {
      return label.replace(/\*+$/, '') + '*'
    }
    return label.replace(/\*/g, '')
  },

  onSave() {
    this.trySavePackagesByCloudFunc()
  },

  trySavePackagesByCloudFunc() {
    const { modifiedPackages } = this.data
    const modifies = this.parsePackages2Array(modifiedPackages)
    console.log(`本次修改内容: ${JSON.stringify(modifies)}`)
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'updatePackages',
        data: { modifies }
      }
    }).then(res => {
			console.log(JSON.stringify(res))
		}).catch(err => {
			console.error(err)
		})
  },

  parsePackages2Array(modifiedPackages) {
    const modifies = []
    for (let seatKey in modifiedPackages) {
      const packages = modifiedPackages[seatKey]
      if (!packages) { continue }
      for (let durationKey in packages) {
        const pack = packages[durationKey]
        if (!pack) { continue }
        modifies.push({
          seatType: SeatTypeLocal2Remote[seatKey],
          durationType: DurationTypeLocal2Remote[durationKey],
          price: pack.price,
          giftDayCount: pack.giftDayCount
        })
      }
    }
    return modifies
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