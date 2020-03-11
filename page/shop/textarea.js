
Page({
    data:{
        params:{},
        content:''
    },
   handleClick(){
        console.log(this.data.content)
       var pages = getCurrentPages();
       var prevPage = pages[pages.length - 2];  //上一个页面
       if(this.data.params.type==='edit'){
           prevPage.editItemText(this.data.content,this.data.params.index)//设置数据
       }else{
           prevPage.insertItemText(this.data.content,this.data.params.index)//设置数据
       }
       wx.navigateBack({})
   },
   handleInput(e){
        this.setData({
            content:e.detail.value
        })
   },
   onLoad(option){
        if(option.type==='edit'){
            this.setData({
                params:option,
                content:option.content
            })
        }else{
            this.setData({
                params:option
            })
        }

   }



})