const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  onLoad: function (options) {
   console.log(options.id);
   this.gettribune()
   
  },
  gettribune(){
    let url = app.globalData.URL + 'rice_disease/post/getPosts';
    app.wxREQUEST('GET', url, (res) => {
   this.setData({
     forumlist:res.data
   })
  console.log(res);
  })
  },
  publish(){
    wx.navigateTo({
      url:"/pages/publiart/publicart"
    })
  },
  // 动态收藏
  wenda(){
    let url = app.globalData.URL + 'rice_disease/store-disease/getMyStores';
    app.wxREQUEST('GET', url, (res) => {
  //  this.setData({
  //    forumlist:res.data
  //  })
  console.log(res);
  })
},
ToUserpage(e){
  wx.navigateTo({
    url: `/pages/userpage/userpage?id=${e.currentTarget.dataset.id}`,
    // url: "/pages/userpage/userpage"
  })
},
getforumdetail(e){
  wx.navigateTo({
    url: `/pages/tribunedetail/tribunedetail?id=${e.currentTarget.dataset.id}`,
    // url: "/pages/userpage/userpage"
  })
},

like(e){
 
  let url=app.globalData.URL + 'rice_disease/post-like/likePost';
  let data = {
    postId  :e.currentTarget.dataset.id
  }
  app.wxRequest('GET', url, data, (res) => {
    console.log(res);
    this.gettribune()
  }, (err) => {
    console.log(err.errMsg)
  })



},
onShareAppMessage() {
  return {
        title: '弹出分享时显示的分享标题',
        path: '/page/user?id=123' ,// 路径，传递参数到指定页面。
　　　　  imgUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支 
                     

   }

},
})