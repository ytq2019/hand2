var app = getApp();

Page({
    data: {
        list: [],
        title: ""
    },
    onLoad: function(t) {
        var e = this;
        e.setData({
            LoadingImg: wx.getStorageSync("LoadingImg"),
            ThemeStyle: app.getThemeStyle()
        }), t.type ? (e.setData({
            type: t.type,
            title: "money_log" == t.type ? "收支明细" : "提现记录"
        }), e.getLogs(t.type)) : wx.showModal({
            title: "系统提示",
            content: "参数错误"
        }), app.viewCount();
    },
    getLogs: function(a) {
        var o = this;
        app.util.request({
            url: "entry/wxapp/finance",
            cachetime: "0",
            data: {
                m: "superman_hand2",
                act: a
            },
            success: function(t) {
                console.log(t);
                var e = "getcash_log" == a ? "提现记录" : "收支明细";
                wx.setNavigationBarTitle({
                    title: e
                }), t.data.errno ? wx.showModal({
                    title: "系统错误",
                    content: t.data.errmsg
                }) : o.setData({
                    list: t.data.data.log,
                    completed: !0
                });
            },
            fail: function(t) {
                o.setData({
                    completed: !0
                }), wx.showModal({
                    title: "系统错误",
                    content: t.data.errmsg
                });
            }
        });
    }
});