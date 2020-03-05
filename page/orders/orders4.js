Page({
  data: {
    menu: [
      { id: '0', name: '全部' },
      { id: '1', name: '待支付' },
      { id: '2', name: '待参加' },
      { id: '3', name: '待评价' },
      { id: '4', name: '已完成' }
    ],
    curIndex: 4,
    orders: [],
    goods: [],
    prompt: {
      hidden: !0,
      icon: '',
      title: '你还没有任何订单票券',
      text: '可以去看看有哪些活动感兴趣',
    }
  },
  onLoad: function (options) {
    let slet = this;
    let sKey = wx.getStorageSync('LoginSessionKey');
    let orders = slet.data.orders;
    let goods = slet.data.goods;
    if (orders.length == 0 || goods.length == 0) {
      wx.request({
        url: getApp().data.apiUrl + '/OrderList.ashx',
        data: {
          Key: sKey,
          flag: 3
        },
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
          console.log(resData);
          slet.setData({
            orders: resData.data,
            goods: resData.goods,
            'prompt.hidden': resData.data.length
          })
        },
        complete: function () {
          slet.setData({
            hidden: true
          })
        }
      })
    }
    else {
      slet.setData({
        'prompt.hidden': 1
      })
    }
  },
  onShow: function () {

  },
  switchTab(e) {
    wx.redirectTo({
      url: 'orders' + e.target.dataset.index
    })
  },
  openBillInfo(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'billinfo?id=' + id,
    })
  },
  toDetail(e) {
    let slet = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/page/detail/detail?id=' + id,
    })
  },
})