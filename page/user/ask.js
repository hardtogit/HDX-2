Page({
  data: {
    hidden: false,
    askData: {},
    prompt: {
      hidden: !0,
      icon: '',
      title: '还没添加任何信息',
      text: '可以去看看其它栏目',
    }
  },
  onLoad: function (options) {

  },
  onShow: function () {
    let slet = this;
    wx.request({
      url: getApp().data.apiUrl + '/GetNews.ashx',
      data: {
        shopcode: getApp().data.coding,
        id: 2
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resdata = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        slet.setData({
          askData: resdata.data,
          'prompt.hidden': resdata.data.length
        })
      },
      complete: function () {
        slet.setData({
          hidden: true
        })
      }
    })
  },
  selTitle(e){
    let slet = this;
    var index = e.currentTarget.dataset.index;
    let askData = slet.data.askData;
    var bl1 = askData[index].hid;
    for (var k = 0; k < askData.length;k++)
    {
      askData[k].hid=true;
    }
    
    if (bl1 == true)
    {
      askData[index].hid = 0;
    }
    else
    {
      askData[index].hid = true;
    }
    slet.setData({
      askData: askData
    })
  },
  toHome()//回首页
  {
    wx.switchTab({
      url: '/page/index',
    })
  },
  toUser() {//回我的
    wx.switchTab({
      url: '/page/user/user',
    })
  }
})