// pages/FForum/forumpage.js
const app=getApp();

Page({
  /**
   * 页面的初始数据
   */
data: {
active:0,  //tab栏我的or全部状态
tabList:[{
  title:"全部",
  id:0
},
{
  title:"我的",
  id:1
}
],   //我的or全部
forumlist:"",  //帖子列表


  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
   this.getData()
   
  },
//初始化函数
getData(){
  let url = app.globalData.URL + 'rice_disease/question/getAllQuestions';
  app.wxREQUEST('GET', url, (res) => {
this.setData({
 forumlist:res.data
})
console.log(res);
  }, 
  (err) => {
    console.log(err.errMsg)
  })
},
  // 全部 or 我的
  changeapart(e){
    this.setData({
      active:e.currentTarget.dataset.id
    })
    console.log(this.data.active);
    if(this.data.active==0){
      let url = app.globalData.URL + 'rice_disease/question/getAllQuestions';
      app.wxREQUEST('GET', url, (res) => {
        this.setData({
          forumlist:res.data
        })
       
    })
  }
  else{
    let url = app.globalData.URL + 'rice_disease/question/getMyQuestion';
    app.wxREQUEST('GET', url, (res) => {
      this.setData({
        forumlist:res.data
      })  
  })
  }
      },
// 跳转到发布按钮
      publish(){
        wx.redirectTo({
    url:"/pages/publish/publish"
        })
      },
// 获取问答详情
getforumdetail(e){
  let questionId = e.currentTarget.dataset.id
  console.log(questionId);
    wx.navigateTo({
      url: "/pages/forumdetail/forumdetail?questionId=" + questionId,
    })
},
//收藏
shoucang(e){
 
  let url=app.globalData.URL + 'rice_disease/store-question/storeQuestion';
  let data = {
    questionId :e.currentTarget.dataset.id
  }

  console.log(data);
  app.wxRequest('GET', url, data, (res) => {
    this.getData()
 
  }, (err) => {
    console.log(err.errMsg)
  })



},
ToUserpage(e){
  wx.navigateTo({
    url: `/pages/userpage/userpage?id=${e.currentTarget.dataset.id}`,
    // url: "/pages/userpage/userpage"
  })
}
})