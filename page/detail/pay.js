var MD5Util = require('../../util/md5.js');
var gid = 0;
var sUserKey = "";
Page({
  data: {
    hidden: false,
    goodsinf: {},//商品信息
    num: 0,
    formInfo: {},
    total: 0,//总金额
    payname:'确认支付'
  },
  onLoad: function (options) {
    let slet = this;
    gid = options.id;
    //console.log(getApp().globalData.formInfo);
    slet.setData({
      num: options.num,
      formInfo: getApp().globalData.formInfo
    })
    sUserKey = wx.getStorageSync('LoginSessionKey');
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
        let total = resData.goodsinfo.price0 * options.num;
        if(total==0)
        {
          slet.setData({
            payname: '免费领取'
          })
        }
        slet.setData({
          goodsinf: resData.goodsinfo,
          total: total
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
  bindPay(e) {//确认支付
    let slet = this;
    let goodsinf = slet.data.goodsinf;
    let num = slet.data.num;//总数量
    let total = slet.data.total;//总金额
    let formInfo = slet.data.formInfo;
    var sJson1 = "{\"name\":\"" + encodeURI(formInfo.name) + "\",\"phone\":\"" + formInfo.tel + "\",\"total\":\"" + total + "\",\"meg\":\"" + encodeURI(formInfo.des) + "\"}";
    var sJson2 = "[";
    sJson2 += "{\"id\":\"" + goodsinf.id + "\",\"num\":\"" + num + "\",\"price\":\"" + goodsinf.price0 + "\"}";
    sJson2 += "]";
    slet.setData({
      hidden: false
    })
    if (total>0)
    {
      wx.request({
        url: getApp().data.apiUrl + '/OrderAdd2.ashx',
        data: {
          Key: wx.getStorageSync('LoginSessionKey'),
          Json1: sJson1,
          Json2: sJson2,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data);
          if (res.data.status == 1) {
            let oid = res.data.orderid;
            if (oid > 0) 
            {
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
            else {
              wx.showToast({
                title: '支付错误',
                icon: 'none',
                duration: 1000
              })
            }
            // setTimeout(function () {
            //   wx.redirectTo({
            //     url: '/page/orders/orders0',
            //   })
            // }, 1000)
            return;
          }
        }
      })
    }
    else//免费领取
    {
      wx.request({
        url: getApp().data.apiUrl + '/OrderAdd2.ashx',
        data: {
          Key: wx.getStorageSync('LoginSessionKey'),
          Json1: sJson1,
          Json2: sJson2,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) 
        {
          //console.log(res.data);
          if (res.data.status == 1) {
            wx.showToast({
              title: '领取成功',
              icon: 'none',
              duration: 1000
            })
            slet.setData({
              hidden: true
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '/page/orders/orders2',
              })
            }, 1000)
            return;
          }
        }
      })
    }
  },
  getFormData: function (formData) {
    let slet = this;
    //console.log(formData);
    var result_code = slet.getXMLNodeValue('result_code', formData);
    var resultCode = result_code.split('[')[2].split(']')[0];
    if (resultCode == 'FAIL') {
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
            wx.redirectTo({
              url: '/page/orders/orders1',
            })
          }
        })
      },
      complete: function () {

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