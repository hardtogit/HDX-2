var sUserKey = "";
Page({
  data: {
    hidden: false,
    hendData: {},
    sortData:[],
    goods:[],
    goods2: [],
    prompt: {
      hidden: !0,
      icon: '',
      title: '商品为空',
      text: '可以去其它栏目逛逛',
    }
  },
  onLoad: function (options) {
    sUserKey = wx.getStorageSync('LoginSessionKey');
    let slet = this;
    slet.getGoodsList("", 1, "", "");
    wx.request({
      url: getApp().data.apiUrl + '/SortList.ashx',
      data: {
        shopcode: getApp().data.coding
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resdata = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        console.log('sort:',resdata);
        slet.setData({
          sortData: resdata.data
        })
      }
    })
  },
  onShow() {
    sUserKey = wx.getStorageSync('LoginSessionKey');
    let slet = this;
    if (getApp().globalData.snaptypeid != 0)
    {
      slet.getGoodsList(getApp().globalData.snaptypeid, "", "", "");
    }
    if (getApp().globalData.coordinate.longitude == "" || getApp().globalData.coordinate.latitude == "") 
    {
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.userLocation']) {
            wx.showModal({
              content: '检测到您没打开定位权限，是否去设置打开？',
              confirmText: "确认",
              cancelText: "取消",
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({//二次获取授权
                    success: (res) => {
                      slet.getLocation();//获取位置信息
                    }
                  })
                }
                else { }
              }
            });
          }
        }
      })
      return;
    }
    else
    {
      if (getApp().globalData.hendData.length == undefined) {
        slet.getHeadList();//获取提货点列表
      }
      else {
        var dest = getApp().globalData.hendData;
        var hendId = getApp().globalData.hendId;
        if (hendId == 0) {
          getApp().globalData.hendId = dest[0].id;
          slet.setData({
            hendData: dest[0]
          })
        }
        else {
          for (var k = 0; k < dest.length; k++) {
            if (dest[k].id == hendId) {
              slet.setData({
                hendData: dest[k]
              })
              break;
            }
          }
        }
      }
    }
  },
  getHeadList()//获取门店信息
  {
    let slet = this;
    wx.request({
      url: getApp().data.apiUrl + '/GetHeadList.ashx',
      data: {
        shopcode: getApp().data.coding,
        longitude: getApp().globalData.coordinate.longitude,
        latitude: getApp().globalData.coordinate.latitude
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resdata = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        //console.log(resdata.data);
        if (resdata.data.length == 0) {
          return;
        }
        let dest = resdata.data;
        dest.sort(function (a, b) {//排序
          var value1 = a.distance,
            value2 = b.distance;
          return value1 - value2;
        });
        getApp().globalData.hendData = dest;
        var hendId = getApp().globalData.hendId;
        if (hendId == 0) {
          getApp().globalData.hendId = dest[0].id;
          slet.setData({
            hendData: dest[0]
          })
        }
        else {
          for (var k = 0; k < dest.length; k++) {
            if (dest[k].id == hendId) {
              slet.setData({
                hendData: dest[k]
              })
              break;
            }
          }
        }
      }
    })
  },
  formHead: function (e) {
    if (e.detail.formId.indexOf("formId") == -1 && sUserKey != '') {
      wx.request({
        url: getApp().data.apiUrl + '/AddCode.ashx',
        data: {
          Key: sUserKey,
          formid: e.detail.formId
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        }
      })
    }
    wx.navigateTo({
      url: 'search',
    })
  },
  formSearch: function (e) {
    if (e.detail.formId.indexOf("formId") == -1 && sUserKey != '') {
      wx.request({
        url: getApp().data.apiUrl + '/AddCode.ashx',
        data: {
          Key: sUserKey,
          formid: e.detail.formId
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        }
      })
    }
    wx.navigateTo({
      url: 'search',
    })
  },
  // toSearch() {
  //   wx.navigateTo({
  //     url: '../list/search',
  //   })
  // },
  addToCart(e) {
    if (sUserKey == '') {
      wx.navigateTo({
        url: '/page/login/index?back=1',
      })
      return;
    }
    let slet = this;
    let id = e.currentTarget.dataset.id;
    let goods = slet.data.goods;
    let goodsinfo = {};
    for (var k = 0; k < goods.length; k++) {
      if (goods[k].id == id) {
        goodsinfo = goods[k];
        break;
      }
    }
    if (goodsinfo.zd == 1) {
      wx.showToast({
        title: '限制加入',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (parseInt(goodsinfo.stock2) < 1) {
      wx.showToast({
        title: '限购',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    wx.request({
      url: getApp().data.apiUrl + '/CartAdd2.ashx',
      data: {
        Key: sUserKey,
        GoodsId: id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data == 1) {
          wx.showToast({
            title: '加入成功',
            icon: 'success',
            duration: 1000
          })
        }
        else if (res.data == 2) {
          wx.showToast({
            title: '已加入',
            icon: 'success',
            duration: 1000
          })
        }
        else {
          wx.showToast({
            title: '加入失败',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  },
  formSubmit: function (e) {
    let id = e.detail.target.dataset.id;
    if (e.detail.formId.indexOf("formId") == -1 && sUserKey != '') {
      wx.request({
        url: getApp().data.apiUrl + '/AddCode.ashx',
        data: {
          Key: sUserKey,
          formid: e.detail.formId
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        }
      })
    }
    wx.navigateTo({
      url: '../details/details?id=' + id
    })
  },
  selSort(e)
  {
    let slet = this;
    let code = e.currentTarget.dataset.id;
    console.log('plcode:', code);
    let index = e.currentTarget.dataset.index;
    let sortData = slet.data.sortData;
    for (var i = 0; i < sortData.length;i++)
    {
      if (sortData[i].id == code)
      {
        sortData[i].on = '1';
      }
      else
      {
        sortData[i].on = '0';
      }
    }
    slet.setData({
      hidden: false,
      sortData: sortData
    })
    if (code=='tj')
    {
      slet.getGoodsList("", 1, "", "");
    }
    else if (code=='all')
    {
      slet.getGoodsList("", "", "", "");
    }
    else
    {
      slet.getGoodsList(code, "", "","");
    }
  },
  getGoodsList(plcode,tj,zd,tg)
  {
    let slet = this;
    wx.request({
      url: getApp().data.apiUrl + '/GetGoodsList.ashx',
      data: {
        shopcode: getApp().data.coding,
        Key: wx.getStorageSync('LoginSessionKey'),
        plcode: plcode,
        tj: tj,
        zd: zd,
        tg: tg
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resdata = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        console.log(resdata);
        slet.setData({
          goods: resdata.data,
          'prompt.hidden': resdata.data.length
        })
      },
      complete: function () {
        slet.setData({
          hidden: true
        })
      }
    })
  },
  toDetails(e)
  {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../details/details?id=' + id,
    })
  },
  getLocation()//获取位置信息
  {
    let slet = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        //console.log(longitude);
        //console.log(latitude);
        getApp().globalData.coordinate.longitude = longitude;
        getApp().globalData.coordinate.latitude = latitude;
        slet.getHeadList();//获取提货点列表
      },
      fail(res) {
        slet.setData({
          hidden: true
        })
      }
    })
  }
})