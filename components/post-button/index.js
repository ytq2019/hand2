var app = getApp();

Component({
    options: {
        addGlobalClass: !0
    },
    properties: {
        title: {
            type: String,
            value: "发布"
        },
        url: {
            type: String,
            value: ""
        },
        bottom: {
            type: Number,
            value: 32
        },
        needAvatar: {
            type: Boolean,
            value: !1
        },
        themeStyle: {
            type: Object,
            value: {
                color: "orange",
                value: "#FA6400",
                gradual: "orange",
                home_top_style: !1,
                rgb: [ 250, 100, 0 ]
            }
        }
    },
    data: {
        AssetsUrl: app.globalData.AssetsUrl
    },
    methods: {
        click: function(e) {
            var t = this;
            wx.getStorageSync("LocationInfo") ? app.superman.toPage(e) : app.getLocation(function() {
                t.click(e);
            });
        }
    }
});