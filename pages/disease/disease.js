// pages/disease/disease.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    diseaseInfo: {},
    store:true,
    store1:false
  },
  //收藏
  onClickButton(){
    let url = app.globalData.URL + 'rice_disease/store-disease/storeDisease';
    let data = {
      id: this.data.id
    };
    console.log(data);
    if(this.data.diseaseInfo.isStore==0){
      app.wxRequest('GET', url, data, (res) => {
        if(res.data=200){
          wx.showToast({
            title: '收藏成功',
          })
          this.getDiseaseInfo()
          console.log(222);
        }
      }, 
      (err) => {
        console.log(err.errMsg)
      })
    }else{
      app.wxRequest('GET', url, data, (res) => {
        if(res.data=200){
          wx.showToast({
            title: '已取消收藏'
          })
          this.getDiseaseInfo()
          console.log(222);
        }
      }, 
      (err) => {
        console.log(err.errMsg)
      })
    }
  


  },
  returnbase(){
    wx.navigateBack({
    data:1
    })
  },
  getDiseaseInfo() {
    let url = app.globalData.URL + 'rice_disease/disease-library/getDetailedDisease';
    let data = {
      id: this.data.id
    };
    app.wxRequest('GET', url, data, (res) => {
      console.log(res);
      this.setData({
        diseaseInfo: res.data
      })

    }, (err) => {
      console.log(err.errMsg)
    })

  },
  //返回首页
  backhome() {
    wx.switchTab({
      url: '/pages/community/community',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option){
    console.log(option);
  {
    this.setData({
      id: option.id
    })
    this.getDiseaseInfo();
    wx.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline'],
    })
  }
},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const {
      name
    } = this.data.diseaseInfo
    let category = this.data.diseaseInfo.category

    if (category === 0) {
      category = "病害"
    } else {
      category = "虫害"
    }
    return {
      title: `${category} : ${name}`,
      path: `/pages/disease/disease`
    }
  },
  //监听页面滚动
  onPageScroll: function (e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },

})