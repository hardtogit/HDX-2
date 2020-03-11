Component({
    options: {
        multipleSlots: true
    },
    properties: {
        dataSource: {type: Object, value: {}},
        index: {type: String, value: '1',},
    },
    methods:{
        _targetVisible: function(){
            this.triggerEvent('addEvent', {type:'visible',data:{visible:this.data.modalVisible,index:this.data.index}})
        },
        goTextArea:function(){
            console.log('s')
            wx.navigateTo({
                url: `textarea?type=edit&index=${this.data.index}&content=${this.data.dataSource.data.description}`,

            })
        },
        _tipTap(){
            wx.showToast({
                title: '长按段落并拖拽可调整顺序',
                icon: 'none',
                duration: 1000
            })
        },
        _deleteTip(){
            const $this=this
            var pages = getCurrentPages();
            var currentPage = pages[pages.length - 1];
            wx.showModal({
                title:'系统提示',
                content:'确认删除该段落？',
                success (res) {
                    if (res.confirm) {
                        currentPage.delete($this.data.index)
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }

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
        goPicture () {
            if(!this.data.dataSource.data.images){
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
                                    currentPage.editItemImage(data.httpurl,that.data.index)
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
            }

        }

    }

})