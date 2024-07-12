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
    selected: 0,
    color: "#808080",
    selectedColor: "#ff8533",
    list: [
      {
        pagePath: "pages/nbstudy/student-main/index",
        text: "主页",
        iconPath: "images/icons/main.png",
        selectedIconPath: "images/icons/main-active.png"
      },
      {
        pagePath: "pages/nbstudy/admin-main/index",
        text: "个人信息",
        iconPath: "images/icons/profile.png",
        selectedIconPath: "images/icons/profile-active.png"
      }
    ]
  },

  attached() {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})