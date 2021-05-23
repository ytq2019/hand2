function _defineProperty(e, a, t) {
    return a in e ? Object.defineProperty(e, a, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[a] = t, e;
}

var app = getApp();

Page({
    data: {
        completed: !1,
        categorys: {
            list: [],
            children: [],
            selectedId: "",
            scroll: !0
        }
    },
    onLoad: function() {
        this.setData({
            ThemeStyle: app.getThemeStyle()
        }), this.getCategorys(), app.viewCount();
    },
    pageRedirect: function() {
        wx.navigateTo({
            url: "../recycle/post"
        });
    },
    getCategorys: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/recycle",
            data: {
                m: "superman_hand2",
                act: "category"
            },
            success: function(e) {
                console.log(e), e.data.data.categorys && (e = {
                    list: e.data.data.categorys,
                    children: e.data.data.categorys[0].children,
                    selectedId: e.data.data.categorys[0].id,
                    scroll: a.data.categorys.scroll
                }, a.setData({
                    categorys: e
                })), a.setData({
                    currencyInfo: a.data.currencyInfo,
                    completed: !0
                });
            },
            fail: function(e) {
                app.util.message(e.data.errmsg, "redirect:/pages/home/index", "error");
            }
        });
    },
    handleTabChangeCategory: function(e) {
        var a = this, t = e.detail;
        if (a.data.categorys.list) for (var r = 0; r < a.data.categorys.list.length; r++) {
            var c, o = a.data.categorys.list[r];
            if (o.id == t) {
                a.setData((_defineProperty(c = {}, "categorys.selectedId", t), _defineProperty(c, "categorys.children", o.children || []), 
                c));
                break;
            }
        }
    },
    toPage: function(e) {
        app.superman.toPage(e);
    }
});