var sUserKey = "";
Page({
  data: {
    hidden: false,
    favData: [],//收藏列表
  },
  onLoad: function (options) {

  },
  onShow: function () {
    sUserKey = wx.getStorageSync('LoginSessionKey');
    let slet = this;
    wx.request({
      url: getApp().data.apiUrl + '/FavList.ashx',
      data: {
        key:sUserKey
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        console.log('fav:', resData);
        slet.setData({
          favData: resData.data
        })
      },
      complete: function () {
        slet.setData({
          hidden: true
        })
      }
    })
  },
  toDetail(e) {
    let slet = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/page/detail/detail?id=' + id,
    })
  },
  bindCancel(e) {//取消关注
    let slet = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let favData = slet.data.favData;
    wx.request({
      url: getApp().data.apiUrl + '/FavDel.ashx',
      data: {
        Fid: id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data == 1) {
          wx.showToast({
            title: '取消成功',
            icon: 'success',
            duration: 1000
          })
          favData.splice(index, 1);
          slet.setData({
            favData: favData
          })
        }
      }
    })
  }
})