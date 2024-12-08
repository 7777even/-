const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
 userMessage:"",
 uid:"",
 chats:[],
 status:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  if(wx.getStorageSync('chats').length==0){
      wx.setStorageSync('chats', this.data.chats);
    };
// if(wx.getStorageSync('chats'))
this.setData({
  uid:options.id
})
  var Url = app.globalData.URL + 'rice_disease/user/getUserMsg'
  var data = {
    uid : this.data.uid,
  }
  app.wxRequest('GET', Url, data, (res) => {
    this.setData({
      userMessage:res.data
    })
    this.setData({
      status:this.data.userMessage.isFollow
    })
    console.log(this.data.userMessage);
wx.setNavigationBarTitle({
  title: res.data.username,
})
  })
  },
  chat(){
    let mes=wx.getStorageSync('chats')
    let Newmes=mes.concat(this.data.userMessage);
    let text=this.data.chats.concat(this.data.userMessage)
    console.log(text);
    console.log(Newmes);
    wx.setStorageSync('chats', Newmes);
    console.log(wx.getStorageSync('chats'));
    
    wx.navigateTo({
      url: `/pages/dialogue/dialogue?id=${this.data.uid}`,
    })
    var Url = app.globalData.URL + 'rice_disease/view-someone/viewSomeOne'
    var data = {
      hisUid : this.data.uid,
    }
    app.wxRequest('GET', Url, data, (res) => {
    console.log(res);
    })


   
  },
  // 关注
guanzhu(){
  var Url = app.globalData.URL + '/rice_disease/follow-user/followOthers'
  var data = {
    id : this.data.uid,
  }
  app.wxRequest('GET', Url, data, (res) => {
  if(this.data.status==0){
    this.setData({
      status:1
    })
  }
  else{
    this.setData({
      status:0
    })
  }
})
}

})