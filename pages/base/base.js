
const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
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
  // 病虫害搜索
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
    this.search()
  },
  // 病毒搜索函数
  search(){
    
    let url = app.globalData.URL + 'rice_disease/disease-library/searchDisease'; 
    let data = {
      name :this.data.inputValue
    };
    app.wxRequest('GET', url, data, (res) => {
      this.setData({
        baseList:res.data
      })
      this.setData({
        active:res.data.category
      })
    }, (err) => {
      console.log(err.errMsg)
    })
  },
  onLoad: function (options) {
    if(options.inputValue){
      this.setData({
        inputValue:options.inputValue
      })
     this.search()
    }else{
      this.getBaseInfo();
    }



  },
  // 获取数据
  getBaseInfo(){
    let url = app.globalData.URL + '/rice_disease/disease-library/diseaseLibraryData'; 
    let data = {
      category :this.data.active
    };
    app.wxRequest('GET', url, data, (res) => {
      this.setData({
        baseList:res.data
      })
      console.log(res);
      console.log(this.data.baseList)
    }, (err) => {
      console.log(err.errMsg)
    })
  },
  //选择病虫害
  setAct(e){
this.setData({
  active:e.currentTarget.dataset.id
})
this.getBaseInfo()
  }
})