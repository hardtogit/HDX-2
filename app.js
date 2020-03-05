App({
  data: {
    //apiUrl: 'http://localhost:8096/api/TG/',
    apiUrl: 'https://xcx.fangwo.net.cn/api/TG/',
    SessionKey: '',//用户token
    coding: '',//商户编码
    platform_mode:0,//平台模式
    postage_pic: 0,//平台订单运费
    sitename:'会之利',
  },
  onLaunch: function () {
    //console.log('App Launch')
  },
  onShow: function () {
    //console.log('App Show')
  },
  onHide: function () {//界面隐藏时触发
    //console.log('App Hide')
    let slet = this;
    let hendId = slet.globalData.shareHid;
    let skey = wx.getStorageSync('LoginSessionKey');
    let platform_mode = slet.data.platform_mode;
    if (hendId != '' && hendId != null && skey != undefined && skey != '' && platform_mode==0)
    {
      wx.request({
        url: slet.data.apiUrl + '/UpdateUserDaoGou.ashx',
        data: {
          key: skey,
          hid: hendId
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          //console.log(res.data);
        }
      })
    }
  },
  globalData: {
    userInfo: {
      uid: 0,
      avatarUrl: '',
      nickName: ''
    },
    formInfo: {//表单信息
      name: '',
      tel: '',
      email: '',
      des: ''
    },
    coordinate:{//坐标
      longitude:'',
      latitude:''
    },
    shareHid:'',
    snaptypeid:0,//临时分类编号
    starttime: '',//临时活动开始时间
    cityname:'全国',//当前城市
    content:'',//活动详情
  }
})