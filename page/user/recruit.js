var address = require('../../util/city.js')
var animation
var interval;
var rcode="";//返回的验证码
var rphone="";//返回的手机号码
Page({
  data: {
    hidden: true,
    platform_mode:0,
    userInfo: {},
    proIndex: 0,
    storeData:[],//门店数据
    storeArray: [],//门店列表
    storeIndex: 0,
    animationData: {},
    animationAddressMenu: {},
    time: '获取验证码',
    currentTime: 60,
    yzm: '',
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    province: '',
    city: '',
    area: '',
    headInfo:{
      pro:'',
      city:'',
      area:'',
      name: '',
      tel:'',
      code: '',
      lxr:'',
      sfz:'',
    },
    areaInfo: '点击选择区域',
    mobileLocation:{},//提货点坐标地址
    img:null,//团长形象照
  },
  onLoad() {
    let slet = this;
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    slet.animation = animation;
    var id = -1;
    var index1 = 0;
    var index2 = 0;
    var query_clone = getApp().globalData.userInfo;
    if (query_clone.headid > 0) {
      wx.showToast({
        title: '不能重复提交',
        icon: 'success',
        duration: 1000
      })
      setTimeout(function () {
        wx.switchTab({
          url: '../index',
        })
      }, 1000)
      return;
    }
    slet.setData({
      platform_mode: getApp().data.platform_mode,
      userInfo: query_clone,
      'headInfo.tel': query_clone.tel,
      'headInfo.lxr': query_clone.fname,
    })
    slet.getStoreList();//获取门店列表
  },
  getStoreList()//获取门店列表
  {
    let slet = this;
    wx.request({
      url: getApp().data.apiUrl + '/GetStoreList.ashx',
      data: {
        scode: getApp().data.coding,
        longitude: getApp().globalData.coordinate.longitude,
        latitude: getApp().globalData.coordinate.latitude
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resdata = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        console.log(resdata);
        var storeArray = [];
        storeArray.push('请选择门店');
        for (var k = 0; k < resdata.data.length;k++)
        {
          storeArray.push(resdata.data[k].name);
        }
        slet.setData({
          storeData: resdata.data,
          storeArray: storeArray
        })
      }
    })
  },
  //移动选点
  moveToLocation: function () {
    var slet = this;
    wx.chooseLocation({
      success: function (res) {
        let mobileLocation = {
          longitude: res.longitude,
          latitude: res.latitude,
          address: res.address,
        };
        slet.setData({
          areaInfo: mobileLocation.address,
          mobileLocation: mobileLocation
        });
      },
      fail: function (err) {
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
      }
    });
  },
  onReady: function () {
    let slet = this;
    let n1 = slet.data.proIndex;
    let n2 = 0;
    let n3 = 0;
    for (var n = 0; n < slet.data.citys.length; n++) {
      if (slet.data.citys[n].name == slet.data.userInfo.city) {
        n2 = n;
        break;
      }
    }
    for (var k = 0; k < slet.data.areas.length; k++) {
      if (slet.data.areas[k].name == slet.data.userInfo.area) {
        n3 = k;
        break;
      }
    }
    slet.setData({
      value: [n1, n2, n3]
    })
  },

  bindCasPickerChange: function (e) {
    this.setData({
      storeIndex: e.detail.value
    })
  },

  bindName(e) {
    this.setData({
      'headInfo.name': e.detail.value
    })
  },
  bindPhone(e) {
    this.setData({
      'headInfo.tel': e.detail.value
    })
  },
  bindCode(e) {
    this.setData({
      'headInfo.code': e.detail.value
    })
  },
  bindSfz(e) {
    this.setData({
      'headInfo.sfz': e.detail.value
    })
  },

  getCode(e) {//发送验证码
    var slet = this;
    let tel = slet.data.headInfo.tel;
    if (!(/^1[3456789]\d{9}$/.test(tel))) {
      wx.showToast({
        title: '手机号有误',
        icon: 'success',
        duration: 1000
      })
      return;
    }
    slet.getSms(tel);//发送验证码
  },
  getSms(mobile) {
    let slet = this;
    wx.request({
      url: getApp().data.apiUrl + '/SenderSms.ashx',
      data: {
        shopcode: getApp().data.coding,
        phone: mobile
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        var resultData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        //console.log(resultData);
        if (resultData.status==1)
        {
          rcode = resultData.code;
          rphone = resultData.phone;
          var currentTime = slet.data.currentTime;
          slet.setData({
            time: currentTime + 'S'
          })
          interval = setInterval(function () {
            slet.setData({
              time: (currentTime - 1) + 'S'
            })
            currentTime--;
            if (currentTime <= 0) {
              clearInterval(interval)
              slet.setData({
                time: '重新获取',
                currentTime: 60
              })
            }
          }, 1000)
        }
        else
        {
          wx.showToast({
            title: '发送失败',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  },
  formSubmit: function (e){//保存更新
    let sKey = wx.getStorageSync('LoginSessionKey');
    if (e.detail.formId.indexOf("formId") == -1) {
      wx.request({
        url: getApp().data.apiUrl + '/AddCode.ashx',
        data: {
          Key: sKey,
          formid: e.detail.formId
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        }
      })
    }
    let slet = this;
    let storeIndex = slet.data.storeIndex;
    let storeData = slet.data.storeData;
    let areaInfo = slet.data.areaInfo;
    let headInfo = slet.data.headInfo;
    let img = slet.data.img;
    let mobileLocation = slet.data.mobileLocation;
    let storecode = 0;
    if (storeIndex == 0 && getApp().data.platform_mode==1)
    {
      wx.showToast({
        title: '请选择关联门店',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    else if (getApp().data.platform_mode == 1)
    {
      storecode = storeData[storeIndex - 1].code;
    }
    if (areaInfo=='点击选择区域') {
      wx.showToast({
        title: '区域为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (mobileLocation.address == '' || mobileLocation.longitude == '' || mobileLocation.latitude == '') {
      wx.showToast({
        title: '区域为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (headInfo.name == '') {
      wx.showToast({
        title: '真实姓名为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (headInfo.tel == '') {
      wx.showToast({
        title: '手机号为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (headInfo.code=='') {
      wx.showToast({
        title: '验证码为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (headInfo.sfz == '') {
      wx.showToast({
        title: '身份证为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (img == '' || img == null) {
      wx.showToast({
        title: '请上传形象照',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (rcode == "") {
      wx.showToast({
        title: '先获取验证码',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (headInfo.code != rcode) {
      wx.showToast({
        title: '验证码错误',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (headInfo.tel != rphone)
    {
      wx.showToast({
        title: '手机号不匹配',
        icon: 'success',
        duration: 1000
      })
      return;
    }
    slet.setData({
      hidden: false
    })
    wx.uploadFile({
      url: getApp().data.apiUrl + '/AddDaoGou.ashx',
      filePath: img,
      name: 'file',
      formData: {
        key: wx.getStorageSync('LoginSessionKey'),
        storecode: storecode,
        name: encodeURI(headInfo.name),
        lot: mobileLocation.longitude,
        lat: mobileLocation.latitude,
        area: encodeURI(mobileLocation.address),
        tel: headInfo.tel,
        sfz: headInfo.sfz,
      },
      success: function (res) {
        slet.setData({
          hidden: true
        })
        var resdata = JSON.parse(res.data);
        console.log(resdata);
        if (resdata.status == 1) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
        else {
          wx.showToast({
            title: '重复提交',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  chooseImageTap: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#d81e06",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        _this.setData({
          img: res.tempFilePaths[0],
        })
      }
    })
  },
  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var slet = this
    if (slet.data.addressMenuIsShow) {
      return
    }
    slet.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    var slet = this
    if (isShow) {
      slet.animation.translateY(0 + 'vh').step()
    } else {
      slet.animation.translateY(40 + 'vh').step()
    }
    slet.setData({
      animationAddressMenu: slet.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var slet = this
    var city = slet.data.city
    var value = slet.data.value
    slet.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = slet.data.provinces[value[0]].name + ',' + slet.data.citys[value[1]].name + ',' + slet.data.areas[value[2]].name
    slet.setData({
      areaInfo: areaInfo,
      "headInfo.pro": slet.data.provinces[value[0]].name,
      "headInfo.city": slet.data.citys[value[1]].name,
      "headInfo.area": slet.data.areas[value[2]].name
    })
  },
  hideCitySelected: function (e) {
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
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
      },
      fail(res) {
        console.log(res);
      }
    })
  }
})