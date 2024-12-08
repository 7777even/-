// pages/message/message.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    actions: [
      {
        name: '选项',
      },
      {
        name: '选项',
      },
      {
        name: '选项',
        subname: '描述信息',
        openType: 'share',
      },
    ],
    userlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.getMessagepeople()


   
  },
    // this.getTabBar().setData({
    //   active:'message'
    // })


  onClose() {
    this.setData({ show: false });
  },
// 获取关注列表
getconnect(){
  let url = app.globalData.URL + 'rice_disease/follow-user/showFollowRecord';
  app.wxREQUEST('GET', url, (res) => {
//  this.setData({
//    forumlist:res.data
//  })
console.log(res);
  }, 
  (err) => {
    console.log(err.errMsg)
  })
},
  onSelect(event) {
    console.log(event.detail);
  },
  openlist(){
    this.setData({ show: true });
  },
  chat(e){
   
    wx.navigateTo({
      url: `/pages/dialogue/dialogue?id=${e.currentTarget.dataset.id}`,
    })
  },
  getMessagepeople(){
   
    let url = app.globalData.URL + 'rice_disease/view-someone/getViewList';
    app.wxREQUEST('GET', url, (res) => {
 
  this.setData({
    userlist:res.data
      })
  console.log(res);
    }, 
    (err) => {
      console.log(err.errMsg)
    })
  },
})