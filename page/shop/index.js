var shopid = "";//管理中心主办方ID
Page({
  data: {
    hidden: true,
    openidbl:false,
    userInfo: {},
    shopInfo: {},//主办方统计
  },
  onLoad: function (options) {
    let slet = this;
    shopid = getApp().globalData.admin_shopid;
    //console.log(shopid);
    if (shopid == 0 || shopid == undefined) {
      wx.switchTab({
        url: '/pages/user/user',
      })
    }
    slet.setData({
      userInfo: getApp().globalData.userInfo,
    })
  },
  onShow: function () {
    let slet = this;
    wx.request({
      url: getApp().data.apiUrl + '/GetShopView.ashx',
      data: {
        id: shopid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resdata = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        console.log(resdata);
        getApp().globalData.admin_shopcode = resdata.code;
        slet.setData({
          shopInfo: resdata
        })
      },
      complete: function () {
        slet.setData({
          hidden: true
        })
      }
    })
  },
  toSearch(e) {//提货订单搜索
    wx.navigateTo({
      url: 'search',
    })
  },
  scanTh() {//扫码提货
    let slet = this;
    let shopcode = getApp().globalData.admin_shopcode;
    slet.scanCode(shopcode);
  },
  scanCode(shopcode)//扫码识别
  {
    let slet = this;
    let code = "";//识别的订单号
    wx.scanCode({
      success: (res) => {
        console.log(res);
        code = res.result;
        console.log('扫码识别:', code);
        if (code.length < 15) {
          slet.scanCode(shopcode);//识别错误，重新识别
        }
        else {
          wx.request({
            url: getApp().data.apiUrl + '/GetOrderPurview.ashx',
            data: {
              oid: code,
              shopcode: shopcode,
              flag: 1
            },
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res.data);
              if (res.data.status == 1) {
                wx.navigateTo({
                  url: 'orderinfo?id=' + res.data.id,
                })
              }
              else if (res.data.status == 3) {
                wx.showModal({
                  title: '提示',
                  content: '票券已核销:' + code,
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                    }
                  }
                })
              }
              else if (res.data.status == 4) {
                wx.showModal({
                  title: '提示',
                  content: '无权限:' + code,
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                    }
                  }
                })
              }
              else {
                wx.showModal({
                  title: '提示',
                  content: '未匹配到票券:' + code,
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                    }
                  }
                })
              }
            }
          })
        }
      },
      fail: (res) => {
        console.log(res);
        if (res.errMsg.indexOf("cancel")<0)
        {
          slet.scanCode(shopcode);
        }
      }
    })
  },
  toUrl(e) {
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
  toMore(e)//数据看板
  {
    wx.navigateTo({
      url: 'count'
    })
  },
  toUHome()//用户中心
  {
    wx.switchTab({
      url: '../user/user',
    })
  },
  binBinding() {//绑定
    let slet = this;
    let userInfo = slet.data.userInfo;
    wx.request({
      url: getApp().data.apiUrl + '/ShopManageBinding.ashx',
      data: {
        mid: getApp().globalData.adminInfo.aid,
        openid: userInfo.openId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data == 1) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 1000
          })
          getApp().globalData.adminInfo.openidbl = true;//是否绑定微信
          slet.setData({
            openidbl: true
          })
        }
      }
    })
  },
  binUntied() {//解绑
    let slet = this;
    wx.request({
      url: getApp().data.apiUrl + '/ShopManageBinding.ashx',
      data: {
        mid: getApp().globalData.adminInfo.aid,
        openid: null
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data == 1) {
          wx.showToast({
            title: '解绑成功',
            icon: 'success',
            duration: 1000
          })
          getApp().globalData.adminInfo.openidbl = false;//是否绑定微信
          slet.setData({
            openidbl: false
          })
        }
      }
    })
  },
  binOut() {//退出
    getApp().globalData.admin_shopid = 0;
    wx.switchTab({
      url: '/page/user/user',
    })
  },
})