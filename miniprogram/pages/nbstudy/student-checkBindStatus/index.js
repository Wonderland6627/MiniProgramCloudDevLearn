// pages/nbstudy/student-checkBindStatus/index.js

const utils = require('../../../utils/utils.js')
const logger = require('../../../logger.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    genderArray: [
      '女生', '男生',
    ],

		phone: Number,
    readyForQuery: false,
    
    studentInfo: {},
    queryCount: 0,
    hasQuerySuccess: false,
    queryResultLabel: {
       true: "请确认是否要与此信息绑定",
       false: "未查询到此手机号待绑定信息",
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

	},

	onInputPhone(e) {
    const phone = this.phoneJudge(e.detail.value)
    this.setData({
			phone: phone,
			readyForQuery: phone.length === 11,
    })
    logger.info('输入手机号: ' + phone)
	},
	
	phoneJudge(phone) {
    return phone.toString().replace(/\D/g, '')
  },
	
 	async	queryMatchingInfo(e) {
		const { phone, queryCount } = this.data
		if (!phone || phone.length != 11) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'error',
      })
      return
    }
    wx.showLoading({
      title: '正在查询',
    })
		const result = await getApp().getModels().students.get({
			filter: {
				where: {
					phone: {
						$eq: phone
					},
					OPENID: {
						$eq: getApp().globalData.pendingOPENID,
					}
				},
			},
    })
    this.setData({
      queryCount: queryCount + 1,
    })
		const data = result?.data
		if (utils.isEmpty(data)) {
			logger.info('未查询到此手机号待绑定信息')
			wx.showToast({
				title: '无匹配信息',
				icon: 'error',
      })
      this.setData({
        hasQuerySuccess: false
      })
			return
		}
    logger.info(`待绑定信息查询成功: ${JSON.stringify(data)}`)
    wx.showToast({
      title: '查询成功',
      icon: 'success',
    })
    this.setData({
      hasQuerySuccess: true,
      studentInfo: data,
    })
  },
  
  bindPendingInfo(e) {
    wx.showLoading({
      title: '正在绑定',
    })
    const OPENID = getApp().getOpenID()
    const openidValid = OPENID !== ''
    if (!openidValid) {
      wx.showToast({
        title: '绑定有误',
        icon: 'error',
      })
      return
    }
    const { phone } = this.data
    logger.info(phone + ' ' + OPENID)
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'bindStudent',
        data: { phone, OPENID }
      }
    }).then(res => {
      logger.info('绑定学生信息保存回应: ' + JSON.stringify(res))
      if (res.result.code != 0) {
        logger.error('绑定学生信息保存失败: ' + res.result)
        wx.showToast({
          title: '绑定失败',
          icon: 'error',
        })
        return
      }
      if (res.result.result.stats.updated == 0) {
        logger.error('绑定学生信息保存重复: ' + res.result)
        wx.showToast({
          title: '重复绑定',
          icon: 'error',
        })
        return
      }
      wx.hideLoading()
      wx.showModal({
        title: '绑定成功',
        content: '现在返回重新登录',
        showCancel: false,
        complete: (res) => {
          if (res.confirm) {
            getApp().logOut('重新登录')
          }
        }
      })
    }).catch(err => {
      logger.error('绑定学生信息保存错误: ' + err)
      wx.showToast({
        title: '绑定错误',
        icon: 'error',
      })
    })
  },

  returnToLogin(e) {
    getApp().logOut('重新登录')
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