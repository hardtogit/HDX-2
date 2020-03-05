Page({
  data: {
    hidden: false,
    shopdata: [],
  },
  onLoad: function (options) {

  },
  onShow: function () {
    let slet = this;
    wx.request({
      url: getApp().data.apiUrl + '/GetFavShopList.ashx',
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
          shopdata: resData.data,
          'prompt.hidden': resData.data.length
        })
      },
      complete: function () {
        slet.setData({
          hidden: true
        })
      }
    })
  },
  bindCancel(e){//取消关注
    let slet = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let shopdata = slet.data.shopdata;
    wx.request({
      url: getApp().data.apiUrl + '/FavShopDel.ashx',
      data: {
        key: wx.getStorageSync('LoginSessionKey'),
        sid: id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data==1)
        {
          wx.showToast({
            title: '取消成功',
            icon: 'success',
            duration: 1000
          })
          shopdata.splice(index, 1);
          slet.setData({
            shopdata: shopdata
          })
        }
      }
    })
  }
})