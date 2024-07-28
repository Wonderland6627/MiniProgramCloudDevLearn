// pages/nbstudy/student-checkBindStatus/index.js

const utils = require('../../../utils/utils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
		phone: Number,
		readyForMatch: false,
		queryResults: [
			{ name: "hihihi ", phone: "123456" },
			{ name: "hihihi2 ", phone: "66666" },
		],
		studentInfo: {
			name: "hihihi ", phone: "123456",
		},
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
			readyForMatch: phone.length === 11,
    })
    console.log('输入手机号: ' + phone)
	},
	
	phoneJudge(phone) {
    return phone.toString().replace(/\D/g, '')
  },
	
 	async	queryMatchingInfo(e) {
		const { phone } = this.data
		if (!phone || phone.length != 11) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'error',
      })
      return
		}
		const result = await getApp().getModels().students.get({
			filter: {
				where: {
					phone: {
						$eq: phone
					},
					OPENID: {
						$eq: `UNKNOWN`,
					}
				},
			},
		})
		const data = result?.data
		if (utils.isEmpty(data)) {
			console.log('未查询到此手机号相关信息')
			wx.showToast({
				title: '无匹配信息',
				icon: 'error',
			})
			return
		}
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