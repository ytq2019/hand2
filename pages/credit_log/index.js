var app = getApp();

Page({
    data: {
        more: !0,
        refresh: !0,
        pages: 1
    },
    onLoad: function(t) {
        var a = this;
        a.setData({
            type: t.type,
            LoadingImg: wx.getStorageSync("LoadingImg"),
            ThemeStyle: app.getThemeStyle()
        }), a.getCreditInfo(), a.getIndexData(), app.viewCount();
    },
    getCreditInfo: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/credit",
            data: {
                m: "superman_hand2",
                act: "setting"
            },
            showLoading: !0,
            success: function(t) {
                console.log(t);
                t = t.data.data;
                a.setData({
                    CreditInfo: t.credit_info
                });
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    getIndexData: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/mycredit",
            data: {
                type: a.data.type,
                m: "superman_hand2"
            },
            showLoading: !1,
            complete: function() {
                a.setData({
                    completed: !0
                });
            },
            success: function(t) {
                t = t.data.data;
                a.setData({
                    list: t
                });
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    onReachBottom: function() {
        var e, r = this;
        r.data.refresh && (r.data.total < 20 ? r.setData({
            more: !1
        }) : (r.setData({
            hide: !1
        }), e = r.data.pages + 1, app.util.request({
            url: "entry/wxapp/mycredit",
            cachetime: "0",
            data: {
                page: e,
                m: "superman_hand2"
            },
            success: function(t) {
                r.setData({
                    hide: !0
                });
                var a = t.data.data;
                0 < a.length ? (t = r.data.list.concat(a), r.setData({
                    total: a.length,
                    list: t,
                    pages: e
                })) : r.setData({
                    more: !1,
                    refresh: !1
                });
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        })));
    }
});