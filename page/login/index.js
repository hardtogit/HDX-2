var code = "";
const App = getApp()
var WxCode = '';
var WxEncryptedData = '';
var WxIv = '';
var sid = 0;//关联团长
var surl = '';
var sback = '';//返回页码
Page({
  data: {
    sname: getApp().data.sitename,
    logo: '/image/logo.png',
    logged: !1
  },
  onLoad(options) {
    let slet = this;
    sid = getApp().globalData.shareHid;//分享团长ID
    if (options.hid != undefined)//判断是否分享链接
    {
      sid = options.hid;
      getApp().globalData.shareHid = options.hid;
    }
    if (options.back != undefined) {//返回页码
      sback = options.back;
    }
    slet.selUserInfo();//获取用户信息
  },
  selUserInfo() {
    let slet = this;
    //wx.setStorageSync('LoginSessionKey', "E389E89B6100A63267EA9E1F388DD579");
    if (wx.getStorageSync('LoginSessionKey') != '')//读取缓存
    {
      getApp().data.SessionKey = wx.getStorageSync('LoginSessionKey');
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
          wx.login({//login流程
            success: function (res) {
              code = res.code;
            }
          })
          var resdata = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
          if (resdata.status == 0)//授权失败
          {
            wx.showToast({
              title: '授权失败',
              icon: 'none',
              duration: 1000
            })
          }
          else if (resdata.status == 1)//未审核
          {
            wx.showToast({
              title: '账号未审核',
              icon: 'none',
              duration: 1000
            })
          }
          else if (resdata.status == 2)//已注册
          {
            getApp().globalData.userInfo = resdata;
            if (resdata.hid != null && resdata.hid != 0) {
              getApp().globalData.hendId = resdata.hid;
            }
            //登陆成功跳转到首页
            wx.switchTab({
              url: '/page/index',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          }
        }
      })
      return;
    }
    else {
      wx.login({//login流程
        success: function (res) {
          code = res.code;
        }
      })
    }
  },
  onGotUserInfo: function (e) {//授权回调
    if (e.detail.rawData != undefined) {
      let slet = this;
      console.log('code:', code);
      var encryptedData = e.detail.encryptedData;
      var iv = e.detail.iv;
      WxEncryptedData = encodeURIComponent(encryptedData);
      WxIv = iv;
      wx.request({
        url: getApp().data.apiUrl + '/Login.ashx',
        data: {
          shopcode: getApp().data.coding,
          code: code,
          encryptedData: WxEncryptedData,
          iv: WxIv,
          hid: sid
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var resdata = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
          console.log('login:', resdata);
          if (resdata.status == 0)//授权失败
          {
            wx.login({//login流程
              success: function (res) {
                code = res.code;
              }
            })
            wx.showToast({
              title: '授权失败',
              icon: 'none',
              duration: 1000
            })
          }
          else if (resdata.status == 1)//注册成功/未审核
          {
            wx.login({//login流程
              success: function (res) {
                code = res.code;
              }
            })
            wx.showToast({
              title: '账号未审核',
              icon: 'none',
              duration: 1000
            })
          }
          else if (resdata.status == 2)//已注册
          {
            getApp().globalData.userInfo = resdata;
            if (resdata.hid != null && resdata.hid != 0) {
              getApp().globalData.hendId = resdata.hid;
            }
            wx.setStorageSync('LoginSessionKey', resdata.signature);
            getApp().data.SessionKey = resdata.signature;
            if (sback != '')//判断是否有返回界面
            {
              wx.navigateBack({
                delta: sback,
              })
              return;
            }
            else {
              //登陆成功跳转到首页
              wx.switchTab({
                url: '/page/index',
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            }
          }
          else {
            wx.login({//login流程
              success: function (res) {
                code = res.code;
              }
            })
            // wx.showToast({
            //   title: '授权失败',
            //   icon: 'success',
            //   duration: 1000
            // })
          }
        }
      })
    }
  },
  login() {//确认登陆
    wx.openSetting({//二次获取授权
      success: function (data) {
        let jg = data.authSetting["scope.userInfo"];
      }
    })
  },
  bindCancel()//暂不登录
  {
    wx.switchTab({
      url: '/page/index'
    })
  }
})