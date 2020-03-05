var MD5Util = require('../../util/md5.js');
Page({
  data: {
    hidden: true,
    menu: [
      { id: '0', name: '全部' },
      { id: '1', name: '待支付' },
      { id: '2', name: '待参加' },
      { id: '3', name: '待评价' },
      { id: '4', name: '已完成' }
    ],
    curIndex: 1,
    orders: [],
    goods: [],
    prompt: {
      hidden: !0,
      icon: '',
      title: '你还没有任何订单票券',
      text: '可以去看看有哪些活动感兴趣',
    }
  },
  onLoad: function (options) {
    let slet = this;
    let sKey = wx.getStorageSync('LoginSessionKey');
    let orders = slet.data.orders;
    let goods = slet.data.goods;
    if (orders.length == 0 || goods.length == 0) {
      wx.request({
        url: getApp().data.apiUrl + '/OrderList.ashx',
        data: {
          Key: sKey,
          flag: 0
        },
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
          console.log(resData);
          slet.setData({
            orders: resData.data,
            goods: resData.goods,
            'prompt.hidden': resData.data.length
          })
        },
        complete: function () {
          slet.setData({
            hidden: true
          })
        }
      })
    }
    else {
      slet.setData({
        'prompt.hidden': 1
      })
    }
  },
  onShow: function () {

  },
  switchTab(e) {
    wx.redirectTo({
      url: 'orders' + e.target.dataset.index
    })
  },
  openBillInfo(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'billinfo?id=' + id,
    })
  },
  toDetail(e) {
    let slet = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/page/detail/detail?id=' + id,
    })
  },
  bindPay(e){
    let slet = this;
    let oid = e.currentTarget.dataset.id;
    if (oid > 0) {
      slet.setData({
        hidden: false
      })
      wx.login({//登陆获取code  
        success: function (res) {
          wx.request({
            url: getApp().data.apiUrl + '/GetFormData.ashx',
            data: {
              code: res.code,
              ordid: oid
            },
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              //console.log(res.data);
              slet.getFormData(res.data);
            }
          })
        }
      });
    }
  },
  getFormData: function (formData) {
    let slet = this;
    //console.log(formData);
    var result_code = slet.getXMLNodeValue('result_code', formData);
    var resultCode = result_code.split('[')[2].split(']')[0];
    if (resultCode == 'FAIL') {
      slet.setData({
        hidden: true
      })
      wx.showToast({
        title: '调取失败',
        icon: 'none',
        duration: 1000
      })
    }
    else if (resultCode == 'SUCCESS')//成功
    {
      //发起支付  
      var prepay_id = slet.getXMLNodeValue('prepay_id', formData);
      var tmp = prepay_id.split('[');
      var tmp1 = tmp[2].split(']');
      prepay_id = tmp1[0];
      //console.log(prepay_id);
      //签名    
      var appId = 'wxa8f6ebcd50148c24';
      var timeStamp = slet.createTimeStamp();
      var nonceStr = slet.randomString();
      var key = 'QWERTYUIOPASDFGHJKL13579zxcvbnma';

      var stringSignTemp = "appId=" + appId + "&nonceStr=" + nonceStr + "&package=prepay_id=" + prepay_id + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + key;
      var sign = MD5Util.MD5(stringSignTemp).toUpperCase()
      var param = { "timeStamp": timeStamp, "package": 'prepay_id=' + prepay_id, "paySign": sign, "signType": "MD5", "nonceStr": nonceStr }
      slet.pay(param);
    }
  },
  /* 支付   */
  pay: function (param) {
    let slet = this;
    slet.setData({
      hidden: true
    })
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function (res) {
        slet.setData({
          hidden: true
        })
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function () {
          wx.redirectTo({
            url: '/page/orders/orders2',
          })
        }, 1000);
      },
      fail: function () {
        slet.setData({
          hidden: true
        })
        wx.showModal({
          title: '提示',
          content: '支付失败',
          complete() {
          }
        })
      },
      complete: function () {
        slet.setData({
          hidden: true
        })
      }
    })
  },
  /* 随机数 */
  randomString: function () {
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (var i = 0; i < 32; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },
  /* 获取prepay_id */
  getXMLNodeValue: function (node_name, xml) {
    var tmp = xml.split("<" + node_name + ">")
    var _tmp = tmp[1].split("</" + node_name + ">")
    return _tmp[0]
  },
  /* 时间戳产生函数   */
  createTimeStamp: function () {
    return parseInt(new Date().getTime() / 1000) + ''
  }
})