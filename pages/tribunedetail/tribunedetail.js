const app=getApp()
Page({
  data: {
    keyBoardHeight:0,
    postdetail:"",
    cancle:"",
    guanzhu:"",
    send:"",postId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

this.setData({
  postId:options.id
})
this.getMessage()
  },
  getMessage(){
    let url = app.globalData.URL + '/rice_disease/post/getDetailedPost';
let data={
postId:this.data.postId
}
    app.wxRequest('GET', url, data, (res) => {
      this.setData({
        postdetail:res.data
      })
      if(this.data.postdetail.isFollow==1){
       this.setData({
         cancle:true,
         guanzhu:false
       })
      }
      else{
        this.setData({
          cancle:false,
          guanzhu: true
        })
      }
      
    console.log(res);
    })
  },
  onShow: function() {
    wx.onKeyboardHeightChange(res => { //监听键盘高度变化
          this.keyBoardChange(res.height)
    })
    },
    keyBoardChange(height) {
     
        
        this.setData({
          keyBoardHeight:height+20 //将键盘的高度设置到data中，后续可以通过它来修改定位textarea的bottom，使它弹起或者收起
        })
      
      
    },
//  关注用户
guanzhu(){
  var Url = app.globalData.URL + '/rice_disease/follow-user/followOthers'
  var data = {
    id : this.data.postdetail.userId,
  }
  app.wxRequest('GET', Url, data, (res) => {
 console.log(!(this.data.cancle));
    this.setData({
      cancle:!(this.data.cancle),
      guanzhu:!(this.data.guanzhu)
    })
  })

},
foucus(){
this.setData({
  send:true
})
},
// 输入框的值
inputvalue(e){
  
  this.setData({
    commentContent:e.detail.value
  })
},
// blur(){
//   this.setData({
//     send:false
//   }) 
// },
sendcomment() {
  let url = app.globalData.URL + 'rice_disease/post-comment/makeComment';
  let data = {
    content: this.data.commentContent,
    postId: this.data.postId,
    // userId: wx.getStorageSync('userMessage').uid,
    parent: 0 //0是评论这篇文章的，如果是评论评论的话，就传评论ID 
  }
  app.wxRequest('POST', url, data, (res) => {
    console.log(res);
    this.setData({
     searchinput: "",
      send:false
    })
    this.getMessage()
  }, (err) => {
    console.log(err.errMsg)
  })
wx.showToast({
  title: '评论成功',
})
},
like(e){
 
  let url=app.globalData.URL + 'rice_disease/post-comment-like/likePost';
  let data = {
    commentId  :e.currentTarget.dataset.id
  }
  app.wxRequest('GET', url, data, (res) => {
    console.log(res);
    this.getMessage()
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