var app = getApp();

Component({
    options: {
        addGlobalClass: !0
    },
    properties: {
        file: {
            type: String,
            value: ""
        },
        path: {
            type: String,
            value: ""
        },
        key: {
            type: String,
            value: ""
        },
        mode: {
            type: String,
            value: "widthFix"
        }
    },
    data: {
        AssetsUrl: app.globalData.AssetsUrl,
        isShow: !1
    },
    ready: function() {
        this.setData({
            isShow: !wx.getStorageSync(this.getKey())
        });
    },
    methods: {
        getKey: function() {
            return "ImagePopup:" + this.data.key;
        },
        click: function(t) {
            wx.setStorageSync(this.getKey(), "1"), app.superman.toPage(t);
        },
        hide: function(t) {
            this.setData({
                isShow: !1
            }), wx.setStorageSync(this.getKey(), "1");
        }
    }
});