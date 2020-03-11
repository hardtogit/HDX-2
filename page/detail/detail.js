var gid = 0;
var sUserKey = "";
Page({
  data: {
    hidden: false,
    content:[],
    goodsinf: {},//商品信息
    shopinfo: {},//主办方信息
    disdata:{},//评论列表
  },
  onShareAppMessage: function () {
    let slet = this;
    let goodsinf = slet.data.goodsinf;
    return {
      title: goodsinf.title,
      desc: goodsinf.title,
      path: '/page/detail/detail?id=' + goodsinf.id,
      success: function (res) {
      }
    }
  },
  onLoad: function (options) {
    let slet = this;
    gid = options.id;
    sUserKey = wx.getStorageSync('LoginSessionKey');
    if (sUserKey=="")
    {
      wx.navigateTo({
        url: '/page/login/index?back=1',
      })
      return;
    }
    wx.request({
      url: getApp().data.apiUrl + '/GetGoodsInfo.ashx',
      data: {
        gid: gid,
        Key: wx.getStorageSync('LoginSessionKey')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        let content=[]
        try {
             content=JSON.parse(resData.goodsinfo.content)
        }catch (e) {
            content=[]
        }
        slet.setData({
          goodsinf: resData.goodsinfo,
            content:content,
          shopinfo: resData.shopinfo
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
    wx.request({
      url: getApp().data.apiUrl + '/UpdateGoodsAmount.ashx',
      data: {
        id: gid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      }
    })
    wx.request({
      url: getApp().data.apiUrl + '/DiscussList.ashx',
      data: {
        gid: gid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        try {
          var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
          console.log(res.data);
          slet.setData({
            disdata: resData.data
          })
        }
        catch (e) { }
      }
    })
  },
  openMap(e){//打开地图
    let slet = this;
    let goodsinf = slet.data.goodsinf;
    if (goodsinf.lat != "" && goodsinf.long != "")
    {
      var latitude = Number(goodsinf.lat);
      var longitude = Number(goodsinf.long);
      var title = decodeURIComponent(goodsinf.spgg);
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            name: title,
            scale: 28
          })
        }
      })
    }
    else
    {
      wx.showToast({
        title: '地址经纬度错误',
        icon: 'none',
        duration: 1000
      })
    }
  },
  toDiscuss(e)//历史评论
  {
    if (sUserKey == '') {
      wx.navigateTo({
        url: '/page/login/index?back=1',
      })
      return;
    }
    wx.navigateTo({
      url: 'discuss?id='+gid,
    })
  },
  binDis(e){//活动评论
    if (sUserKey == '') {
      wx.navigateTo({
        url: '/page/login/index?back=1',
      })
      return;
    }
    wx.navigateTo({
      url: 'putdis?id=' + gid,
    })
  },
  toInfo(e)//活动详情
  {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'info?id=' + id,
    })
  },
  toHome(e){//首页
    wx.switchTab({
      url: '/page/index',
    })
  },
  addFavor(e) {
    if (sUserKey == '') {
      wx.navigateTo({
        url: '/page/login/index?back=1',
      })
      return;
    }
    let slet = this;
    let goodsinf = slet.data.goodsinf;
    let hasFavor = goodsinf.favor;
    if (hasFavor>0) {
      wx.request({
        url: getApp().data.apiUrl + '/FavDel2.ashx',
        data: {
          Key: sUserKey,
          Gid: goodsinf.id
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data == 1) {
            goodsinf.favor=0;
            goodsinf.favNum--;
            slet.setData({
              goodsinf: goodsinf
            })
            wx.showToast({
              title: '取消成功',
              icon: 'none',
              duration: 1000
            })
          }
        }
      })
    }
    else {
      wx.request({
        url: getApp().data.apiUrl + '/FavAdd.ashx',
        data: {
          Key: sUserKey,
          GoodsId: goodsinf.id
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data == 1) {
            goodsinf.favor = 1;
            goodsinf.favNum++;
            slet.setData({
              goodsinf: goodsinf
            })
            wx.showToast({
              title: '收藏成功',
              icon: 'none',
              duration: 1000
            })
          }
        }
      })
    }
  },
  addFavShop(e){//关注主办方
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
  toFirm(e)//主办方小站
  {
    let slet = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/page/firm/firm?id=' + id,
    })
  },
  addBuy(e) {//立即报名
    let slet = this;
    let sKey = wx.getStorageSync('LoginSessionKey');
    if (sKey == '') {
      wx.navigateTo({
        url: '/page/login/index?back=1',
      })
      return;
    }
    else
    {
      let goodsinf = slet.data.goodsinf;
      if (parseInt(goodsinf.limitnum) < 1) {
        wx.showToast({
          title: '限领',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      else
      {
        wx.navigateTo({
          url: 'accounts?id=' + goodsinf.id,
        })
      }
    }
  },
})