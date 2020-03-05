var dateTimePicker = require('../../util/dateTimePicker.js');
Page({
  data: {
    hidden: false,
    img:'',//封面图
    img2: '',
    info:{
      title:'',
      address:'待完善',
      latitude:'',
      longitude:'',
      starttime:'选择开始时间',
      endtime:'选择结束时间',
      peoplenum:0,
      con:'待完善',
      city:0,
      type:0,
      money:0.00
    },
    citydata: {},//城市列表
    typedata: {},//类别列表
    index:-1,
    index2:-1,
    dateTimeArray1: null,
    dateTime1: null,
    dateTimeArray2: null,
    dateTime2: null,
    startYear: null,
    endYear: null,
  },
  onLoad: function (options) {
    let slet = this;

    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(slet.data.startYear, slet.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(slet.data.startYear, slet.data.endYear);

    slet.setData({
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime,
      dateTimeArray2: obj1.dateTimeArray,
      dateTime2: obj1.dateTime
    });

    wx.request({
      url: getApp().data.apiUrl + '/GetCityList.ashx',
      data: {
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resdata = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        console.log(resdata);
        slet.setData({
          citydata: resdata.data
        })
      }
    })
    wx.request({
      url: getApp().data.apiUrl + '/GetPlList.ashx',
      data: {
        //title: encodeURI('全部')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resdata = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        console.log(resdata);
        slet.setData({
          typedata: resdata.data
        })
      },
      complete: function () {
        slet.setData({
          hidden: true
        })
      }
    })
  },
  // 选择日期时间
  changeDateTime1(e) {
    this.setData({
      dateTime1: e.detail.value
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    //console.log(dateArr);
    //console.log(arr);
    var stime = dateArr[0][arr[0]] + '-' + dateArr[1][arr[1]] + '-' + dateArr[2][arr[2]] + ' ' + dateArr[3][arr[3]] + ':' + dateArr[4][arr[4]] + ':' + dateArr[5][arr[5]];
    //console.log(stime);
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr,
      'info.starttime': stime
    });
  },
  changeDateTime2(e) {
    this.setData({
      dateTime2: e.detail.value
    });
  },
  changeDateTimeColumn2(e) {
    var arr = this.data.dateTime2,
      dateArr = this.data.dateTimeArray2;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    var stime = dateArr[0][arr[0]] + '-' + dateArr[1][arr[1]] + '-' + dateArr[2][arr[2]] + ' ' + dateArr[3][arr[3]] + ':' + dateArr[4][arr[4]] + ':' + dateArr[5][arr[5]];
    this.setData({
      dateTimeArray2: dateArr,
      dateTime2: arr,
      'info.endtime': stime
    });
  },
  onShow: function () {
    let slet = this;
    if (getApp().globalData.content!='')
    {
      slet.setData({
        'info.con': '已添加'
      })
    }
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
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        wx.uploadFile({
          url: getApp().data.apiUrl + '/UploadFileToImg.ashx',
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            //console.log(data);
            if (data.status == 1) {
              _this.setData({
                img: data.httpurl,
                img2: data.url
              })
            }
            else {
              wx.showToast({
                title: '封面上传失败',
                icon: 'none',
                duration: 1000
              })
            }
          }
        })
      }
    })
  },
  bindName(e) {
    this.setData({
      'info.title': e.detail.value
    })
  },
  seladdress(e) {
    // 打开地图选择位置
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        that.setData({
          'info.address': res.address,
          'info.latitude': res.latitude,
          'info.longitude': res.longitude
        })

      },
      fail: function (err) {
        console.log(err)
      }
    });
  },
  bindDateChange1(e) {
    this.setData({
      'info.starttime': e.detail.value
    })
  },
  bindDateChange2(e) {
    this.setData({
      'info.endtime': e.detail.value
    })
  },
  bindNum(e) {
    this.setData({
      'info.peoplenum': e.detail.value
    })
  },
  toRelease(e){//活动详情
    wx.navigateTo({
      url: 'release',
    })
  },
  bindMoney(e) {
    this.setData({
      'info.money': e.detail.value
    })
  },
  bindPickerChange1(e) {
    let slet = this;
    let citydata = slet.data.citydata;
    slet.setData({
      index: e.detail.value,
      'info.city': citydata[e.detail.value].id
    })
  },
  bindPickerChange2(e) {
    let slet = this;
    let typedata = slet.data.typedata;
    slet.setData({
      index2: e.detail.value,
      'info.type': typedata[e.detail.value].code
    })
  },
  btnSave(e){//保存
    let slet = this;
    let info = slet.data.info;
    console.log('info:',info);
    let img = slet.data.img2;
    let con = getApp().globalData.content;
    console.log(con);
    if (img == '') {
      wx.showToast({
        title: '请上传封面',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    else if (info.title == '') {
      wx.showToast({
        title: '活动标题为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    else if (info.address == '待完善' || info.address == '') {
      wx.showToast({
        title: '活动地点为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    else if (info.starttime == '选择开始时间' || info.starttime == '') {
      wx.showToast({
        title: '活动开始时间为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    else if (info.endtime == '选择结束时间' || info.endtime =='') {
      wx.showToast({
        title: '活动结束时间为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    else if (info.endtime < info.starttime) {
      wx.showToast({
        title: '结束时间不能小于开始时间',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    else if (info.peoplenum == '') {
      wx.showToast({
        title: '活动人数为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    else if (info.city == 0 || info.city=='') {
      wx.showToast({
        title: '请选择所属城市',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    else if (info.type == 0 || info.type == '') {
      wx.showToast({
        title: '请选择所属分类',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (info.money == '') {
      info.money=0;
    }
    wx.request({
      url: getApp().data.apiUrl + '/AddActivity.ashx',
      data: {
        scode: getApp().globalData.admin_shopcode,
        img: img,
        title: encodeURI(info.title),
        address: encodeURI(info.address),
        latitude: info.latitude,
        longitude: info.longitude,
        starttime: info.starttime,
        endtime: info.endtime,
        peoplenum: info.peoplenum,
        city: info.city,
        type: info.type,
        money: info.money,
        con: encodeURI(con)
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data==1)
        {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function () {
            wx.redirectTo({
              url: 'index',
            })
          }, 1000);
        }
      }
    })
  }
})