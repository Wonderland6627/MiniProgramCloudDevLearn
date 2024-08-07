// components/customTabBar/index.js

const logger = require('../logger.js')

Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    selected: 0,
    color: "#808080",
    selectedColor: "#ff8533",
    list: [],
    studentTabList: [
      {
        pagePath: "/pages/nbstudy/student-main/index",
        text: "主页",
        iconPath: "/images/icons/main.png",
        selectedIconPath: "/images/icons/main-active.png"
      },
      {
        pagePath: "/pages/nbstudy/student-profile/index",
        text: "个人",
        iconPath: "/images/icons/profile.png",
        selectedIconPath: "/images/icons/profile-active.png"
      },
    ],
    adminTabList: [
      {
        pagePath: "/pages/nbstudy/admin-main/index",
        text: "管理",
        iconPath: "/images/icons/admin.png",
        selectedIconPath: "/images/icons/admin-active.png"
      },
      {
        pagePath: "/pages/nbstudy/admin-edit/index",
        text: "编辑",
        iconPath: "/images/icons/admin-edit.png",
        selectedIconPath: "/images/icons/admin-edit-active.png"
      }
    ]
  },

  attached() {
    this.changeTabBarList()
    getApp().eventBus.on('userTypeChange', () => {
      this.changeTabBarList()
    })
  },

  detached() {
    getApp().eventBus.off('userTypeChange')
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeTabBarList() {
      const isAdmin = getApp().isAdmin
      const list = isAdmin ? this.data.adminTabList : this.data.studentTabList
      logger.info(`[custom-tab-bar] 用户身份切换: ${ isAdmin ? '管理员' : '非管理员' }`)
      this.setData({
        list: list
      })
    },

    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      logger.info(`[custom-tab-bar] switch tab: ${url}`)
      wx.switchTab({url})
    }
  }
})