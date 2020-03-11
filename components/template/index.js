Component({
    options: {
        multipleSlots: true
    },
    properties: {
        dataSource:{type:Array,value:[],observer:function (newVal, oldVal) {
                console.log(newVal)
            }},
    },
    methods:{

    },
    attached(){
        console.log(this.data,'ssss')
    }

})