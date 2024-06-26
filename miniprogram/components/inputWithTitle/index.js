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
      value: '请输入'
    },
    type: {
      type: String,
      value: 'text'
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
    handleInputChange(event) {
      const value = event.detail.value;
      this.setData({value});
      this.triggerEvent('change', { value });
    },
    handleFocus(event) {
      this.triggerEvent('focus',event);
    },
    handleBlur(event) {
      this.triggerEvent('blur',event);
    }
  }
})