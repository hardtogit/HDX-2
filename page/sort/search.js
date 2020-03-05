Page({
  data: {
    hendList: {},
    hendList2: {},
  },
  onLoad: function (options) {
    let slet = this;
    slet.setData({
      hendList: getApp().globalData.hendData,
      hendList2: getApp().globalData.hendData
    })
  },
  formHend: function (e) {
    let slet = this;
    var id = e.detail.target.dataset.id;
    var index = e.detail.target.dataset.index;
    let hendList = slet.data.hendList;
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
    getApp().globalData.hendId = id;
    getApp().globalData.userInfo.headName = hendList[index].name;
    wx.navigateBack({
      delta: 1
    })
  },
  inpuText(e) {
    let slet = this;
    let name = e.detail.value;
    //console.log(name);
    let hendList2 = slet.data.hendList2;
    let hendList = [];
    for (var k = 0; k < hendList2.length; k++) {
      if (hendList2[k].name.lastIndexOf(name) != -1 || hendList2[k].city.lastIndexOf(name) != -1 || hendList2[k].address.lastIndexOf(name) != -1) {
        hendList.push(hendList2[k]);
      }
    }
    slet.setData({
      hendList: hendList
    })
  },
})