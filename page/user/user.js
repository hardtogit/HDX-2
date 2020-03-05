var wxbarcode = require('../../util/index.js');
var util = require('../../util/util.js');
var MD5Util = require('../../util/md5.js');
var interval;
Page({
  data:{
    bl1:false,
    thumb:'',
    nickname:'',
    name: '',//登陆用户名
    pwd: '',//登陆密码
    orders:[],
    ordnumdata: {
      num1: 0,
      num2: 0,
      num3: 0,
      num4: 0,
      num5: 0
    },
    hasAddress:false,
    bl1: false,//提货码
    bl2: false,//管理登陆
    address:{},
    userInfo: {},
    currentTime: 300,//倒计时5分钟
    items: [
      {
        icon: '/image/ico_13_1.png',
        text: '我的名片',
        path: 'info',
      },
      {
        icon: '/image/ico_13_2.png',
        text: '关注的主办方',
        path: '../organizer/list'
      },
      {
        icon: '/image/ico_4_2.png',
        text: '我的收藏',
        path: '../keep/list',
      },
      {
        icon: '/image/ico_13_4.png',
        text: '小程序常见问题',
        path: 'ask',
      }
    ]
  },
  onUnload: function (options) {
    clearInterval(interval);
  },
  onHide() {
    clearInterval(interval);
  },
  onLoad(){
    let slet = this;
    console.log(getApp().globalData.userInfo);
    slet.setData({
      userInfo: getApp().globalData.userInfo
    })
  },
  onShow(){
    let slet = this;
    if (wx.getStorageSync('LoginSessionKey') != '') {
      slet.getUserInfo();
      wx.request({
        url: getApp().data.apiUrl + '/GetOrdNum.ashx',
        data: {
          token: wx.getStorageSync('LoginSessionKey')
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var resdata = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
          slet.setData({
            ordnumdata: resdata
          })
        }
      })
    }
  },
  toOrders(e)
  {
    let index = e.currentTarget.dataset.index;
    wx: wx.navigateTo({
      url: '/page/orders/orders' + index,
    })
  },
  getHeadCode()//获取导游码
  {
    let slet = this;
    let token = wx.getStorageSync('LoginSessionKey');
    var timeStamp = slet.createTimeStamp();//时间戳
    var stringSignTemp = "bjhlwx{token=" + token + "timestamp=" + timeStamp + "}bjhlwx";
    var sign = MD5Util.MD5(stringSignTemp).toUpperCase();//签名
    wx.request({
      url: getApp().data.apiUrl + '/GetHeadCode.ashx',
      data: {
        token: token,
        timestamp: timeStamp,
        sign: sign
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resdata = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        console.log(resdata);
        if (resdata.status == 1) {
          wxbarcode.qrcode('qrcode', resdata.code, 320, 320);
          slet.setData({
            bl1: true
          })
        }
        else 
        {
          wx.showToast({
            title: resdata.msg,
            icon: 'none',
            duration: 1000
          })
        }
      },
      complete: function () {
      }
    })
  },
  bindDl() {
    wx.redirectTo({
      url: '/page/login/index'
    })
    return;
  },
  tcBindtap(e) {//退登
    wx.showModal({
      title: '提示',
      content: '确认退出',
      success: function (res) {
        if (res.confirm) {
          wx.clearStorage();
          wx.removeStorageSync('LoginSessionKey');
          wx.redirectTo({
            url: '../login/index'
          })
        }
      }
    })
  },
  navigateTo(e) {
    let slet = this;
    const index = e.currentTarget.dataset.index;
    const path = e.currentTarget.dataset.path;
    let userInfo = slet.data.userInfo;
    console.log(path);
    wx.navigateTo({
      url: path
    })
  },
  toTHome()//团长中心
  {
    wx.navigateTo({
      url: '../shop/index',
    })
  },
  bindOpen(e) {//打开登录窗口
    let slet = this;
    if (getApp().globalData.admin_shopid != '' && getApp().globalData.admin_shopid>0)
    {
      slet.setData({
        bl1: false
      })
      wx.navigateTo({
        url: '../shop/index',
      })
    }
    else
    {
      slet.setData({
        bl1: true
      })
    }
  },
  bindClose(e) {//关闭登录窗口
    let slet = this;
    slet.setData({
      bl1: false
    })
  },
  bindName(e) {//输入用户名
    this.setData({
      name: e.detail.value
    })
  },
  bindPwd(e) {//输入登陆密码
    this.setData({
      pwd: e.detail.value
    })
  },
  bindLanding(e) {//用户登陆
    let slet = this;
    let name = slet.data.name;
    let pwd = slet.data.pwd;
    if (name == '') {
      wx.showToast({
        title: '用户名为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (pwd == '') {
      wx.showToast({
        title: '密码为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    wx.request({
      url: getApp().data.apiUrl + '/GetShopManage.ashx',
      data: {
        lname: name,
        pwd: pwd
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let resdata = res.data;
        console.log('manage:', resdata);
        if (resdata.status == "1") {
          slet.setData({
            name:'',
            pwd:'',
            bl1: false
          })
          getApp().globalData.admin_shopid = resdata.shopid;//登录活动方ID
          wx.navigateTo({
            url: '../shop/index',
          })
        }
        else
        {
          wx.showToast({
            title: '用户名或密码错误',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  getUserInfo() {//更新用户信息
    let slet = this;
    if (wx.getStorageSync('LoginSessionKey') != '')//读取缓存
    {
      wx.request({
        url: getApp().data.apiUrl + '/SelUser.ashx',
        data: {
          shopcode: getApp().data.coding,
          Token: getApp().data.SessionKey
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var resdata = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
          console.log(resdata);
          if (resdata.status == 2) {
            getApp().globalData.userInfo = resdata;
            slet.setData({
              userInfo: resdata
            })
          }
        }
      })
    }
  },
  /* 时间戳产生函数   */
  createTimeStamp: function () {
    return parseInt(new Date().getTime() / 1000) + ''
  }
})