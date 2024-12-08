// app.js


App({
  onLaunch: function () {      
    var that = this.globalData    //全局变量赋值，方便下面代码使用
         let menuButtonObjet = wx.getMenuButtonBoundingClientRect() //获取胶囊的位置
         wx.getSystemInfo({      
             success: function (res) {
                  console.log(res)//可以打印返回的值，选择自己需要的        
           let statusBarHeight = res.statusBarHeight;//设置顶部标签栏的信息        
           let navTop = menuButtonObjet.top;//胶囊按钮与顶部的距离        
           let navHeight = statusBarHeight + menuButtonObjet.height + (navTop - 			statusBarHeight) * 2 //导航栏的高度  
          //把需要的值存在全局变量中      
           that.navHeight = menuButtonObjet.height ;        
                 that.navHeight2 = navHeight         
                 that.navTop = navTop;        
                 that.statusBarHeight = statusBarHeight;        
                 that.windowHeight = res.windowHeight;//设置屏幕的高度        
                 that.screenWidth = res.screenWidth;               
           }    
        })    
      },

      reconnect(){
        console.log("重新连接");
        if (this.lockReconnect) return;
        this.lockReconnect = true;
        clearTimeout(this.timer)
        console.log(this.globalData.limit<10);
        if (this.globalData.limit<10){
          this.timer = setTimeout(() => {
            this.connectStart();
            this.lockReconnect = false;
          }, 5000);
          //limit是重新连接的次数，最大为10次
          this.globalData.limit=this.globalData.limit+1
        }
      },
    
  //设置全局请求URL
  globalData:{
    limit:0,
    closure:true,
    userInfo: null,
    URL: 'https://gdouhc.top:9034/',
    // URL: 'http://172.16.14.202:6001/'
  
  },
 
  /**
  * 封装wx.request请求
  * method： 请求方式
  * url: 请求地址
  * data： 要传递的参数
  * callback： 请求成功回调函数
  * errFun： 请求失败回调函数
  **/
   // 带参的请求,参数类型是data
  wxRequest(method, url, data, callback, reject) {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
      'Content-type':'application/json',
      'Accept': 'application/json',
      'Authorization' :"bearer " + wx.getStorageSync('token')
    },
      dataType: 'json',
      success: function (res) {
        callback(res.data);
      },
      fail: function(err){ 
        reject(err);
      },
    })
  },
  wxRequest2(method, url, data, callback, reject) {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization' :"bearer " + wx.getStorageSync('token')
    },
      dataType: 'json',
      success: function (res) {
        callback(res.data);
      },
      fail: function(err){ 
        reject(err);
      },
    })
  },
  // 不带参的请求
  wxREQUEST(method, url, callback, reject) {
    wx.request({
      url: url,
      method: method,
      header: {
      'Content-type': method == 'GET'?'application/json':'multipart/form-data',
      'Accept': 'application/json',
      'Authorization' : "bearer "+wx.getStorageSync('token')
    },
      success: function (res) {
        callback(res.data);
      },
      fail: function(err){ 
        reject(err);
      },
    })
  },
  onPullDownRefresh:function(){
    this.onRefresh();
  },
onRefresh:function(){
    //导航条加载动画
    wx.showNavigationBarLoading();
    setTimeout(function () {
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
    }, 2000);
  }

  
})
