var app = getApp();

Component({
    options: {
        addGlobalClass: !0
    },
    properties: {
        paddingTop: {
            type: Number,
            value: 200
        },
        msg: {
            type: String,
            value: ""
        }
    },
    data: {
        AssetsUrl: app.globalData.AssetsUrl
    },
    methods: {}
});