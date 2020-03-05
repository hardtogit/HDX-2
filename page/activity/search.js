Page({
  data: {
    cityName: "",//当前城市
    name:'',
    datals: [],
    datarm: []
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    let slet = this;
    slet.setData({
      cityName: getApp().globalData.cityname
    })
    wx.request({
      url: getApp().data.apiUrl + '/GetKeyHistoryList.ashx',
      data: {
        token: wx.getStorageSync('LoginSessionKey')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        console.log(resData);
        slet.setData({
          datals: resData.datals,
          datarm: resData.datarm,
          //'prompt.hidden': resData.goodsdata.length
        })
      }
    })
  },
  bindName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindSearch(e){//搜索
    let slet = this;
    let name = slet.data.name;
    wx.navigateTo({
      url: 'searchlist?key=' + name,
    })
  },
  bindSearchKey(e) {
    let key = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: 'searchlist?key=' + key,
    })
  }
})