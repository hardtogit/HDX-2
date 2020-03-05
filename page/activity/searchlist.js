var starttime = "";//开始时间
Page({
  data: {
    cityName: "",//当前城市
    name: '',
    curIndex: 0,
    goodsdata:[],
    shopdata:[],
    prompt: {
      hidden: !0,
      icon: '',
      title: '你还没有任何活动',
      text: '可以搜索其它关键词看看',
    }
  },
  onLoad: function (options) {
    let slet = this;
    slet.setData({
      'prompt.hidden':0
    })
    let key="";
    starttime="";
    if (options.starttime != undefined) {
      //console.log(options.starttime);
      starttime = options.starttime;
    }
    if (options.key != undefined) {
      key = options.key;
    }
    if (key != "" || starttime!="")
    {
      slet.setData({
        name: key
      })
      wx.request({
        url: getApp().data.apiUrl + '/SearchKey.ashx',
        data: {
          token: wx.getStorageSync('LoginSessionKey'),
          key: encodeURI(key),
          starttime: starttime,
          city: encodeURI(getApp().globalData.cityname)
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
          console.log(resData);
          slet.setData({
            goodsdata: resData.goodsdata,
            shopdata: resData.shopdata,
            'prompt.hidden': resData.goodsdata.length
          })
        }
      })
    }
  },
  onShow: function () {
    let slet = this;
    slet.setData({
      cityName: getApp().globalData.cityname
    })
  },
  bindAddress(e) {//选择城市
    wx.navigateTo({
      url: '/page/activity/address',
    })
  },
  switchOn(e) {
    let slet = this;
    let index = e.currentTarget.dataset.index;
    slet.setData({
      curIndex: index
    })
  },
  bindName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindSearch(e) {//搜索
    let slet = this;
    let name = slet.data.name;
    //console.log(name);
    wx.request({
      url: getApp().data.apiUrl + '/SearchKey.ashx',
      data: {
        token: wx.getStorageSync('LoginSessionKey'),
        key: encodeURI(name),
        starttime: starttime,
        city: encodeURI(getApp().globalData.cityname)
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        console.log(resData);
        slet.setData({
          goodsdata: resData.goodsdata,
          shopdata: resData.shopdata,
          'prompt.hidden': resData.goodsdata.length
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
  toFirm(e)//主办方
  {
    let slet = this;
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/page/firm/firm?id=' + id + '&title=' + name,
    })
  },
})