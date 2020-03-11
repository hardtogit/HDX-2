Component({
    options: {
        multipleSlots: true
    },
    properties: {
        addVisible: {type: Boolean, value: true},            // 插入正常节点之前的额外节点
        modalVisible: {type: Boolean, value: false},            // 插入正常节点之前的额外节点
        index: {type: Number, value: 0},            // 插入正常节点之前的额外节点
    },
    methods:{
        _targetVisible: function(){
            this.triggerEvent('addEvent', {type:'visible',data:{visible:this.data.modalVisible,index:this.data.index}})
        },
        _goTextArea:function () {
            wx.navigateTo({
                url: `textarea?type=add&index=${this.data.index}`
            })
        },
        _goTicket:function () {
            wx.navigateTo({
                url: `ticket?type=add&index=${this.data.index}`
            })
        },
        _addPicture () {
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
                                    var pages = getCurrentPages();
                                    var currentPage = pages[pages.length - 1];
                                    currentPage.insertItemImage(data.httpurl,that.data.index)
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
        _addVideo(){
            const that = this
            wx.chooseVideo({
                success: function (res) {
                    wx.uploadFile({
                        url: getApp().data.apiUrl + '/UploadFileToImg.ashx',
                        filePath: res.tempFilePath,
                        name: 'file',
                        formData: {
                        },
                        success: function (res) {
                            var data = JSON.parse(res.data);
                            console.log(data);
                            if (data.status==1)
                            {
                                var pages = getCurrentPages();
                                var currentPage = pages[pages.length - 1];
                                currentPage.insertItemVideo(data.httpurl,that.data.index)
                            }
                            else
                            {
                                wx.showToast({
                                    title: '视频上传失败',
                                    icon: 'none',
                                    duration: 1000
                                })
                            }
                        }
                    })
                }
            })


        }

    }

})