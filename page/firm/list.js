var id = "";
Page({
  data: {
    activity:[],//活动列表
  },
  onLoad: function (options) {
    let slet = this;
    id = options.id;
    wx.request({
      url: getApp().data.apiUrl + '/GetShopInfo.ashx',
      data: {
        id: id,
        Key: wx.getStorageSync('LoginSessionKey')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        wx.setNavigationBarTitle({ //设置标题
          title: resData.name1
        });
        slet.getActivity(resData.code);//获取活动列表
        slet.setData({
          shopinfo: resData
        })
      }
    })
    
  },
  onShow: function () {
    
  },
  switchOn(e) {
    wx.redirectTo({
      url: 'firm?id=' + id,
    })
  },
  toDetail(e) {
    let slet = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/page/detail/detail?id=' + id,
    })
  },
  getActivity(code)//获取活动列表
  {
    let slet = this;
    wx.request({
      url: getApp().data.apiUrl + '/GetGoodsList.ashx',
      data: {
        shopcode: code,
        Key: wx.getStorageSync('LoginSessionKey')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        console.log(resData);
        slet.setData({
          activity: resData.data
        })
      },
      complete: function () {
        slet.setData({
          hidden: true
        })
      }
    })
  }
})