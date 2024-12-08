// pages/community/community.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  article:[]
  },

  onLoad: function (options) {

  },
 

luntan(){

  wx.navigateTo({
    url: '/pages/tribune/tribune',
  })

 
},
    toBase(){
    wx.navigateTo({
      url: '/pages/base/base',
    })
    },
    toforum(){
      wx.navigateTo({
        url: '/pages/FForum/forumpage',
      })
    },
    // 咨询详情内容跳转
    dumpdetail(e){
      wx.navigateTo({
        url: `/Community/News/News?id=${e.currentTarget.dataset.id}`,
      })
    }
    
})