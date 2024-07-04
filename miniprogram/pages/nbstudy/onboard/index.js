// pages/nbstudy/onboard/index.js

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentData: {
      avatarUrl: defaultAvatarUrl,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let data = wx.getStorageSync('studentAccountData')
    this.setData({
      studentData: data,
    })
    console.log('获取studentAccountData: ' + JSON.stringify(data))
    wx.removeStorageSync('studentAccountData')

    if (!this.data.studentData.OPENID) {
      this.setData({
        'studentData.OPENID': getApp().getOpenID(),
      })
    }
    console.log(this.data.studentData)
  },

  onChooseAvatar(e) {
    var filePath = e.detail.avatarUrl
    console.log('获取头像变化: ' + filePath)
    var clouthPath = 'studentAvatars/avatar_' + this.data.studentData.OPENID + '.png'
    console.log(clouthPath)
    wx.cloud.uploadFile({
      cloudPath: clouthPath,
      filePath: filePath
    }).then(res => {
      console.log('头像上传成功: ' + filePath)
      wx.cloud.getTempFileURL({
        fileList: [res.fileID]
      }).then(res => {
        var avatarUrl = res.fileList[0].tempFileURL + '?t=' + new Date().getTime()
        console.log('头像CloudURL: ' + avatarUrl)
        this.setData({
          'studentData.avatarUrl': avatarUrl
        })
      }).catch(e => {
        console.error('获取CloudURL失败: ' + e)
      })
    }).catch(e => {
      console.error('头像上传失败: ' + e)
    })
  },

  bindinputName(e) {
    
  },

  mobileChange(e) {
    
  },

  saveInfo() {
    console.log('save')
    this.tryUpdateStudentData()
  },

  async tryUpdateStudentData() {
    const { studentData } = this.data
    const result = await getApp().getModels().students.update({
      data: {
        avatarUrl: studentData.avatarUrl,
        studentName: "老八",
      },
      filter: {
        where: {
          OPENID: {
            $eq: studentData.OPENID
          }
        }
      }
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