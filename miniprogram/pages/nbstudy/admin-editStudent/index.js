// pages/nbstudy/admin-editStudent/index.js

const timeUtils = require('../../../utils/timeUtils.js')
const logger = require('../../../logger.js')
const EditIconPath = '../../../images/icons/admin-edit-active.png'

Page({

  /**
   * 页面的初始数据
   */
  data: {
		genderIndex: -1,
    genderArray: [
      '女生', '男生',
		],
		age: -1,
    studentInfo: {
			avatarUrl: getApp().globalData.defaultAvatarUrl,
		},

		editIconPath: EditIconPath,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
		let info = wx.getStorageSync('selectedStudentInfo')
		logger.info('学生信息: ' + JSON.stringify(info))
		this.onReceiveStudentInfo(info)
    wx.removeStorageSync('selectedStudentInfo')
	},
	
	onReceiveStudentInfo(studentInfo) {
		if (studentInfo.gender) {
      this.setData({
        genderIndex: studentInfo.gender
			})
		}
		if (studentInfo.birthday) {
			const age = timeUtils.calculateAgeFromTimeStamp(studentInfo.birthday)
			this.setData({
        age: age
			})
		}
		this.setData({
			studentInfo: studentInfo
		})
		this.showModalWithInput()
	},

	showModalWithInput: function () {
    wx.showModal({
      title: '输入框弹窗',
			editable: true,
			placeholderText: '123',
      showCancel: true,
      confirmText: '确定',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          logger.info('[admin-editStudent] 用户点击确定');
          logger.info('[admin-editStudent] 输入的内容为：', res.content);
        } else if (res.cancel) {
          logger.info('[admin-editStudent] 用户点击取消');
        }
      }.bind(this)
    });
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