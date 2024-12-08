const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imglist: [],
    photo: [],
    description: "",

    feedingSituation: "",
    size: "",
    weather: "",
    stepList: [{
      name: '问题描述',
      id: 1
    }, {
      name: '上传图片',
      id: 2
    }, {
      name: '信息补充',
      id: 3
    }],

    stepNum: 0 //当前的步数



  },
  bindChange(e) {
    this.setData({
      size: e.detail.value
    })
    console.log(this.data.size);
  },
  bindChange2(e) {
    this.setData({
      weather: e.detail.value
    })
    console.log(this.data.weather);
  },
  situation(e) {
    this.setData({
      feedingSituation: e.detail.value
    })
    console.log(this.data.feedingSituation);
  },
  quesdecr(e) {
    this.setData({
      description: e.detail.value
    })
    console.log(this.data.description);
  },
  numSteps() {
    var that = this
    if (this.data.stepNum == 0) {
      if (this.data.description == "") {
        console.log(1);
      } else {
        this.setData({
          stepNum: this.data.stepNum == this.data.stepList.length ? 1 : this.data.stepNum + 1
        })
      }
    }
    if (this.data.stepNum == 1) {

      if (this.data.imglist.length == 0) {
        console.log(2);
      } else {

        for (var i = 0; i < this.data.imglist.length; i++) {
          wx.uploadFile({
            url: app.globalData.URL + 'rice_disease/question/upload', //仅为示例，非真实的接口地址
            filePath: this.data.imglist[i], //临时文件路径
            name: 'file',
            success(res) {
              let photoUrl = JSON.parse(res.data).data;
              that.data.photo.push(photoUrl)
            },
            fail: function (res) {
              console.log("addfood fail", res);
            },
          })
        }
        that.setData({
          stepNum: that.data.stepNum == that.data.stepList.length ? 1 : that.data.stepNum + 1,
        })
      }
    }
    if (this.data.stepNum == 2) {
      if (this.data.feedingSituation == "" || this.data.weather == "" || this.data.size == "") {
        console.log(222);
      } else {
        console.log("发布");
        let Url = app.globalData.URL + 'rice_disease/question/question';
        let Data = {
          description: this.data.description,
          feedingSituation: this.data.feedingSituation,
          size: this.data.size,
          photo: this.data.photo,
          weather: this.data.weather,
        };
        app.wxRequest('POST', Url, Data, (res) => {
          console.log(res);
          if (res.code == 200) {
            wx.showToast({
              title: '发布成功',
            })
            setTimeout(res => {
              wx.redirectTo({
                url: '/pages/FForum/forumpage'
              })
            }, 1000)
          }
        })
      }
    }
  },
  myimg: function () {
    var that = this;
    wx.chooseImage({
      count: 8,
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



  //长按图片进行保存



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }



})