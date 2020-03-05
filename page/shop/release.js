Page({
  data: {
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS })
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {//初始化编辑器内容
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context,
        that.editorCtx.setContents({
        html: getApp().globalData.content,
          success: function () {
            //console.log('insert html success')
          }
        })
    }).exec()
  },
  
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {//图片上传
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        wx.uploadFile({
          url: getApp().data.apiUrl + '/UploadFileToImg.ashx',
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            console.log(data);
            if (data.status==1)
            {
              that.editorCtx.insertImage({
                src: data.httpurl,
                width: '100%',
                success: function () {
                  console.log('insert image success');
                }
              })
            }
            else
            {
              wx.showToast({
                title: '图片上传失败',
                icon: 'none',
                duration: 1000
              })
            }
          }
        })
      }
    })
  },
  // 获取内容
  clickLogText(e) {
    let that = this;
    that.editorCtx.getContents({
      success: function (res) {
        console.log(res.html)
        getApp().globalData.content = res.html;
        //wx.setStorageSync("content", res.html); // 缓存本地
      }
    })
  },
  // 获取内容
  onContentChange(e) {
    let that = this;
    console.log('con:',e.detail);
    that.setData({
      content: e.detail,
    })
    getApp().globalData.content = e.detail.html;
    //wx.setStorageSync("content", e.detail);
  },
})
