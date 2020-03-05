Page({
  data: {
    GoodsList: [],
    prompt: {
      hidden: !0,
      icon: '',
      title: '你还没收藏任何商品',
      text: '可以去看看有哪些感兴趣的',
    }
  },
  onLoad: function (options) {
    var that = this;
    let sKey = wx.getStorageSync('LoginSessionKey');
    let GoodsList = this.data.GoodsList;
    if (GoodsList.length == 0) {
      wx.request({
        url: getApp().data.apiUrl + '/FavList.ashx?Key=' + sKey,
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          var query_clone = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
          that.setData({
            GoodsList: query_clone.favorlist,
            'prompt.hidden': query_clone.favorlist.length
          })
        }
      })
    }
  },
  navigateTo(e) {
    const path = e.currentTarget.dataset.path
    wx.navigateTo({
      url: path
    })
  },
  ButDel(e) {
    var self = this;
    const index = e.currentTarget.dataset.index;
    let GoodsList = self.data.GoodsList;
    self.DelFavor(GoodsList[index].id);
    GoodsList.splice(index, 1);
    self.setData({
      GoodsList: GoodsList,
      'prompt.hidden': GoodsList.length
    });
  },
  DelFavor(sid)//删除信息
  {
    wx.request({
      url: getApp().data.apiUrl + '/FavDel.ashx',
      data: {
        Fid: sid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
      }
    })
  },
  toHome()//回首页
  {
    wx.switchTab({
      url: '/page/index',
    })
  },
  toCart() {//回购物车
    wx.switchTab({
      url: '/page/cart/cart',
    })
  },
})