var app = getApp();

Page({
    data: {
        list: [],
        page: 1,
        nodata: !1
    },
    onLoad: function() {
        this.setData({
            ThemeStyle: app.getThemeStyle()
        }), this.getRecycleList(), app.viewCount();
    },
    getRecycleList: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/recycle",
            data: {
                m: "superman_hand2",
                act: "list",
                page: e.data.page
            },
            fail: function(t) {
                app.util.message(t.data.errmsg, "", "error");
            },
            success: function(t) {
                var a;
                console.log(t), t.data.data.list.length ? (a = void 0, a = e.data.list.length ? e.data.list.concat(t.data.data.list) : t.data.data.list, 
                e.setData({
                    list: a,
                    page: e.data.page + 1
                })) : e.setData({
                    nodata: !0
                });
            }
        });
    },
    onReachBottom: function() {
        this.getRecycleList();
    }
});