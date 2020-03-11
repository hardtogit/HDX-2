
Page({
    data:{
        listData:[]
    },
    _handleSubmit(){
        getApp().globalData.content = JSON.stringify(this.data.listData)
        wx.navigateBack({
            delta:2
        })
    },
    onLoad(){
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        const listData=prevPage.data.listData
        console.log(listData)
        this.setData({
            listData
        })
    }

})