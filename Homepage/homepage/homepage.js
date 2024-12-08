const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: "",
    imglist: [],
    longitude: "",
    latitude: "",
    imgurl: ""
  },


  onLoad: function (options) {
  const _this=this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.camera']) {
          // 用户已经授权
          _this.setData({
            isAuth: true
          })
        } else {
          // 用户还没有授权，向用户发起授权请求
          wx.authorize({
            scope: 'scope.camera',
            success() { // 用户同意授权
              _this.setData({
                isAuth: true
              })
            },
            fail() { // 用户不同意授权
              _this.openSetting().then(res => {
                _this.setData({
                  isAuth: true
                })
              })
            }
          })
        }
      },
      fail: res => {
        console.log('获取用户授权信息失败')
      }
    })
  },
  // 打开授权设置界面
  openSetting() {
    const _this = this

    let promise = new Promise((resolve, reject) => {
      wx.showModal({
        title: '授权',
        content: '请先授权获取摄像头权限',
        success(res) {
          if (res.confirm) {
            wx.openSetting({
              success(res) {
                if (res.authSetting['scope.camera']) { // 用户打开了授权开关
                  resolve(true)
                } else { // 用户没有打开授权开关， 继续打开设置页面
                  _this.openSetting().then(res => {
                    resolve(true)
                  })
                }
              },
              fail(res) {
                console.log(res)
              }
            })
          } else if (res.cancel) {
            _this.openSetting().then(res => {
              resolve(true)
            })
          }
        }
      })
    })
    return promise;


  },
  // 发送参数
  sendparams() {
    let that = this
    that.connect();
    wx.getLocation({
      type: "wgs84",
      success(res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
        console.log(that.data.longitude)
        let url = app.globalData.URL + '/deep/analysePhoto';
        console.log(that.data.imgurl);
        let data = {
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          url: that.data.imgurl
        }
        app.wxRequest2('POST', url, data, (res) => {
          console.log(res);
          //  if(res.code==200){
          //    that.connect()
          //  }
        })
      },


    })
  },
  // 拍照识别
  showCamera() {
    var  _that=this;
    this.connect();
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'], //可以指定来源于相机还是相册，默认都有
      success(res) {
        console.log(res);
        const tempFilePaths = res.tempFilePaths //图片的临时路径
        console.log(tempFilePaths);


        wx.uploadFile({
          url: app.globalData.URL + '/deep/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0], //临时文件路径
          name: 'file',
          success(res) {
            // let photoUrl = JSON.parse(res.data).data;
            // that.data.photo.push(photoUrl)
            console.log(res);
            _that.setData({
              imgurl: JSON.parse(res.data).data
            })

            _that.sendparams()
            wx.hideLoading({
              title: '识别中...',
              mask: false
            })
          },
          fail: function (res) {
            console.log("addfood fail", res);
          },
        })

    

      }
    })
  },
  // 病虫害搜索
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
    //保留当前页面，跳转到应用内的某个页面
    wx.navigateTo({
      url: `/pages/base/base?inputValue=${this.data.inputValue}`,
    })


  },
  onHide: function () {
    wx.closeSocket();
  },
  initEventHandle() {
    const _this = this
    wx.onSocketOpen(function (res) { //监听 WebSocket 连接打开事件  
      console.log('连接打开')
    })
    wx.onSocketMessage(function (res) { //监听 WebSocket 接受到服务器的消息事件
      console.log(res);
      _this.reset().start();
      if (JSON.parse(res.data).type == "success") {
        wx.navigateTo({
          url: `/pages/disease/disease?id=${JSON.parse(res.data).id}`,
        })
      } else {
        console.log("失败");


      }
    })
    wx.onSocketError(function (res) { //监听 WebSocket 错误事件
      console.log('WebSocket连接打开失败，请检查！');
      console.log(res.code)
      wx.showToast({
        title: '网络有点问题，请稍后',
        duration: 2000,
        icon:"loading"
      })
      _this.reconnect()
    })
    wx.onSocketClose(function (res) {
      console.log(res)
      console.log('WebSocket 已关闭！' + res.code)
      // _this.reconnect()
    })
  },
  // 断线重连
  reconnect() {
    // console.log(22255);
    // if (this.lockReconnect) return;
    // this.lockReconnect = true;
    // clearTimeout(this.timer)
    // if (this.data.limit < 12) {
    //   this.timer = setTimeout(() => {
    //     this.linkSocket();
    //     this.lockReconnect = false;
    //   }, 5000);
    //   this.setData({
    //     limit: this.data.limit + 1
    //   })
    // }
    this.connect()
  },
  reset() {
    clearTimeout(this.data.timeoutObj);
    return this;
  },
  start() {
    this.data.timeoutObj = setTimeout(() => {
      console.log("发送heart");
      wx.sendSocketMessage({
        data: "heart",
        success() {
          console.log("发送heart成功");
        }
      });
    }, this.data.timeout);
  },
  //连接 
  connect() {
    let user=wx.getStorageSync('userMessage')
    let url = 'wss://gdouhc.top:9034/websocket/'+user.uid
    const _this = this;
    wx.connectSocket({
      url: url,
      success() {
        console.log('连接成功')
        _this.initEventHandle() //websocket绑定的各种事件
      }
    })
  },
})