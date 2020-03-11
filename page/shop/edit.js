
const app = getApp()

let listData = [];
Page({
    data: {
        isIphoneX: app.globalData.isIphoneX,
        size: 4,
        currentKey:0,
        listData: [],
        beforeExtraNodes: [
            {
                dragId: "before0",
                destKey: 0,
                slot: "before",
                fixed: true
            }
        ],
        afterExtraNodes: [
            {
                dragId: "after0",
                destKey: 0,
                slot: "after",
                fixed: true
            },
            {
                dragId: "after9",
                destKey: 9,
                slot: "plus",
                fixed: true
            }
        ],
        pageMetaScrollTop: 0,
        scrollTop: 0
    },
    editItemText(text,index){
        console.log(index,text)
       this.setData({
           listData:this.data.listData.map((item,i)=>{
               if(i==index){
                   return {
                       ...item,
                       description:text
                   }
               }
               return item
           })
       })
        this.drag.init();
    },
    insertItemText(text,index){
        const itemData={
            type:'text',
            dragId: `item${listData.length}`,
            title: "这个绝望的世界没有存在的价值，所剩的只有痛楚",
            description:text,
            images: "",
            fixed: false
        };
        let _listData=[...this.data.listData]
        if(index==0){
            _listData.unshift(itemData)
        }else{
            _listData=[..._listData.slice(0,index),itemData,..._listData.slice(index,_listData.length)]

        }
        this.setData({
            listData:_listData
        })
        this.drag.init();
    },
    editItemImage(url,index){
        this.setData({
            listData:this.data.listData.map((item,i)=>{
                if(i==index){
                    return {
                        ...item,
                        images:url
                    }
                }
                return item
            })
        })
        this.drag.init();
    },
    insertItemImage(url,index){
        const itemData={
            type:'image',
            dragId: `item${listData.length}`,
            title: "这个绝望的世界没有存在的价值，所剩的只有痛楚",
            description:'',
            images: url,
            fixed: false
        };
        let _listData=[...this.data.listData]
        if(index==0){
            _listData.unshift(itemData)
        }else{
            _listData=[..._listData.slice(0,index),itemData,..._listData.slice(index,_listData.length)]

        }
        this.setData({
            listData:_listData
        })
        this.drag.init();
    },
    insertItemVideo(url,index){
        const itemData={
            type:'video',
            dragId: `item${listData.length}`,
            title: "这个绝望的世界没有存在的价值，所剩的只有痛楚",
            description:'',
            images: url,
            fixed: false
        };
        let _listData=[...this.data.listData]
        if(index==0){
            _listData.unshift(itemData)
        }else{
            _listData=[..._listData.slice(0,index),itemData,..._listData.slice(index,_listData.length)]

        }
        this.setData({
            listData:_listData
        })
        this.drag.init();
    },

    //新增投票
    insertItemTicket(params,index){
        const itemData={
            type:'ticket',
            dragId: `item${listData.length}`,
            params:params,
            fixed: false
        };
        let _listData=[...this.data.listData]
        if(index==0){
            _listData.unshift(itemData)
        }else{
            _listData=[..._listData.slice(0,index),itemData,..._listData.slice(index,_listData.length)]

        }
        this.setData({
            listData:_listData
        })
        this.drag.init();
    },

    sortEnd(e) {
        console.log("sortEnd", e.detail.listData)
        this.setData({
            listData: e.detail.listData
        });
        this.drag.init();
    },
    change(e) {
        console.log("change", e.detail.listData)
    },
    sizeChange(e) {
        wx.pageScrollTo({scrollTop: 0})
        this.setData({
            size: e.detail.value
        });
        this.drag.init();
    },
    itemClick(e) {
        console.log(e);
    },
    toggleFixed(e) {
        let key = e.currentTarget.dataset.key;

        let {listData} = this.data;

        listData[key].fixed = !listData[key].fixed

        this.setData({
            listData: listData
        });

        this.drag.init();
    },
    delete(index){
        console.log(index)
        this.setData({
            listData:this.data.listData.filter((item,i)=>{
                return   i!=index
            })
        })
        this.drag.init();
    },
    add(e) {
        let listData = this.data.listData;
        listData.push({
            dragId: `item${listData.length}`,
            title: "这个绝望的世界没有存在的价值，所剩的只有痛楚",
            description: "思念、愿望什么的都是一场空，被这种虚幻的东西绊住脚，什么都做不到",
            images: "/assets/image/swipe/1.png",
            fixed: false
        });
        setTimeout(() => {
            this.setData({
                listData,
                afterExtraNodes: [
                    {
                        destKey: 0,
                        slot: "after",
                        fixed: true
                    },
                    {
                        destKey: listData.length - 1,
                        slot: "plus",
                        fixed: true
                    }
                ]
            });
            this.drag.init();
        }, 300)

    },
    scroll(e) {
        this.setData({
            pageMetaScrollTop: e.detail.scrollTop
        })
    },
    // 页面滚动
    onPageScroll(e) {
        this.setData({
            scrollTop: e.scrollTop
        });
    },
    onLoad() {
        this.drag = this.selectComponent('#drag');
        // 模仿异步加载数据
        setTimeout(() => {
            this.setData({
                listData: listData
            });
            this.drag.init();
        }, 100)
    }
})