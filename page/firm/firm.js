var id="";
var sUserKey = "";
Page({
  data: {
    shopinfo:{},
    curIndex: 0,
    disdata:{},
    prompt: {
      hidden: !0,
      icon: '',
      title: '暂无历史评价哦',
      text: '可以去其它地方逛逛',
    }
  },
  onLoad: function (options) {
    let slet = this;
    id = options.id;
    // wx.setNavigationBarTitle({ //设置标题
    //   title: title
    // });
    wx.request({
      url: getApp().data.apiUrl + '/GetShopInfo.ashx',
      data: {
        id: id,
        key: wx.getStorageSync('LoginSessionKey')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        console.log(resData);
        wx.setNavigationBarTitle({ //设置标题
          title: resData.name1
        });
        slet.setData({
          shopinfo: resData
        })
      }
    })
    wx.request({
      url: getApp().data.apiUrl + '/DiscussList.ashx',
      data: {
        sid: id
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
    let slet = this;
    sUserKey = wx.getStorageSync('LoginSessionKey');
    slet.setData({
      'prompt.hidden': 1
    })
  },
  switchOn(e) {
    wx.redirectTo({
      url: 'list?id=' + id,
    })
  },
  addFavShop(e) {//关注主办方
    if (sUserKey == '') {
      wx.navigateTo({
        url: '/page/login/index?back=1',
      })
      return;
    }
    let slet = this;
    let shopinfo = slet.data.shopinfo;
    wx.request({
      url: getApp().data.apiUrl + '/FavShopAdd.ashx',
      data: {
        key: sUserKey,
        sid: shopinfo.id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data == 1) {
          shopinfo.favor = 1;
          shopinfo.num1++;
          slet.setData({
            shopinfo: shopinfo
          })
          wx.showToast({
            title: '关注成功',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  celFavShop(e) {//取消关注主办方
    if (sUserKey == '') {
      wx.navigateTo({
        url: '/page/login/index?back=1',
      })
      return;
    }
    let slet = this;
    let shopinfo = slet.data.shopinfo;
    wx.request({
      url: getApp().data.apiUrl + '/FavShopDel.ashx',
      data: {
        key: sUserKey,
        sid: shopinfo.id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data == 1) {
          shopinfo.favor = 0;
          shopinfo.num1--;
          slet.setData({
            shopinfo: shopinfo
          })
          wx.showToast({
            title: '取消关注成功',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  bindShare(e) {//分享

  }
})