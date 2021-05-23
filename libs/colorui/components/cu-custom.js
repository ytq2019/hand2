var app = getApp();

Component({
    options: {
        addGlobalClass: !0,
        multipleSlots: !0
    },
    properties: {
        bgColor: {
            type: String,
            default: ""
        },
        isCustom: {
            type: [ Boolean, String ],
            default: !1
        },
        isBack: {
            type: [ Boolean, String ],
            default: !1
        },
        bgImage: {
            type: String,
            default: ""
        },
        contentPointerEvents: {
            type: String,
            value: "none"
        },
        contentCenter: {
            type: Boolean,
            value: !0
        },
        contentLeft: {
            type: Number,
            value: 20
        }
    },
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom
    },
    methods: {
        BackPage: function() {
            1 < getCurrentPages().length ? wx.navigateBack({
                delta: 1
            }) : wx.navigateTo({
                url: "/pages/home/index"
            });
        },
        toHome: function() {
            wx.reLaunch({
                url: "/pages/home/index"
            });
        },
        clickContent: function(t) {
            this.triggerEvent("clickContent", t);
        }
    }
});