// pages/Aboutus/Aboutus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
yijian:false,
shangwu:false,
guanyu:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
    if(options.id==1){
      this.setData({
        yijian:true
      })
      wx.setNavigationBarTitle({
        title: '意见反馈',
      })
    }
    if(options.id==2){
     this.setData({
      shangwu:true
     })
 wx.setNavigationBarTitle({
   title: '商务合作',
 })
   }
   if(options.id==3){
     this.setData({
       guanyu:true
     })
     wx.setNavigationBarTitle({
      title: '关于我们',
    })
   }
  },

 
})