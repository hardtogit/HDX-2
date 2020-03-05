var sUserKey = "";
var starttime="";//开始时间
Page({
  data: {
    hidden: false,
    cityName: "",//当前城市
    banner: [],
    menu: [],
    curIndex: 0,
    goods: [],//最新
    goodsTj: [],//推荐
    goodsZd: [],//置顶
    activity: [],//活动列表
  },
  onLoad: function (options) {
    let slet = this;
    if (getApp().globalData.starttime!='')
    {
      console.log(getApp().globalData.starttime);
      starttime = getApp().globalData.starttime;
    }
    wx.request({
      url: getApp().data.apiUrl + '/GetImg.ashx',
      data: {
        id: 7
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        console.log('banner:', resData);
        slet.setData({
          banner: resData.data
        })
      }
    })
    wx.request({
      url: getApp().data.apiUrl + '/GetPlList.ashx',
      data: {
        title: encodeURI('全部')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        console.log('pl:', resData);
        slet.setData({
          menu: resData.data
        })
      }
    })
  },
  onShow: function () {
    let slet = this;
    slet.setData({
      cityName: getApp().globalData.cityname
    })
    sUserKey = wx.getStorageSync('LoginSessionKey');
    slet.getGoods(0); //获取商品信息
  },
  bindAddress(e) {//选择城市
    wx.navigateTo({
      url: '../activity/address',
    })
  },
  switchOn(e) {
    let slet = this;
    let index = e.currentTarget.dataset.index;
    let code = e.currentTarget.dataset.code;
    if (code=='0')
    {
      code='';
    }
    slet.setData({
      curIndex: index
    })
    wx.request({
      url: getApp().data.apiUrl + '/GetGoodsList.ashx',
      data: {
        Key: wx.getStorageSync('LoginSessionKey'),
        plcode: code,
        starttime: starttime,
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
      },
      complete: function () {
        slet.setData({
          hidden: true
        })
      }
    })
  },
  toDetail(e){
    let slet = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  },
  toSearch(e) {//搜索
    wx.navigateTo({
      url: '/page/activity/search',
    })
  },
  navigateTo(e) {//跳转
    let slet = this;
    let path = e.currentTarget.dataset.path;
    if (path != '') {
      wx.navigateTo({
        url: path
      })
    }
  },
  getGoods(id) { //获取商品信息
    let slet = this;
    wx.request({
      url: getApp().data.apiUrl + '/GetGoodsList.ashx',
      data: {
        Key: wx.getStorageSync('LoginSessionKey'),
        starttime: starttime,
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
          activity: resdata.data,
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