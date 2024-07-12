// components/customTabBar/index.js
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
    rightId: wx.getStorageSync('rightId') || 0, 
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
        pagePath: "/pages/nbstudy/profile/index",
        text: "个人",
        iconPath: "/images/icons/profile.png",
        selectedIconPath: "/images/icons/profile-active.png"
      },
    ],
    adminTabList: [
      {
        pagePath: "/pages/nbstudy/admin-edit/index",
        text: "编辑",
        iconPath: "/images/icons/admin-edit.png",
        selectedIconPath: "/images/icons/admin-edit-active.png"
      },
      {
        pagePath: "/pages/nbstudy/admin-main/index",
        text: "管理",
        iconPath: "/images/icons/admin.png",
        selectedIconPath: "/images/icons/admin-active.png"
      }
    ]
  },

  attached() {
    this.changeList()
    getApp().eventBus.on('rightChange', data => {
      if (data !== this.data.rightId) {
        this.setData({
          rightId: data
        })
        this.changeList()
      }
    })
  },

  detached() {
    getApp().eventBus.off('rightChange')
  },

  /**
   * 组件的方法列表
   */
  methods: {

    changeList() {
      this.setData({
        rightId: wx.getStorageSync('rightId') || 0
      })
      if (this.data.rightId === 0) {
        this.setData({
          list: this.data.studentTabList
        })
      } else {
        this.setData({
          list: this.data.adminTabList
        })
      }
    },

    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      console.log(url)
      wx.switchTab({url})
    }
  }
})