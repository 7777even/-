const app=getApp();
Page({
  data: {
    active:0,
    baseList:[],
    inputValue:"",
  tabList:[{
  title:'病害',
  id:0
},
{
  title:'虫害',
  id:1
}]
  },
  onLoad: function (options) {
 let url = app.globalData.URL + '/rice_disease/store-disease/storeDisease'
 app.wxREQUEST('GET', url, (res) => {
 console.log(res);
     }, 
     (err) => {
       console.log(err.errMsg)
     })
  },


  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})