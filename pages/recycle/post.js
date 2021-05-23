var app = getApp();

Page({
    data: {
        region: [],
        form_field: [],
        isAgree: !1
    },
    onLoad: function() {
        this.setData({
            ThemeStyle: app.getThemeStyle(),
            formData: wx.getStorageSync("RecycleFormDataCommon") || {
                contact: "",
                mobile: "",
                region: [],
                address: ""
            }
        }), this.getRecycleForm(), app.viewCount();
    },
    bindRegionChange: function(e) {
        this.setData({
            region: e.detail.value
        });
    },
    getRecycleForm: function() {
        var n = this;
        app.util.request({
            url: "entry/wxapp/recycle",
            data: {
                m: "superman_hand2",
                act: "form"
            },
            fail: function(e) {
                console.error(e), 33 != e.data.errno ? app.util.message(e.data.errmsg, "", "error") : app.util.message(e.data.errmsg, "redirect:/pages/home/index", "error");
            },
            success: function(e) {
                console.log(e);
                e = e.data.data;
                n.setData({
                    desc: e.desc,
                    rule: e.rule
                }), e.region.length && n.setData({
                    region: e.region
                });
                var t = e.form_fields || [];
                if (t) {
                    for (var a = 0; a < t.length; a++) if ("radio" == t[a].type || "checkbox" == t[a].type) {
                        for (var r = t[a].extra.option, o = [], i = 0; i < r.length; i++) o[i] = new Object(), 
                        o[i].value = r[i], o[i].checked = !1;
                        t[a].extra.option = o;
                    } else "single_select" == t[a].type && (t[a].extra.value = "");
                    n.setData({
                        form_field: t
                    });
                }
            }
        });
    },
    radioChange: function(e) {
        for (var t = this.data.form_field, a = t[e.currentTarget.dataset.index].extra.option, r = 0; r < a.length; r++) a[r].value == e.detail.value ? a[r].checked = !0 : a[r].checked = !1;
        this.setData({
            form_field: t
        });
    },
    checkboxChange: function(e) {
        for (var t = this.data.form_field, a = t[e.currentTarget.dataset.index].extra.option, r = e.detail.value, o = 0; o < a.length; o++) {
            a[o].checked = !1;
            for (var i = 0; i < r.length; i++) if (a[o].value == r[i]) {
                a[o].checked = !0;
                break;
            }
        }
        this.setData({
            form_field: t
        });
    },
    bindPickChange: function(e) {
        var t = this.data.form_field, a = e.currentTarget.dataset.index, r = t[a].extra.option, e = e.detail.value;
        t[a].extra.value = r[e], this.setData({
            form_field: t
        });
    },
    submitPost: function(e) {
        var t = this, a = e.detail.value.contact, r = e.detail.value.mobile, o = (t.data.region[0] && t.data.region[1] && t.data.region[2] ? t.data : t.data.formData).region;
        console.log(o, t.data.formData);
        var i = e.detail.value.address;
        "" != a ? "" != r ? o.length ? "" != i ? t.data.isAgree || "" == t.data.rule ? !1 !== (e = t.getFormFields(e)) && app.util.request({
            url: "entry/wxapp/recycle",
            data: {
                m: "superman_hand2",
                act: "post",
                fields: e ? app.util.base64Encode(JSON.stringify(e)) : "",
                contact: a,
                mobile: r,
                province: o[0],
                city: o[1],
                district: o[2],
                address: i
            },
            fail: function(e) {
                console.error(e), app.util.message(e.data.errmsg, "", "error");
            },
            success: function(e) {
                console.log(e), wx.showToast({
                    icon: "success",
                    title: "提交成功",
                    duration: 2e3,
                    success: function() {
                        wx.setStorageSync("RecycleFormDataCommon", {
                            contact: a,
                            mobile: r,
                            region: o,
                            address: i
                        }), setTimeout(function() {
                            wx.redirectTo({
                                url: "/pages/recycle/list"
                            });
                        }, 2e3);
                    }
                });
            }
        }) : app.toast("请阅读并同意回收公约") : app.toast("请输入详细地址") : app.toast("请选择地区") : app.toast("请输入手机号") : app.toast("请输入联系人");
    },
    getFormFields: function(e) {
        for (var t, a = [], r = e.detail.value, o = this.data.form_field, i = 0; i < o.length; i++) if (1 == o[i].required && "" == r[i]) return "text" == o[i].type || "textarea" == o[i].type ? app.toast("请输入" + o[i].title) : app.toast("请选择" + o[i].title), 
        !1;
        for (t in r) {
            var n = encodeURIComponent(r[t]);
            a.push(n);
        }
        return a;
    },
    changeAgree: function(e) {
        this.setData({
            isAgree: !!e.detail.value.length
        });
    },
    showRuleDialog: function(e) {
        this.setData({
            showRuleDialog: !0
        });
    }
});