Page({
  data: {
    hidden: false,
    menu: [
      { id: '1', name: '待核销订单' },
      { id: '4', name: '已完成订单' }
    ],
    curIndex: 0,
    orders: [],
    goods: [],
    prompt: {
      hidden: !0,
      icon: '',
      title: '还没有任何订单',
      text: '可以去其它地方看看',
    }
  },
  onLoad: function (options) {
    let slet = this;
    let hendData = getApp().globalData.hendData;
    //let hendId = getApp().globalData.hendId;
    let storeId = getApp().globalData.storeId;
    let storecode="";
    for (var k = 0; k < hendData.length;k++)
    {
      if (hendData[k].id == storeId)
      {
        storecode = hendData[k].code;
        break;
      }
    }
    let shopcode = getApp().data.coding;
    let orders = slet.data.orders;
    let goods = slet.data.goods;
    if (orders.length == 0 || goods.length == 0) {
      wx.request({
        url: getApp().data.apiUrl + '/GetStoreOrders.ashx',
        data: {
          shopcode: shopcode,
          flag: '1'//待配送
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var resdata = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
          console.log(resdata);
          slet.setData({
            orders: resdata.data,
            goods: resdata.goods,
            'prompt.hidden': resdata.data.length
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
      url: 'order' + e.target.dataset.id
    })
  },
  // 查看详情
  bntDetails(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'orderinfo?id=' + id,
    })
  },
  bntConfirm(e){//确认配送
    let id = e.currentTarget.dataset.id;
    let slet = this;
    wx.request({
      url: getApp().data.apiUrl + '/OrderSigning.ashx',
      data: {
        oid: id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.status == 1) {
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function () {
            wx.redirectTo({
              url: 'order3',
            })
          }, 1000)
        }
        else {
          wx.showToast({
            title: '发送失败',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
})