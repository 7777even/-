// pages/forumdetail/forumdetail.js
const app = getApp()
// px转换到rpx的比例
var pxToRpxScale = 750 / wx.getSystemInfoSync().windowWidth;
//可使用窗口宽度，单位px
var windowWidth = wx.getSystemInfoSync().windowWidth * pxToRpxScale;
//可使用窗口高度，单位px
var windowHeight = wx.getSystemInfoSync().windowHeight * pxToRpxScale;
var keyHeight = 0;
var  usermessage=wx.getStorageSync('userMessage')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0, //评论类别 0是专家 2是普通用户
    scrollTop: "",  // 滚动条滚动的高度
    replaybtnIs: false, // 回复按钮的状态，是否隐藏
    showCommentadd: false, //是否显示评论输入框
    showoperationPannelIndex: 0, //回复按钮 0为显示 1为隐藏
    commentContent: '', //评论内容
    QuestionId:"",//问答的ID
    message: "", //获取问答的详细内容
    tabList: [{
      name: "专家回复",
      id: 0
    }, {
      name: "用户回复",
      id: 2
    }],
    Comment:"", //用户评论内容
    commentnum:"",//评论的数量
isnull:"",//评论是否为空，空就显示空图标提示，不空就显示评论内容
show:false,//回复已有的评论向上伸出的方框
kidisnull:false,//已有的评论是否有人评论，有就不显示该空的图标，没有回复就显示
kidisnonull:false,
commentId:"",//评论的id
kidcomment:"",//子评论详情
kidcommentnum:"",//子评论的数量
searchinput:"",
keyBoardHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    var url = app.globalData.URL + 'rice_disease/question/getQuestionDetail';
    this.setData({
      QuestionId:options.questionId
    })  
    var data = {
      questionId: this.data.QuestionId,
    }

    // 进入详情页默认请求专家的评论
this.getexpercomment()
    //获取详情页的信息
    app.wxRequest('GET', url, data, (res) => {
  console.log(res.data);
      this.setData({
        message: res.data
      })
    }, (err) => {
      console.log(err.errMsg)
    })
  },
  //获取专家的评论
  getexpercomment(){
    var Url = app.globalData.URL + 'rice_disease/comment/getExpertComment'
    var data = {
      questionId: this.data.QuestionId,
    }
    app.wxRequest('GET', Url, data, (res) => {
      console.log(res.data.length);
      this.setData({
        Comment:  res.data,
        commentnum:res.data.length
      })
      if(res.data.length==0){
        this.setData({
          isnull:true,
          nonull:false
        })
      }
      else{
        this.setData({
          isnull:false,
          nonull:true
        })
      }
    }, (err) => {
      console.log(err.errMsg)
    })
  },
  //获取用户评论
  getusercomment(){
    var data = {
      questionId: this.data.QuestionId,
    }
    var Url = app.globalData.URL + 'rice_disease/comment/getUserComment'
    app.wxRequest('GET', Url, data, (res) => {
      console.log(res.data);
      this.setData({
        Comment:res.data,
        commentnum:res.data.length
      })
      if(res.data.length==0){
        this.setData({
          isnull:true,
          nonull:false
        })
      }
      else{
        this.setData({
          isnull:false,
          nonull:true
        })
      }
      console.log(this.data.isnull);
    
    }, (err) => {
      console.log(err.errMsg)
    })
  },
  // 点击评论类型
  setAct(e) {

    this.setData({
      active: e.currentTarget.dataset.id
    })

    if (this.data.active == 0) {
   this.getexpercomment()
    }
    if (this.data.active == 2) {
    
  this.getusercomment()
  
    }

  },
  //获取滚动条的高度
  onPageScroll: function (e) {
 
    this.setData({
      scrollTop: e.scrollTop
    })
    if (this.data.scrollTop > 150) {
      this.setData({
        replaybtnIs: true
      })
    }
  },

// 点击回复按钮，显示输入框
  clickComment(e) {
    console.log(2);
    this.setData({
      showoperationPannelIndex: 1,
      showCommentadd: true
    })
  },
  // 返回问答圈子首页
  returnbase() {
    wx.navigateBack({
    data:1
    })
  },
  //获取评论内容
  getinput(e) {

    this.setData({
      commentContent: e.detail.value,
    })
   

  },
  //发表评论
  sendcomment() {
 
    let url = app.globalData.URL + 'rice_disease/comment/makeComment';
   
    let data = {
      content: this.data.commentContent,
      questionId: this.data.QuestionId,
      userId: wx.getStorageSync('userMessage').uid,
      parent: 0 //0是评论这篇文章的，如果是评论评论的话，就传评论ID 
    }
    app.wxRequest('POST', url, data, (res) => {
      console.log(res);
      this.setData({
        showoperationPannelIndex: 0,
        showCommentadd: false
      })
    }, (err) => {
      console.log(err.errMsg)
    })
    var role="user";
  // let commentdata={
  //   avatarUrl:usermessage.avatarUrl,
  //   likeNum:0,
  //   username:usermessage.username,
  //   content:this.data.commentContent,
  //   createTime:Date.now()
  // }

  setTimeout(res=>{
    if(role=="user"){
      this.getusercomment()
      
    }else{
      this.getexpercomment()
    }
  }

  ,500)
  wx.showToast({
    title: '评论成功',
  })
  },
  //获取子评论的的详情
  getcommentdetail(){
    let url = app.globalData.URL + 'rice_disease/comment/getSecondComment';
    let data = {
      commentId:  this.data.commentId,
     }
     app.wxRequest('GET', url, data, (res) => {
   console.log(res);
      if(res.data.commentKidVos.length==0){
        this.setData({
         kidisnull:true,kidisnonull:false,
         kidcommentnum:res.data.commentKidVos.length
        })
      }
      else{
        this.setData({
          kidisnull:false,kidisnonull:true,
          kidcomment:res.data.commentKidVos,
          kidcommentnum:res.data.commentKidVos.length
         })
         console.log(111,this.data.kidcommentnum);
      } 
   
     

    }, (err) => {
      console.log(err.errMsg)
    })
  },
  //回复已有的评论
  kidreply(e){
    console.log(e.currentTarget.dataset.id);
    this.setData({ show: true });
   this.setData({
    commentId:e.currentTarget.dataset.id
   })
   this.getcommentdetail();
  },
  // 发表子评论
  sendcomment2(){
    console.log("1111",this.data.searchinput);
    let url = app.globalData.URL + 'rice_disease/comment/makeComment';
    let data = {
      content: this.data.commentContent,
      questionId: this.data.QuestionId,
      userId: 3,
      parent:this.data.commentId  //0是评论这篇文章的，如果是评论评论的话，就传评论ID 
    }
    console.log(data);
    app.wxRequest('POST', url, data, (res) => {
      console.log(res);
      this.getusercomment();
      
      this.setData({ 
        show: false ,
        commentContent:"",
 searchinput:"",

      });
    }, (err) => {
      // console.log(err.errMsg)
    })
    // var role="user";

   setTimeout(res=>{
 this.getcommentdetail();
 this.setData({
   kidisnull:false,

 })
   }

   ,500)
  wx.showToast({
    title: '评论成功',
  })
  },
  // 一级评论点赞
  replaylike(e){
    
let url = app.globalData.URL + 'rice_disease/comment-like/likeComment';
let data = {
  commentId : e.currentTarget.dataset.id,
}
app.wxRequest('GET', url, data, (res) => {

  this.getusercomment()

  })
},
replaylike2(e){
    
  let url = app.globalData.URL + 'rice_disease/comment-like/likeComment';
  let data = {
    commentId : e.currentTarget.dataset.id,
  }
  app.wxRequest('GET', url, data, (res) => {
  console.log(res);
    this.getcommentdetail()
  
    })
  },
  onClose() {
    this.setData({ show: false });
  },
  onSelect(event) {
    // console.log(event.detail);

  },

  //监听键盘的高度
  onShow: function() {
    wx.onKeyboardHeightChange(res => { //监听键盘高度变化
          this.keyBoardChange(res.height)
    })
    },
    keyBoardChange(height) {
     
        
        this.setData({
          keyBoardHeight:height + 'px' //将键盘的高度设置到data中，后续可以通过它来修改定位textarea的bottom，使它弹起或者收起
        })
      
      
    },

})