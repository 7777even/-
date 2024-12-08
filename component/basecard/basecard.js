// component/basecard/basecard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    baseData:Object
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
todetail(){
wx.redirectTo({
  url: `/pages/disease/disease?id=${this.data.baseData.id}`,
})
}
  }
})
