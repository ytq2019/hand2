var STORAGE_KEY = "PLUG-ADD-MYAPP-KEY";

Component({
    properties: {
        name: {
            type: String,
            value: ""
        },
        duration: {
            type: Number,
            value: 10
        },
        delay: {
            type: Number,
            value: 2
        },
        logo: {
            type: String,
            value: ""
        },
        custom: {
            type: Boolean,
            value: !1
        }
    },
    lifetimes: {
        attached: function() {
            var t, e, i = this;
            wx.getStorageSync(STORAGE_KEY) || (t = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null, 
            e = wx.getSystemInfoSync().screenWidth, this.setData({
                navbarHeight: t.bottom,
                arrowR: e - t.right + 3 * t.width / 4 - 5,
                bodyR: e - t.right
            }), this.startTimer = setTimeout(function() {
                i.setData({
                    SHOW_TOP: !0
                });
            }, 1e3 * this.data.delay), this.duraTimer = setTimeout(function() {
                i.shrink();
            }, 1e3 * (this.data.duration + this.data.delay)));
        },
        detached: function() {
            this.startTimer && clearTimeout(this.startTimer), this.duraTimer && clearTimeout(this.duraTimer);
        }
    },
    data: {
        SHOW_TOP: !1
    },
    methods: {
        hidden: function() {
            wx.setStorageSync(STORAGE_KEY, !0), this.shrink();
        },
        shrink: function() {
            this.animate("#add-tips", [ {
                scale: [ 1, 1 ]
            }, {
                scale: [ 0, 0 ],
                ease: "ease",
                transformOrigin: "calc(600rpx - " + this.data.arrowR + "px) 1%"
            } ], 500, function() {
                this.setData({
                    SHOW_TOP: !1
                });
            }.bind(this));
        }
    }
});