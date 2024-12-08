
 import QQMapWX from '../../lib/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.min.js'
var qqmapsdk;
var app=getApp()
Page({

  data: { 
    //自定义标记点数组
    areaSelectedStr:"",
     markers:[
     ],
    //纬度
    latitude:'',
    //经度
    longitude:'',
    disease:""
  },
  getLingyuanMarkers() {
  let markers=[];
    for (let item of this.data.markers) {
      let marker = this.createMarker(item);
      markers.push(marker)
    }
    return markers;
  },

  // 获取识别记录
getrecords(){
  let url = app.globalData.URL + 'rice_disease/recognition-record/getALlRecords';
  app.wxREQUEST('GET', url, (res) => {
this.setData({
 markers:res.data
})
console.log(res.data);
this.setData({
  markers:this.getLingyuanMarkers()
 })
 
})
},
 onLoad() { 
  var that = this; 
   //  获取当前定位的经纬度信息
 wx.showLoading({
   title:"定位中",
   mask:true
 })

  qqmapsdk = new QQMapWX({
    key: '6N4BZ-AEM6X-5PW45-TGZYB-OL2GH-J3FMJ'
});
wx.getLocation({
  type: 'gcj02',
  altitude:true,//高精度定位
  //定位成功，更新定位结果
  success: function (res) {
    var latitudee = res.latitude
    var longitudee = res.longitude
    console.log(longitudee);
    console.log(latitudee);
    that.setData({
      longitude:parseFloat(longitudee),
      latitude: parseFloat(latitudee),
    })
  },
  //定位失败回调
  fail:function(){
    wx.showToast({
      title:"定位失败",
      icon:"none"
    })
  },
  complete:function(){
    //隐藏定位中信息进度
    wx.hideLoading()
  }
})
that.getrecords();
 },
 



relate(){
  console.log(this.data.disease);
  qqmapsdk.reverseGeocoder({
    location:{
      latitude:this.data.disease.latitude,
      longitude:this.data.disease.longitude,

    },
      success: (res) => {
        this.setData({
          address:res.result.address
        })
          console.log(res);
         
          
      },
      fail: function(res) {
          console.log(res);
      },
      complete: function(res) {
          console.log(res);
      }
  })
},

createMarker(point) {
  console.log(point);
  let latitude = point.latitude;
  let longitude = point.longitude;
  let marker = {
    id: Number(point.id),
    iconPath: "/image/tab/biaoji.png",
    name: point.diseaseName,
    latitude: latitude,
    longitude: longitude,
    width: 30,
    height: 30,
    illnessId:point.illness,
    avatarUrl:point.avatarUrl,

    label: {
      content: point.diseaseName,
      color: '#22ac38',
      fontSize: 13,
      bgColor: "#fff",
      borderRadius: 30,
      borderColor: "#22ac38",
      borderWidth: 1,
      padding: 3
    },

    callout: {
      content: point.name,
      fontSize: 0,
    }
  };
  console.log(marker);
  return marker;
},



 //获取当前的位置信息

 regionchange(e) {
  if(e.type == "begin" && e.causedBy == "gesture"){
    var that = this     
    if(e.type == "end" && e.causedBy == "drag"){  //！！注意！！e.causedBy=="scale"  也不能用，因为设置markers的值时，也会自动改变scale的大小，也会无限触发bindregionchange事件。
     var longitude=null;
     var latitude=null;
     this.mapCtx = wx.createMapContext('eleMap')
     this.mapCtx.getCenterLocation({ //获取拖动之后，的当前坐标点，一定要先获取该点，才能获取到该店坐标，作为参数去请求后台
       success:function(res){
           var longitude = res.longitude;
           var latitude = res.latitude
       }
     })   
    }}


},
 
 showModal: function(event) {
console.log(event);

   var i = event.detail.markerId;
  //  var id=event.target.dataset.id[i-1].id;
  this.setData({
    disease:event.target.dataset.id[i-1]
  })
  this.relate()
    
  // var url = app.url + 'Api/Api/get_shop_dp_detail&PHPSESSID=' + wx.getStorageSync('PHPSESSID');
  // var that = this;
  // console.log('====get_detail====')
  // wx.request({ 
  //   url: url,
  //   data: {
  //     id: i,
  //     openid: wx.getStorageSync('openid')
  //   },
  //   success: function(res) {
  //     console.log(res);
  //     that.setData({
  //       myall: res.data.data
  //     });
  //   }
  // });

  // 显示遮罩层
  var animation = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
  })
  this.animation = animation
  animation.translateY(300).step()
  this.setData({
    animationData: animation.export(),
    showModalStatus: true
  })
  setTimeout(function() {
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export()
    })
  }.bind(this), 200)
},
//隐藏对话框
hideModal: function() {
  // 隐藏遮罩层
  var animation = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
  })
  this.animation = animation
  animation.translateY(300).step()
  this.setData({
    animationData: animation.export(),
  })
  setTimeout(function() {
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: false
    })
  }.bind(this), 200)
},

onPullDownRefresh: function () {
  console.log("eeee");
  // 1. 重置关键数据
//   let pagenum = 'queryObj.pagenum'
//   this.setData({
//     [pagenum]:1,
//     total :0,
//     isloading : false,
//     goodsList : []
//   })

//   // 2. 重新发起请求 并关闭下拉窗口
//   this.getGoodsList(() => wx.stopPullDownRefresh())
},
toDisease(e){
wx.navigateTo({
  url: `/pages/disease/disease?id=${e.currentTarget.dataset.id}`,
})
}
})