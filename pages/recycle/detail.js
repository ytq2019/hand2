var app = getApp();

Page({
    data: {
        detail: null
    },
    onLoad: function(e) {
        this.setData({
            ThemeStyle: app.getThemeStyle()
        }), this.getRecycleDetail(e.id), app.viewCount();
    },
    getRecycleDetail: function(e) {
        var s = this;
        e && app.util.request({
            url: "entry/wxapp/recycle",
            data: {
                m: "superman_hand2",
                act: "detail",
                id: e
            },
            fail: function(e) {
                console.log(e), wx.showModal({
                    title: "系统提示",
                    content: e.data.errmsg
                });
            },
            success: function(e) {
                console.log(e);
                var t = e.data.data.detail;
                if (t.form_fields) {
                    for (var a = 0; a < t.form_fields.length; a++) if ("radio" == t.form_fields[a].type) {
                        for (var l = t.form_fields[a].extra.option, o = [], i = 0; i < l.length; i++) o[i] = new Object(), 
                        o[i].value = l[i], o[i].checked = !1, o[i].value != t.form_fields[a].value || (o[i].checked = !0);
                        t.form_fields[a].extra.option = o;
                    } else if ("checkbox" == t.form_fields[a].type) {
                        for (var r = t.form_fields[a].extra.option, f = t.form_fields[a].value, c = [], d = 0; d < r.length; d++) if (c[d] = new Object(), 
                        c[d].value = r[d], c[d].checked = !1, "string" == typeof f) c[d].value != f || (c[d].checked = !0); else for (var n = 0; n < f.length; n++) c[d].value != f[n] || (c[d].checked = !0);
                        t.form_fields[a].extra.option = c;
                    }
                    console.log(t), s.setData({
                        detail: t
                    });
                }
            }
        });
    }
});