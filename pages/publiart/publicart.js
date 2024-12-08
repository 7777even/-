const app = getApp()
Page({
  data: {
    imglist: [],
    description: "",
    photo: []
  },
  onLoad: function (options) {
  },
  myimg: function () {
    var that = this;
    if (that.data.imglist.length < 9) {
      wx.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], //可以指定来源于相机还是相册，默认都有
        success(res) {
          console.log(res);
          const tempFilePaths = res.tempFilePaths //图片的临时路径
          wx.showLoading({
            title: '上传中',
          })
          for (var i = 0; i < tempFilePaths.length; i++) {
            that.data.imglist.push(tempFilePaths[i]);
          }

          console.log(that.data.imglist);
          that.setData({
            imglist: that.data.imglist
          })
          wx.hideLoading({
            title: '加载中...',
            mask: false
          })

        }
      })
    } else {
      wx.showToast({
        title: '最多只能上传9张照片哦',
        icon: 'none',
        duration: 1500

      })

    }
  },
  //获取文本内容
  quesdecr(e) {
    this.setData({
      description: e.detail.value
    })
    console.log(this.data.description);
  },
  deleteImage: function (e) {
    var that = this
    const index = e.currentTarget.dataset.index
    const imglist = that.data.imglist
    imglist.splice(index, 1)
    that.setData({
      imglist: imglist
    })
    console.log(e)
  },
  // 点击预览效果
  handleImagePreview: function (e) {
    var that = this
    const index = e.currentTarget.dataset.index
    const imglist = that.data.imglist
    wx.previewImage({
      current: imglist[index], //当前预览的图片
      urls: imglist, //所有要预览的图片
    })
    console.log(e);
  },
  //发表动态
   public1() {
    let that = this
    // (function(){

    // })
    for (let i = 0; i < that.data.imglist.length; i++) {
      (function(){
        console.log(i);
        wx.uploadFile({
          url: app.globalData.URL + 'rice_disease/post/upload', //仅为示例，非真实的接口地址
          filePath: that.data.imglist[i], //临时文件路径
          name: 'file',
          success(res) {
            let photoUrl = JSON.parse(res.data).data;
            that.data.photo[i]=photoUrl
           
            console.log(that.data.photo);
            if(i==(that.data.imglist.length-1)){
             
                that.sendmessage()
            }

            wx.showToast({
              title: '发表成功',
              icon: "success"
            })
            setTimeout(res => {
              wx.reLaunch({
                url: '/pages/tribune/tribune'
              })
            }, 800)
           
          
          },
          fail: function (res) {
            console.log(11111111111);
            wx.showToast({
              title: '发布失败，稍后再试',
              icon: "none"
            })
            // console.log("addfood fail", res);
          }
        })
      })(i)
     
    
    }
  },
  //  发送信息
  sendmessage() {
    let Url = app.globalData.URL + '/rice_disease/post/postMessage';
    let Data = {
      content: this.data.description,
      photos: this.data.photo
    };
    app.wxRequest('POST', Url, Data, (res) => {
      console.log(res);
      console.log("222");
      //   setTimeout(res => {
      //   wx.redirectTo({
      //     url: '/pages/tribune/tribune'
      //   })
      // }, 1000)

    })
  }
})