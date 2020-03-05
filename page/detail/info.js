var app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    hidden: false,
    goodsinf: {},//商品信息
  },
  onLoad: function (options) {
    let slet = this;
    wx.request({
      url: getApp().data.apiUrl + '/GetGoodsInfo.ashx',
      data: {
        gid: options.id,
        Key: wx.getStorageSync('LoginSessionKey')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        console.log(resData);
        try {
          WxParse.wxParse('content', 'html', resData.goodsinfo.content, slet);
        }
        catch (e) { }
        slet.setData({
          goodsinf: resData.goodsinfo
        })
      },
      complete: function () {
        slet.setData({
          hidden: true
        })
      }
    })
  },
  onShow: function () {

  },
  toUser(e)//我的
  {
    wx.switchTab({
      url: '/page/user/user',
    })
  },
  toHome(e) {//首页
    wx.switchTab({
      url: '/page/index',
    })
  }
})