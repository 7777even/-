const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    ZC:false,
    DL:true,
    phoneNumber:"",
    password:""
  },
  login(){
    let url = app.globalData.URL + 'rice_disease/user/login';
    let data = {
      password: this.data.password,
      username:this.data.phoneNumber,
    };
   
      app.wxRequest('POST', url, data, (res) => {
        console.log(res.code);
        console.log(res.data.token);
        console.log(res.data.user);
     if(res.code==200){
      wx.setStorageSync('token', res.data.token)
      wx.setStorageSync('userMessage', res.data.user)
          wx.showToast({
            title: '登录成功',
          })
          setTimeout(res => {
            wx.reLaunch({
              url: '/Homepage/homepage/homepage'
            })
          }, 1000)
        
      
     }else{
      wx.showToast({
        title: '登录失败，请稍后重试',
        icon:"none"
      })
     }
     
       
    
    }) 

    
  },
// 用户授权
async getUserInfo(){
  const { userInfo} = await wx.getUserProfile({
    desc: '用于生成资料'
  })
  // wx.setStorageSync('userMessage', userInfo)
  wx.login({
    success: function (res) {

      var code = res.code;
       if (code) {
        wx.request({
          url: app.globalData.URL+ 'wx/login',
          method:"post",
          data: { 
            Code: code ,
            avatarUrl:userInfo.avatarUrl,
            nickName:userInfo.nickName
         },
         success: res => {
          wx.setStorageSync('loginFlagLoad', true)
          // console.log(res);
          let userMessage=res.data.data.user
         let token=res.data.data.token
         wx.setStorageSync('token', token)
         wx.setStorageSync('userMessage', userMessage)
          // console.log(wx.getStorageSync('userMessage').uid);
         wx.showToast({
          title: '登录成功',
        })
        setTimeout(res => {
          wx.reLaunch({
            url: '/Homepage/homepage/homepage'
          })
        }, 1000)
       
         
         }
       })
  
   
     } else {
      //  console.log('获取用户登录态失败：' + res.errMsg);
      }
    }
  });

  // 用户授权获取信息
 

},
login1(){
  this.setData({
    ZC:false,DL:true
  })
},
regist1:function(){
this.setData({
  ZC:true,DL:false
})
},
//注册
regist(){
  let url = app.globalData.URL + 'rice_disease/user/register';
  let data = {
    password: this.data.password,
    username:this.data.phoneNumber,
  };
 
 
    app.wxRequest('POST', url, data, (res) => {
      if(res.code==200){
        wx.showToast({
          title: '注册成功',
        })
        this.setData({
          password:"",
          phoneNumber:"",
        })
      
      }
   
  

  })
},
password(e){
  this.setData({
    password:e.detail.value
  })
 
},
phoneNumber(e){
  this.setData({
    phoneNumber:e.detail.value
  })

},
  onLoad: function (options) {
   

  }
 

})
