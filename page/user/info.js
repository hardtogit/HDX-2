var address = require('../../util/city.js')
var animation
Page({
  data: {
    hidden: false,
    userInfo: {},
    proIndex: 0,
    menuType: 0,
    begin: null,
    status: 1,
    end: null,
    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    province: '',
    city: '',
    area: ''
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
    console.log(query_clone);
    slet.setData({
      userInfo: getApp().globalData.userInfo,
      hidden:true
    })
    if (query_clone.province && query_clone.city && query_clone.area) {
      for (var n = 0; n < address.provinces.length; n++) {
        if (address.provinces[n].name == query_clone.province) {
          id = address.provinces[n].id;
          index1 = n;
          break;
        }
      }
      if (id != -1)
      {
        for (var k = 0; k < address.citys[id].length; k++) {
          if (address.citys[id][k].name == query_clone.city) {
            index2 = k;
            break;
          }
        }
        slet.setData({
          areaInfo: slet.data.userInfo.province + ',' + slet.data.userInfo.city + ',' + slet.data.userInfo.area,
          provinces: address.provinces,
          citys: address.citys[id],
          areas: address.areas[address.citys[id][index2].id],
          proIndex: index1
        })
      }
      else
      {
        id = address.provinces[0].id
        slet.setData({
          areaInfo: '点击选择城市',
          provinces: address.provinces,
          citys: address.citys[id],
          areas: address.areas[address.citys[id][0].id],
        })
      }
    }
    else {
      id = address.provinces[0].id
      slet.setData({
        areaInfo: '点击选择城市',
        provinces: address.provinces,
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    }
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

  bindName(e) {
    this.setData({
      'userInfo.fname': e.detail.value
    })
  },
  bindPhone(e) {
    this.setData({
      'userInfo.tel': e.detail.value
    })
  },
  bindAdd(e) {
    this.setData({
      'userInfo.add': e.detail.value
    })
  },
  RadioChange: function (e) {
    this.setData({
      'userInfo.sex': e.detail.value
    })
  },
  formSubmit() {//保存更新
    let slet = this;
    let userInfo1 = slet.data.userInfo;
    console.log(userInfo1);
    if (userInfo1.fname && userInfo1.tel && userInfo1.province && userInfo1.city && userInfo1.area) {
      wx.request({
        url: getApp().data.apiUrl + '/UpdateUserInfo.ashx',
        data: {
          Key: wx.getStorageSync('LoginSessionKey'),
          Name: encodeURI(userInfo1.fname),
          Phone: userInfo1.tel,
          Sex: userInfo1.sex,
          Pro: encodeURI(userInfo1.province),
          City: encodeURI(userInfo1.city),
          Area: encodeURI(userInfo1.area),
          Add: encodeURI(userInfo1.add)
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var resdata = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
          if (resdata.status == 1) {
            getApp().globalData.userInfo = resdata.data;
            wx.showToast({
              title: '更新成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }
          else{
            wx.showToast({
              title: '更新失败',
              icon: 'success',
              duration: 1000
            })
          }
        }
      })
    } 
    else {
      wx.showModal({
        title: '提示',
        content: '请填写完整资料',
      })
    }
  },
// 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name
    that.setData({
      areaInfo: areaInfo,
      "userInfo.province": that.data.provinces[value[0]].name,
      "userInfo.city": that.data.citys[value[1]].name,
      "userInfo.area": that.data.areas[value[2]].name
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
  }
})