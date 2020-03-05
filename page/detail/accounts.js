var gid = 0;
var sUserKey = "";
Page({
  data: {
    hidden: false,
    goodsinf: {},//商品信息
    num:1,
    formInfo:{//表单信息
      name: '',
      tel: '',
      email: '',
      des: ''
    }
  },
  onLoad: function (options) {
    let slet = this;
    gid = options.id;
    sUserKey = wx.getStorageSync('LoginSessionKey');
    slet.setData({
      formInfo: getApp().globalData.formInfo
    })
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
        console.log(resData);
        slet.setData({
          goodsinf: resData.goodsinfo
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

  },
  minusCount(e) {//绑定减数量事件
    let slet = this;
    let num = slet.data.num;
    if (num <= 1) {
      return false;
    }
    num = parseInt(num) - 1;
    slet.setData({
      num: num
    });
  },
  addCount(e) {//绑定加数量事件
    let slet = this;
    let num = slet.data.num;
    if (num >= 999) {
      return false;
    }
    num = parseInt(num) + 1;
    let goodsinf = slet.data.goodsinf;
    if (num > parseInt(goodsinf.limitnum))
    {
      wx.showToast({
        title: '限领',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    else{
      slet.setData({
        num: num
      });
    }
  },
  bindName(e) {
    this.setData({
      'formInfo.name': e.detail.value
    })
    getApp().globalData.formInfo.name = e.detail.value;
  },
  bindTel(e) {
    this.setData({
      'formInfo.tel': e.detail.value
    })
    getApp().globalData.formInfo.tel = e.detail.value;
  },
  bindEmail(e) {
    this.setData({
      'formInfo.email': e.detail.value
    })
    getApp().globalData.formInfo.email = e.detail.value;
  },
  bindDes(e) {
    this.setData({
      'formInfo.des': e.detail.value
    })
    getApp().globalData.formInfo.des = e.detail.value;
  },
  bindNext(e){//下一步
    let slet = this;
    let num = slet.data.num;
    let formInfo = slet.data.formInfo;
    if (formInfo.name == '') {
      wx.showToast({
        title: '姓名为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    else if (formInfo.tel == '') {
      wx.showToast({
        title: '手机为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    else if (!(/^1[3456789]\d{9}$/.test(formInfo.tel))) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    else if (formInfo.email == '') {
      wx.showToast({
        title: '邮箱为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    wx.navigateTo({
      url: 'pay?id=' + gid + '&num=' + num,
    })
  },
})