Page({
  data: {
    hidden: false,
    disdata: {},//评论列表
  },
  onLoad: function (options) {
    let slet = this;
    wx.request({
      url: getApp().data.apiUrl + '/DiscussList.ashx',
      data: {
        gid: options.id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        slet.setData({
          disdata: resData.data
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