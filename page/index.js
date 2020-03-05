var sUserKey = "";
var position_bl = true; //已授权位置
Page({
  data: {
    hidden: false,
    cityName: "",//当前城市
    menu: [],
    curIndex: 0,
    banner: [],
    shopData: [],
    goods: [],//最新
    goodsTj: [],//推荐
    goodsZd: [],//置顶
    activity:[],//活动列表
  },
  switchOn(e)
  {
    let slet = this;
    let index = e.currentTarget.dataset.index;
    let code = e.currentTarget.dataset.code;
    slet.setData({
      curIndex: index
    })
    wx.request({
      url: getApp().data.apiUrl + '/GetGoodsList.ashx',
      data: {
        Key: wx.getStorageSync('LoginSessionKey'),
        plcode:code,
        city: encodeURI(getApp().globalData.cityname)
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resdata = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        //console.log(resdata);
        slet.setData({
          activity: resdata.data
        })
      }
    })
  },
  onShareAppMessage: function() {
    // let slet = this;
    // let headid = getApp().globalData.userInfo.headid; //团长ID
    // let hid = getApp().globalData.userInfo.hid; //当前提货点ID
    // if (headid == '') {
    //   headid = hid;
    // }
    // return {
    //   title: getApp().data.sitename,
    //   desc: getApp().data.sitename,
    //   path: 'page/index?code=' + headid
    // }
  },
  onLoad(options){
    sUserKey = wx.getStorageSync('LoginSessionKey');
    let slet = this;
    wx.request({
      url: getApp().data.apiUrl + '/GetPlList.ashx',
      data: {
        title: encodeURI('精选')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        console.log('pl:',resData);
        slet.setData({
          menu: resData.data
        })
      }
    })
    wx.request({
      url: getApp().data.apiUrl + '/GetImg.ashx',
      data: {
        id:2
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        //console.log('banner:', resData);
        slet.setData({
          banner: resData.data
        })
      }
    })
    wx.request({
      url: getApp().data.apiUrl + '/GetShopList.ashx',
      data: {
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        slet.setData({
          shopData: resData.data
        })
      }
    })

    if (sUserKey != '' && getApp().globalData.userInfo.uid == 0) {
      slet.getUserInfo();//获取用户信息
    }
    else
    {
      console.log('userinfo:',getApp().globalData.userInfo);
      slet.setData({
        userInfo: getApp().globalData.userInfo
      })
    }
    // wx.request({
    //   url: getApp().data.apiUrl + '/GetImg.ashx',
    //   data: {
    //     shopcode: getApp().data.coding,
    //     idlist: '2,7'
    //   },
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function(res) {
    //     var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
    //     var imglist=[];
    //     for (var k = 0; k < resData.data.length;k++)
    //     {
    //       if (resData.data[k].tid == 7) {
    //         imglist = imglist.concat(resData.data[k]);
    //       }
    //     }
    //     //console.log('banner:',resData);
    //     slet.setData({
    //       imgData: resData.data,
    //       imgList: imglist
    //     })
    //   }
    // })
  },
  
  onShow() {
    let slet = this;
    slet.setData({
      cityName: getApp().globalData.cityname
    })
    sUserKey = wx.getStorageSync('LoginSessionKey');
    slet.getGoods(0); //获取商品信息
  },
  binRefresh()//刷新
  {
    let slet = this;
    slet.setData({
      hidden: false
    })
    wx.request({
      url: getApp().data.apiUrl + '/GetShopList.ashx',
      data: {
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        slet.setData({
          shopData: resData.data
        })
      },
      complete: function () {
        slet.setData({
          hidden: true
        })
      }
    })
  },
  scanRg() {//扫码
    wx.scanCode({
      success: (res) => {
        console.log(res.result);
      }
    })
  },
  bindAddress(e){//选择城市
    wx.navigateTo({
      url: 'activity/address',
    })
  },
  navigateTo(e) {//跳转
    let slet = this;
    let path = e.currentTarget.dataset.path;
    if (path!='')
    {
      wx.navigateTo({
        url: path
      })
    }   
  },
  switchTabTo(e) {//跳转
    let slet = this;
    let path = e.currentTarget.dataset.path;
    wx.switchTab({
      url: path,
    })
  },
  getUserInfo() {//获取用户信息
    if (sUserKey != '')//读取缓存
    {
      getApp().data.SessionKey = sUserKey;
      wx.request({
        url: getApp().data.apiUrl + '/SelUser.ashx',
        data: {
          Token: sUserKey
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
          console.log('userinfo:', resData);
          if (resData.status == 0)//授权失败
          {
            wx.showToast({
              title: '获取用户信息失败',
              icon: 'none',
              duration: 1000
            })
          }
          else if (resData.status == 1)//未审核
          {
            wx.showToast({
              title: '账号未审核',
              icon: 'none',
              duration: 1000
            })
          }
          else if (resData.status == 2)//已注册
          {
            console.log('userinfo:', resData);
            getApp().globalData.userInfo = resData;
            if (resData.hid != null && resData.hid != 0) {
              getApp().globalData.hendId = resData.hid;
            }
          }
        }
      })
    }
  },
  toDetail(e) {
    let slet = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'detail/detail?id=' + id,
    })
  },
  toSearch(e){//搜索
    wx.navigateTo({
      url: '/page/activity/search',
    })
  },
  toFirm(e)//主办方
  {
    let slet = this;
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/page/firm/firm?id=' + id + '&title=' + name,
    })
  },
  getGoods(id) { //获取商品信息
    let slet = this;
    wx.request({
      url: getApp().data.apiUrl + '/GetGoodsList.ashx',
      data: {
        Key: wx.getStorageSync('LoginSessionKey'),
        city: encodeURI(getApp().globalData.cityname)
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resdata = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        var goods = [];
        var goodsZd = [];
        var goodsTj = [];
        var goodsTgTime = [];
        for (var k = 0; k < resdata.data.length; k++) {
          if (resdata.data[k].zd == 1) {
            goodsZd = goodsZd.concat(resdata.data[k]);
          } 
          if (resdata.data[k].tj == 1) {
            goodsTj = goodsTj.concat(resdata.data[k]);
          }
        }
        console.log('置顶', goodsZd);
        console.log('推荐', goodsTj);
        console.log('全部', resdata.data);
        let hidlen = 0; //无商品
        slet.setData({
          'prompt.hidden': hidlen,
          goods: resdata.data,
          goodsTj: goodsTj,
          goodsZd: goodsZd,
        })
      },
      complete: function () {
        slet.setData({
          hidden: true
        })
      }
    })
  },
})