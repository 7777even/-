// import { requestpost } from "../../utils/request";
const app = getApp();
let heartCheck = {
  timeout: 100000,
  timeoutObj: null,
  serverTimeoutObj: null,
  //清除定时器
  reset: function () {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start: function () {
    //  发送约定好的信息
    this.timeoutObj = setTimeout(() => {
      let msg = {
        text: 'ping',
        to: '-1',
        from: '-2',
        date: ''
      }
      wx.sendSocketMessage({
        data: JSON.stringify(msg)
      })
      const that = this;
      //连接WebSocket
      this.serverTimeoutObj = setTimeout(() => {
        wx.closeSocket();
      }, this.timeout);
    }, this.timeout);
  }
};
var inputVal = '';
var msgList = [];
// px转换到rpx的比例
var pxToRpxScale = 750 / wx.getSystemInfoSync().windowWidth;
//可使用窗口宽度，单位px
var windowWidth = wx.getSystemInfoSync().windowWidth * pxToRpxScale;
//可使用窗口高度，单位px
var windowHeight = wx.getSystemInfoSync().windowHeight * pxToRpxScale;
var keyHeight = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    //当键盘升起时输入拦的上升高度
    id: wx.getStorageSync('id'),
    inputBottom: 0,
    userInfo: "",
    Emoji: ['😠', '😩', '😲', '😞', '😵', '😰', '😒', '😍', '😤', '😜', '😝', '😋', '😘', '😚', '😷', '😳', '😃', '😅', '😆',
      '😁', '😂', '😊', '😄', '😢', '😭', '😨', '😣', '😡', '😌', '😖', '😔', '😱', '😪', '😏', '	😓', '😥', '😫', '😫', '🌑',
      '🌔', '🌓', '🌙', '🌕', '🌛', '🌟', '', '',
    ],
    emoji: false,
    msgList: [],
    inputVal: '',
    //输入框聚焦
    focus: false,
    add: false,
    direction: 0,
    limit: 0,
    closure: true,
    userInfo: null,
    localId: "",
    chatId: "",
    touser:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userMessage')
    })
    this.setData({
      localId: wx.getStorageSync('userMessage').uid
    })
    console.log(wx.getStorageSync('userMessage').uid);
    this.setData({
      chatId: options.id
    })
    let Url = app.globalData.URL + 'rice_disease/user/getUserMsg'
    let data = {
      uid: this.data.chatId
    }
    app.wxRequest('GET', Url, data, (res) => {
      console.log(res);
      this.setData({
        touser:res.data
      })
      wx.setNavigationBarTitle({
        title: res.data.username,
      })
      
    })




    this.connectStart()
    this.setData({
      //cusHeadIcon: app.globalData.userInfo.avatarUrl,
      // user1: JSON.parse(options.user1),
      user1: 1,
    });
    this.setData({
      msgList: wx.getStorageSync(this.data.user1.id) || [],
    })
    this.setData({
      toView: 'msg-' + (this.data.msgList.length - 1),
    })
    //界面接收对方发送的聊天信息
    const that = this;
    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容:', JSON.parse(res.data), )
      if (JSON.parse(res.data).fromUser == "root") {
        heartCheck.reset().start()
      } else {
        //将聊天信息储存到本地缓存中
        const msg = JSON.parse(res.data);
        const fromUser = JSON.parse(res.data).fromUser;
        const msgs = wx.getStorageSync(fromUser) || [];
        const msgss = msgs.concat(msg);
        wx.setStorageSync(fromUser, msgss);
        that.setData({
          msgList: that.data.msgList.concat(msg)
        })
      }
    })
  },
  /**
   * 获取聚焦
   */
  focus: function (e) {
    //获取键盘的高度用来计算输入框的漂浮高度，但后面改为了40%的页面固定高度
    keyHeight = e.detail.height * pxToRpxScale;
    this.setData({
      toView: 'msg-' + 0,
    })
    this.setData({
      inputBottom: windowHeight * 0.4 + 'rpx',
      scrollHeight: (windowHeight - windowHeight * 0.4) + 'rpx'
    });
    this.setData({
      toView: 'msg-' + (this.data.msgList.length - 1),
      focus: true,
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);
  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (this.data.msgList.length - 1)
    })
  },
  //监听输入框内容
  input(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  /**
   * 发送点击监听
   */
  sendClick: function (e) {
    this.sendSocketMessage()
    this.setData({
      inputVal: '',
      toView: 'msg-' + (this.data.msgList.length - 1),
    });
  },
  //点击展开表情包
  emoji(e) {
    //  console.log(this.data.emoji);
    console.log("2222");
    this.setData({
      focus: false,
      emoji: true,
      add: false,
      scrollHeight: (windowHeight - windowHeight * 0.4) + 'rpx',
      inputBottom: windowHeight * 0.4 + 'rpx',
    })
    this.setData({
      toView: 'msg-' + (this.data.msgList.length - 1)
    })
  },
  //点击表情包时拼接字符串
  bindemoji(e) {
    // console.log(e);
    this.setData({
      inputVal: this.data.inputVal + e.target.dataset.emoji
    })
  },
  //点击聊天底部关闭软键盘，表情包
  closure() {
    console.log("11111");
    this.setData({
      add: false,
      emoji: false,
      scrollHeight: '100vh',
      inputBottom: 0,
      focus: false
    })
  },
  //点击表情包内删除按钮
  emoji_delete() {
    let iconRule = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
    const number1 = this.data.inputVal.substring(this.data.inputVal.length - 2, this.data.inputVal.length);
    const correct = iconRule.test(number1);
    switch (correct) {
      case true:
        this.setData({
          inputVal: this.data.inputVal.substring(0, this.data.inputVal.length - 2)
        })
        break;
      default:
        this.setData({
          inputVal: this.data.inputVal.substring(0, this.data.inputVal.length - 1)
        })
        break;
    }
  },

  //点击键盘按钮
  keyboard() {
    this.setData({
      focus: true,
      emoji: false,
    })
    this.setData({
      toView: 'msg-' + (this.data.msgList.length - 1)
    })
  },
  //发送图片
  add() {
    this.data.add ? this.setData({
      add: false,
      focus: true
    }) : this.setData({
      add: true,
      focus: false,
      emoji: false,
      scrollHeight: (windowHeight - windowHeight * 0.4) + 'rpx',
      inputBottom: windowHeight * 0.4 + 'rpx',
    })
    this.setData({
      toView: 'msg-' + (this.data.msgList.length - 1)
    })
  },
  //视频播放
  bindplay() {
    this.videoContext = wx.createVideoContext('Video', this); // 	创建 video 上下文 VideoContext 对象。
    this.videoContext.requestFullScreen({});
  },
  //视频退出全屏
  bindfullscreenchange(e) {
    if (!e.detail.fullScreen) {
      this.videoContext = wx.createVideoContext('Video', this); // 	创建 video 上下文 VideoContext 对象。
      // this.videoContext.stop();
    }
  },
  onLaunch() {
    this.connectStart()
  },
  //第一步与socket建立连接
  connectStart() {
    const that = this;
    wx.connectSocket({
      url: 'wss://gdouhc.top:9034/websocket/' + this.data.localId,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        console.log("进入聊天", res)
        this.onSocketMessage()
      },
      fail: (err) => {
        wx.showToast({
          title: '网络异常!',
        })
        console.log(err)
      },
    })

  },
  //第二步在连接成功后添加心跳监测
  onSocketMessage() {
    //接收消息
    const that = this;
    wx.onSocketMessage(function (res) {
      console.log("1211");
      console.log('收到服务器内容:', JSON.parse(res.data), )
      if (JSON.parse(res.data).fromUser == "root") {
        heartCheck.reset().start()
      } else {
        //将聊天信息储存到本地缓存中
        const msg = JSON.parse(res.data);
        const from = JSON.parse(res.data).from;
        const msgs = wx.getStorageSync(from);
        const msgss = msgs.concat(msg);
        wx.setStorageSync(from, msgss);
        that.setData({
          msgList: that.data.msgList.concat(msg)
        })
      }

    })
    //  连接成功
    wx.onSocketOpen((res) => {
      console.log('WebSocket 成功连接', res)
      //心跳检测
      heartCheck.reset().start()
    })
    //连接失败
    wx.onSocketError((err) => {
      console.log('websocket连接失败', err);
      // 重新连接
      this.reconnect()
    })
    wx.onSocketClose((res) => {

      console.log('WebSocket 已关闭！')
      if (this.data.closure) {
        //重新连接
        // this.reconnect()
      } else {}
    })
  },
  reconnect() {
    console.log("重新连接");
    if (this.lockReconnect) return;
    this.lockReconnect = true;
    clearTimeout(this.timer)
    console.log(this.data.limit < 10);
    if (this.data.limit < 10) {
      this.timer = setTimeout(() => {
        this.connectStart();
        this.lockReconnect = false;
      }, 5000);
      //limit是重新连接的次数，最大为10次
      this.data.limit = this.data.limit + 1
    }
  },

  //发送消息
  sendSocketMessage() {
    let msg = {
      text: this.data.inputVal,
      // toUser: this.data.user1.id,
      to: this.data.chatId,
      from: wx.getStorageSync('userMessage').uid,
      type: "text",
      date: ""
    }
    console.log(msg);
    const that = this;
    that.setData({
      msgList: that.data.msgList.concat(msg),
    })
    console.log(this.data.msgList);
    wx.sendSocketMessage({
      data: JSON.stringify(msg), //这里根据后台的格式发送数据，好像这个需要转换成字符串，之前我的没有转换就没有效果，这个有待测试。
      success: (res) => {
        console.log("消息发送成功", res)
        console.log(res);
        // const fromUser = msg.toUser
        // const msgs = wx.getStorageSync(fromUser) || [];
        // const msgss = msgs.concat(msg)
        // wx.setStorageSync(fromUser, msgss)
      },
      fail(res) {
        console.log("消息发送失败", res)
      }
    })

  },
  //选择照片
  photo() {
    const that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image', ],
      sourceType: ['album', ],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        console.log(res);
        const type = {
          url: res.tempFiles[0].tempFilePath,
          type: '3',
          types: 'image'
        }
        that.uploadFile(type)
      }
    })
  },
  //照相
  photograph() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image', ],
      sourceType: ['camera', ],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        console.log(res.tempFiles.tempFilePath)
        console.log(res.tempFiles.size)
      }
    })
  },
  //短视频
  shortVideo(e) {
    const that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        console.log(res.tempFiles[0])
        const type = {
          url: res.tempFiles[0].tempFilePath,
          height: res.tempFiles[0].height,
          type: '5',
          types: 'video'
        }
        that.uploadFile(type)
      }
    })
  },
  //上传资源
  uploadFile(rese) {
    const that = this;
    requestuploadFile({
        url: rese.url,
        type: rese.type
      })
      .then(res => {
        // const data = res.data;
        let msg = {
          msg: JSON.parse(res.data).msg,
          type: rese.types,
          height: rese.height,
          toUser: this.data.chatId
        }
        wx.sendSocketMessage({
          data: JSON.stringify(msg), //这里根据后台的格式发送数据，好像这个需要转换成字符串，之前我的没有转换就没有效果，这个有待测试。
          success: (res) => {
            console.log("消息发送成功", res)
            that.setData({
              msgList: that.data.msgList.concat(msg),

            })
            const fromUser = msg.toUser
            const msgs = wx.getStorageSync(fromUser) || [];
            const msgss = msgs.concat(msg)
            wx.setStorageSync(fromUser, msgss)
          },
          fail(res) {
            console.log("消息发送失败", res)
          }
        })
      })
    this.setData({
      add: false,
      toView: 'msg-' + (this.data.msgList.length - 1),
      scrollHeight: '100vh',
      inputBottom: 0,
      focus: false
    })
  },

  /**
   * 退回上一页
   */
  toBackClick: function () {
    wx.navigateBack({
      data: 1
    })
  },
  onUnload() {
    wx.closeSocket();
    console.log("2222");
  },

})