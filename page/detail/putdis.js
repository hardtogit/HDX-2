let gid;
Page({
  data: {
    des:'',
  },
  onLoad: function (options) {
    gid = options.id;
  },
  onShow: function () {

  },
  bindTextAreaBlur: function (e) {
    this.setData({
      des: e.detail.value
    });
  },
  bindSave(e) {//发表评论
    let slet = this;
    let des = slet.data.des;
    wx.request({
      url: getApp().data.apiUrl + '/DiscussAdd.ashx',
      data: {
        key: wx.getStorageSync('LoginSessionKey'),
        gid: gid,
        des: encodeURI(des),
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data == 1) {
          wx.redirectTo({
            url: 'detail?id=' + gid,
          })
        }
      }
    })
  },
  bindCancel(e){
    wx.redirectTo({
      url: 'detail?id=' + gid,
    })
  },
})