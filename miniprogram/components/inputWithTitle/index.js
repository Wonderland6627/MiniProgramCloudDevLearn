// components/inputWithTitle/index.js
Component({

  behaviors: ['wx://form-field'],

  externelClasses: ['i-class'],

  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String
    },
    placeholder: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})