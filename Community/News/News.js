const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
  this.setData({
    id:options.id
  })
   
    }




  

})