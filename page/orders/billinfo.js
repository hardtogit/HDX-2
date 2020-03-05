var wxbarcode = require('../../util/index.js');
Page({
  data: {
    hidden: false,
    ticketinfo:{},
    ticketindex:1,
    biilnumber: ''
  },
  onLoad: function (options) {
    let slet = this;
    wx.request({
      url: getApp().data.apiUrl + '/GetTicketInfo.ashx?id=' + options.id,
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var resData = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        console.log(resData);
        slet.setData({
          ticketinfo: resData
        })
        if (resData.codedata.length>0)
        {
          let biilnumber = resData.codedata[0].code;
          wxbarcode.qrcode('qrcode', biilnumber, 326, 326);
          slet.setData({
            biilnumber: biilnumber
          })
        }
      },
      complete: function () {
        slet.setData({
          hidden: true
        })
      }
    })
  },
  onShow: function () {
    // let slet = this;
    // let biilnumber = slet.data.biilnumber;
    // wxbarcode.qrcode('qrcode', biilnumber, 326, 326);
  },
  to_Top(e){//向上
    let slet = this;
    let codedata = slet.data.ticketinfo.codedata;
    let ticketindex = parseInt(slet.data.ticketindex);
    if (ticketindex==1)
    {
      wx.showToast({
        title: '第一张',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    ticketindex--;
    let biilnumber = codedata[ticketindex-1].code;
    wxbarcode.qrcode('qrcode', biilnumber, 326, 326);
    slet.setData({
      ticketindex: ticketindex,
      biilnumber: biilnumber
    })
  },
  to_Next(e) {//向下
    let slet = this;
    let codedata = slet.data.ticketinfo.codedata;
    let ticketindex = parseInt(slet.data.ticketindex);
    if (ticketindex == codedata.length) {
      wx.showToast({
        title: '最后一张',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    let biilnumber = codedata[ticketindex].code;
    wxbarcode.qrcode('qrcode', biilnumber, 326, 326);
    ticketindex++;
    slet.setData({
      ticketindex: ticketindex,
      biilnumber: biilnumber
    })
  },
  toRefresh(e) {//点击刷新
    let slet = this;
    console.log('刷新');
    let biilnumber = slet.data.biilnumber;
    try {
      wxbarcode.qrcode('qrcode', biilnumber, 326, 326);
    }
    catch (e) {
    }
  },
})