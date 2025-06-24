// pages/nbstudy/student-main/index.js

const remoteConfig = require('../../../remoteConfig.js')
const cf = require('../../../commonFunctions.js');
const logger = require('../../../logger.js');

Page({

  /**
   * 页面的初始数据
   */
  //此页尽量不要用到studentInfo
  data: {
    imageUrls: remoteConfig.config.swiperImagesList,

    storeInfo: {
      title: "欢迎来到宁博自习室！",
      location: "鞍山市鞍钢高中正门北走100米-北国知春二期S9门店",
      openingHours: "周一至周日 07:00-24:00",
    },

    toolInfos: [
      {
        title: "WIFI连接",
        icon: "../../../images/icons/wifi.svg",
        onTap: "onViewWiFiClick"
      },
    ],

    selectedTabIndex: 0,
    introduces: [
      { 
        title: "教育理念", content: 
      `宁静致远 博大精深` ,
        style: 'text-align: center;'
      },
      { 
        title: "关于我们", content: 
      `学生沉浸自习 学习氛围浓厚
      老师专职管理 教室明亮整洁
      磁卡密码门锁 安全保驾护航
      中央空调地暖 监控全屋覆盖` ,
        style: 'text-align: center;'
      },
      { 
        title: "规章制度", content: 
      `1、本自习室开放时间为7:00-24:00，预定过后，不予退钱。此卡不得转借他人使用。若有换位需求，请到前台处理。
      2、自习室内（包括走廊）不得大声喧哗，禁止立头接耳。
      3、不得抢占座位，一切以小程序预定为主。自习室预定时间结束后做到人走位空，到了结束时间东西未收拾，由管理员自行清理（放到前台），发现个人物品丢失，自习室管理人员概不负责。
      4、自习室内手机调成静音，禁止将震动的手机放在桌面上！
      5、上自习的同学应爱护公物，不得随意摆放桌椅，不得将本自习室的桌椅移至本自习室外。
      6、严禁在桌椅上粘贴桌布、乱写乱画、刻字等行为。
      7、禁止在室内吸烟，随地吐痰。
      8、禁止在教室内吃饭、吃零食、乱扔果皮、纸屑等。自习室提供就餐区，吃饭请移步就餐区，就餐结束后自行清理。点外卖的同学，请让外卖员送到前台外卖存放区，禁止外卖员上楼！
      9、走路轻缓，避免追赶、吵闹、频繁出入自习室；不得擅自将他人带人自习室。
      10、家长请在门外或前台等候，手机静音，保持安静，禁止擅自进人自习室。
      11、遵守自习室的开放时间，服从执勤人员的管理。若有违反者，座位清空，进自习室黑名单！`,
        style: 'text-align: left;'
     },
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
    setTimeout(() => {
      if (remoteConfig.config.programMode == 'private') {
        return
      }
      this.refreshSwiperImagesList()
      this.refreshToolInfosList()
    }, 3000)
  },

  refreshSwiperImagesList() {
    let list = remoteConfig.config.swiperImagesList
    logger.info(`[student-main] refresh swiper image list: ${list}`)
    this.setData({
      imageUrls: list,
    })
  },

  refreshToolInfosList() {
    var newInfos = [
      {
        title: "WIFI连接",
        icon: "../../../images/icons/wifi.svg",
        onTap: "onViewWiFiClick"
      },
      {
        title: "工具箱",
        icon: "../../../images/icons/tools.svg",
        onTap: "onToolsClick"
      },
    ]
    this.setData({
      toolInfos: newInfos,
    })
  },

  onStoreLocationCopyClick(e) {
    wx.setClipboardData({
      data: `鞍山市宁博教育咨询共享自习室`,
      success: () => {
        wx.showToast({
          title: '地址已复制',
          icon: 'none',
          duration: 1000,
        })
      }
    })
  },

  onViewWiFiClick(e) {
    cf.showWiFiModal()
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