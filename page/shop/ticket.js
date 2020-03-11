
Page({
    data:{
        params:{},
        title:'',
        nowKey:2,
        content:[{key:0,value:''},{key:1,value:''}],
        type:1,//1表示单选，2表示多选
        date:''
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
    _addItem(){
      let _content=this.data.content
        _content.push({key:this.data.nowKey,value:''})
        this.setData({
            content:_content,
            nowKey:this.data.nowKey+1
        })
    },
    _delItem(e){
        const index=e.target.dataset.index
        let _content=this.data.content
        console.log(_content.length,index)


        this.setData({
            content:_content.filter((item)=>{
                return item.key!==index
            })
        })
    },
    _titleChange(e){
        this.setData({
            title:e.detail.value
        })
    },
    _inputChange(e){
        console.log(e)
        const index=e.target.dataset.index
        let _content=this.data.content
        this.setData({
            content:_content.map((item)=>{
                if(item.key==index){
                    return {key:index,value:e.detail.value}
                }else{
                    return item
                }
            })
        })

    },
    _changeType(e){
        const type=e.target.dataset.type
        this.setData({
            type
        })
    },
    _dateChange(e){
        console.log(e)
        this.setData({
            date:e.detail.value
        })
    },
    _onsubmit(){
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        if(this.data.params.type==='edit'){
            prevPage.editItemTicket(this.data.content,this.data.params.index)//设置数据
        }else{
            prevPage.insertItemTicket({title:this.data.title,options:this.data.content,date:this.data.date,type:this.data.type},this.data.params.index)//设置数据
        }
        wx.navigateBack({})
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