const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baike: false,
    wenda: false,
    dongtai: false,
    wendalist: [],
    diseaselist: []
  },
  onLoad: function (options) {
  
    if (options.id == 1) {
      this.setData({
        dongtai: true
      })
      this.dongtai()
      wx.setNavigationBarTitle({
        title: '动态收藏',
      })
    }
    if (options.id == 2) {
      this.setData({
        baike: true
      })
      this.baike()
      wx.setNavigationBarTitle({
        title: '百科收藏',
      })
    }
    if (options.id == 3) {
      this.setData({
        wenda: true
      })
      this.wenda()
      wx.setNavigationBarTitle({
        title: '问答收藏',
      })
    }
  },
  publish() {
    wx.redirectTo({
      url: "/pages/editor/editor"
    })
  },
  // 动态收藏
  dongtai() {
    let url = app.globalData.URL + 'rice_disease/store-disease/getMyStores';
    app.wxREQUEST('GET', url, (res) => {
      //  this.setData({
      //    forumlist:res.data
      //  })
     
    })
  },
  // 百科收藏
  baike() {
   
    let url = app.globalData.URL + 'rice_disease/store-disease/getMyStores';
    app.wxREQUEST('GET', url, (res) => {
      this.setData({
        diseaselist: res.data
      })
  
    })
  },
  //问答收藏
  wenda() {
    let url = app.globalData.URL + 'rice_disease/store-question/getMyStoreList';
    app.wxREQUEST('GET', url, (res) => {
      this.setData({
        wendalist: res.data
      })
    
    })
  },

  // 问答取消收藏
  shoucang(e){
  
    let url=app.globalData.URL + 'rice_disease/store-question/storeQuestion';
    let data = {
      questionId :e.currentTarget.dataset.id
    }
 
    app.wxRequest('GET', url, data, (res) => {
      this.wenda()
   
    }, (err) => {
      console.log(err.errMsg)
    })
  
  
  
  },

  // 问答详情
  getforumdetail2(e){
    let questionId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: "/pages/forumdetail/forumdetail?questionId=" + questionId,
      })
  },

  //病虫害收藏
  todetail2(e){
 
    console.log(e);
    let id = e.currentTarget.dataset.id
  console.log(id);
    wx.navigateTo({
  
      url: "/pages/disease/disease?id=" + id,
    })
    }
})