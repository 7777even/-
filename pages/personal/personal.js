const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personalMes: "",
    userInfo: null,  
    hidden:false,
    hiddenmodalput: true,
    partid:"",
    personalMes2:"",
    show:false,
    isnull:false,
    followlist:[],
    cancle:true,
    status:true,
    personalnum:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      personalMes: wx.getStorageSync('userMessage')
    })
    let url = app.globalData.URL + 'rice_disease/user/personalInformation';
    app.wxREQUEST('GET', url, (res) => {

      console.log(res);
   this.setData({
      personalMes2: res.data
    })
  })
  },
// 跳转
tiaozhuan(e){
console.log(e.currentTarget.dataset.id);
this.setData({
  partid:e.currentTarget.dataset.id
})
wx.navigateTo({
  url: `/pages/collect/collect?id=${this.data.partid}`,
})
},
// 跳转2
tiaozhuan2(e){
  console.log(e.currentTarget.dataset.id);
  this.setData({
    partid:e.currentTarget.dataset.id
  })
  wx.navigateTo({
    url: `/pages/Aboutus/Aboutus?id=${this.data.partid}`,
  })
  },
  // 退出登录
  exit() {
    wx.showModal({
      title: "退出登录",
      content: "是否确认退出",
      success(res) {
        console.log(res);
        if (res.confirm == true) {
          wx.removeStorageSync('userMessage');
          wx.removeStorageSync('token');

          wx.showToast({
            title: '已退出',
          })
          setTimeout(res => {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }, 1000)
        }
      }

    })
  },
  modalinput: function () {
 
    this.setData({
 
      hiddenmodalput: !this.data.hiddenmodalput
 
    })
 
  },
 
  //取消按钮
 
  cancel: function () {
 
    this.setData({
 
      hiddenmodalput: true
 
    });
 
  },
 
  //确认
 
  confirm: function () {
 
    this.setData({
 
      hiddenmodalput: true
 
    })
 
  },
  onChangeShowState: function () {
 
    var that = this;
 
    that.setData({
 
      showView: (!that.data.showView)
 
    })
 
  },
  // 弹框
  powerDrawer: function (e) {
 
    var currentStatu = e.currentTarget.dataset.statu;
    console.log(currentStatu);
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200, //动画时长  
      timingFunction: "linear", //线性  
      delay: 0 //0则不延迟  
    })
    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;
 
    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();
 
    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })
 
    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })
      //关闭  
      if (currentStatu == "close") {
 
        this.setData({
          showModalStatus: false
        });
        wx.showToast({
          title: '添加成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      }
    }.bind(this), 200)
    // 显示  
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },



  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: "'稻'梦空间",
      path: '/pages/login/login',
      success: function (res) {
        console.log('成功', res)
      }
    }
  },
//  打开查看关注列表
  openlist(){
    console.log("222");
    this.setData({ show: true });
    var Url = app.globalData.URL + '/rice_disease/follow-user/showFollowRecord'
    app.wxREQUEST('GET', Url, (res) => {
      console.log(res);
      this.setData({
        personalnum:res.data.length
      })
      if(res.data.length==0){
        this.setData({
          isnull:true,
          followlist:res.data
        })
      }
      else{
        this.setData({
          followlist:res.data,
          isnull:false
        })
      }
     
  })
  },
  onClose() {
    this.setData({ show: false });
  },
  guanzhu(e){
    var Url = app.globalData.URL + 'rice_disease/follow-user/followOthers'
    let data={
      id:e.currentTarget.dataset.id
    }
    app.wxRequest('GET', Url, data, (res) => {
      console.log(res);
      if(res.code==200){
        this.setData({
          cancle:!(this.data.cancle)
        })
        console.log(this.data.cancle);
      }
    })
  }

})