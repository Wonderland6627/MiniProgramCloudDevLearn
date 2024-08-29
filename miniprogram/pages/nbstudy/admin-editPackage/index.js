// pages/nbstudy/admin-editPackage/index.js

const utils = require('../../../utils/utils.js')
const logger = require('../../../logger.js')
const consts = require('../../../consts.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    visibleSeats: [
      consts.SeatType.VIP,
      consts.SeatType.B,
      consts.SeatType.C,
    ],
    visibleDurations: [
      consts.DurationType.Temp,
      consts.DurationType.Week,
      consts.DurationType.HalfMonth,
      consts.DurationType.Month,
      consts.DurationType.DoubleMonth,
      consts.DurationType.Season,
      consts.DurationType.halfYear,
      consts.DurationType.Year,
    ],

    seatInfosTable: [],
    durationInfosTable: [],

    selected: {
      seat: consts.SeatType.B,
      duration: consts.DurationType.Month,
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
    this.setUpPackagesUI()
    this.fetchPackages()
  },

  setUpPackagesUI() {
    this.setData({
      'seatInfosTable': utils.cloneWithJSON(consts.SeatTypeInfoMap.filter(item => {
        return this.data.visibleSeats.includes(item.type)
      })),
      'durationInfosTable': utils.cloneWithJSON(consts.DurationTypeInfoMap.filter(item => {
        return this.data.visibleDurations.includes(item.type)
      })),
    })
  },

  async fetchPackages() {
    wx.showLoading({
      title: '获取数据',
    })
    const result = await getApp().getModels().packages.list({
      filter: {
        where: {}
      },
      select: {
        seatType: true,
        durationType: true,
        price: true,
        discount: true,
        giftDayCount: true,
      },
      getCount: true,
    })
    logger.info('[admin-editPackage] 拉取所有套餐信息: ' + JSON.stringify(result))
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
      const seatKey = consts.SeatTypeRemote2Local[seatType]
      const durationKey = consts.DurationTypeRemote2Local[durationType]
      if (!packageMap[seatKey]) {
        packageMap[seatKey] = {}
      }
      packageMap[seatKey][durationKey] = {
        price: record.price,
        giftDayCount: record.giftDayCount,
      }
    })
    logger.info(packageMap) 
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
    if (currentPackages[seatKey] && currentPackages[seatKey][durationKey]) {
      return currentPackages[seatKey][durationKey]
    }
    return {
      price: 0,
      giftDayCount: 0,
    }
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
      logger.info(`[admin-editPackage] modifiedPackages[${seatType}][${durationType}]修改值重置`)
      delete modifiedPackages[seatType][durationType]
      if (utils.isEmpty(modifiedPackages[seatType])) {
        delete modifiedPackages[seatType]
      }
    }
    logger.info(modifiedPackages)
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
		const { modifiedPackages } = this.data
		const modifies = this.parsePackages2Array(modifiedPackages)
		var modifiesCount = modifies.length
		wx.showModal({
      content: `确认修改${modifiesCount}条套餐信息?`,
      complete: (res) => {
        if (res.confirm) {
          this.trySavePackagesByCloudFunc(modifies)
        }
      }
    })
  },

  trySavePackagesByCloudFunc(modifies) {
		var modifiesCount = modifies.length
		wx.showLoading({
			title: `${modifiesCount}个修改保存中`,
		})
    logger.info(`[admin-editPackage] 本次修改内容: ${JSON.stringify(modifies)}`)
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'updatePackages',
        data: { modifies }
      }
    }).then(res => {
			logger.info('[admin-editPackage] 套餐修改保存回应: ' + JSON.stringify(res))
			if (res.result.code != 0) {
				logger.info('[admin-editPackage] 套餐修改保存失败: ' + res.result)
				wx.showToast({
          title: '保存失败',
          icon: 'error',
        })
        return
			}
			const results = res.result.results
			results.forEach(result => {
				if (result.stats.updated == 1) {
					modifiesCount = modifiesCount - 1
				}
			})
			if (modifiesCount != 0) {
				wx.showToast({
					title: `${modifiesCount}个保存失败`,
					icon: 'error',
				})
				return
			}
			wx.showToast({
				title: `保存成功`,
				icon: 'success',
				duration: 2000,
				mask: true,
			})
			setTimeout(function() {
				wx.navigateBack()
			}, 2000)
		}).catch(err => {
			logger.error('[admin-editPackage] 套餐修改保存错误: ' + err)
      wx.showToast({
        title: '保存错误',
        icon: 'error',
      })
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
          seatType: consts.SeatTypeLocal2Remote[seatKey],
          durationType: consts.DurationTypeLocal2Remote[durationKey],
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