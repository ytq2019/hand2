var app = getApp(), Toast = require("../../libs/zanui/toast/toast"), Toptips = require("../../libs/zanui/toptips/index"), qqmap_wx_jssdk = require("../../libs/qqmap-wx-jssdk.min.js");

Page({
    data: {
        cancelWithMask: !0,
        showConfirm: !1,
        placeholder: "点击获取定位",
        detail: null,
        idx: null
    },
    onLoad: function(t) {
        var e = this;
        t.message && e.setData({
            can_edit: !0
        }), e.setData({
            LoadingImg: wx.getStorageSync("LoadingImg"),
            ThemeStyle: app.getThemeStyle()
        }), e.checkBlacklist(), e.getBasicInfo(), app.viewCount();
    },
    getBasicInfo: function() {
        var i = this;
        app.util.request({
            url: "entry/wxapp/ask_item",
            data: {
                m: "superman_hand2"
            },
            success: function(t) {
                var e = t.data.data;
                if (e.distance) {
                    if (e.item) {
                        for (var a = e.distance, s = 0; s < a.length; s++) if (a[s] == e.item.distance) {
                            i.setData({
                                idx: s
                            });
                            break;
                        }
                        i.setData({
                            detail: e.item,
                            address: e.item.address,
                            lat: e.item.lat,
                            lng: e.item.lng
                        });
                    }
                    i.setData({
                        distance: e.distance,
                        rule: e.rule,
                        completed: !0,
                        subscribe_tmpl_id: e.subscribe_tmpl_id
                    });
                } else app.util.message("后台未设置检索范围参数", "back", "error");
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    closeAuth: function() {
        this.setData({
            showAuth: !1
        });
    },
    checkBlacklist: function() {
        app.util.request({
            url: "entry/wxapp/my",
            cachetime: "0",
            data: {
                act: "blacklist",
                m: "superman_hand2"
            },
            success: function() {},
            fail: function(t) {
                wx.showModal({
                    title: "系统提示",
                    content: t.data.errmsg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "../home/index"
                        });
                    }
                });
            }
        });
    },
    getAddress: function() {
        var s = this;
        s.data.item_id || (s.setData({
            placeholder: "正在定位中..."
        }), wx.getLocation({
            type: "gcj02",
            success: function(t) {
                var e = t.latitude, a = t.longitude;
                s.setData({
                    lat: e,
                    lng: a
                });
                t = wx.getStorageSync("QQMAP_KEY");
                t ? new qqmap_wx_jssdk({
                    key: t
                }).reverseGeocoder({
                    location: {
                        latitude: e,
                        longitude: a
                    },
                    get_poi: 1,
                    poi_options: "address_format=short;radius=2000;policy=1;category=房产小区,住宅区,产业园区,商务楼宇",
                    success: function(t) {
                        t.result.formatted_addresses ? s.setData({
                            address: t.result.formatted_addresses.recommend
                        }) : t.result.address_component && (t = t.result.address_component, s.setData({
                            address: t.locality + t.street
                        }));
                    },
                    fail: function(t) {
                        Toptips({
                            content: t.message,
                            top: app.globalData.CustomBar
                        });
                    }
                }) : app.toast("未设置腾讯地图密钥");
            },
            fail: function() {
                s.setData({
                    showAuth: !0,
                    placeholder: "点击定位"
                });
            }
        }));
    },
    showDistance: function(t) {
        this.setData({
            idx: t.detail.value
        });
    },
    deleteItem: function() {
        var e = this;
        wx.showModal({
            title: "系统提示",
            content: "确定要删除订阅吗？",
            success: function(t) {
                t.confirm && (t = e.data.detail.id, app.util.request({
                    url: "entry/wxapp/ask_item",
                    cachetime: "0",
                    data: {
                        id: t,
                        act: "delete",
                        m: "superman_hand2"
                    },
                    success: function(t) {
                        t.data.errno ? e.showIconToast(t.data.errmsg) : (e.showIconToast("删除成功", "success"), 
                        setTimeout(function() {
                            wx.redirectTo({
                                url: "/pages/my/index"
                            });
                        }, 1500));
                    },
                    fail: function(t) {
                        e.showIconToast(t.data.errmsg);
                    }
                }));
            }
        });
    },
    formSubmit: function(t) {
        var e = this, a = t.detail.value.title, s = t.detail.value.address, i = e.data.distance, t = e.data.idx;
        "" != a ? s ? i ? null !== t ? app.util.request({
            url: "entry/wxapp/ask_item",
            cachetime: "0",
            method: "POST",
            data: {
                act: "post",
                id: e.data.detail ? e.data.detail.id : 0,
                title: a,
                address: s,
                lat: e.data.lat,
                lng: e.data.lng,
                distance: null !== t ? i[t] : 0,
                m: "superman_hand2"
            },
            fail: function(t) {
                Toptips({
                    content: t.data.errmsg,
                    top: app.globalData.CustomBar
                });
            },
            success: function(t) {
                e.showSubscribeMessage();
            }
        }) : Toptips({
            content: "请选择检索范围",
            top: app.globalData.CustomBar
        }) : app.util.message("后台未设置检索范围参数", "", "error") : Toptips({
            content: "请选择您的位置",
            top: app.globalData.CustomBar
        }) : Toptips({
            content: "请输入订阅物品关键字",
            top: app.globalData.CustomBar
        });
    },
    showIconToast: function(t) {
        Toast({
            type: 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "fail",
            message: t,
            selector: "#zan-toast"
        });
    },
    showSubscribeMessage: function() {
        var t = this;
        console.log("subscribe_tmpl_id", t.data.subscribe_tmpl_id), t.data.subscribe_tmpl_id ? wx.showModal({
            title: "提交成功",
            content: "是否接收订阅通知消息？",
            showCancel: !0,
            cancelText: "不需要",
            confirmText: "需要",
            success: function() {
                wx.requestSubscribeMessage({
                    tmplIds: [ t.data.subscribe_tmpl_id ],
                    success: function(t) {
                        console.log(t), app.util.message("提交成功", "redirect:/pages/my/index");
                    },
                    fail: function(t) {
                        console.log(t);
                    }
                });
            }
        }) : app.util.message("提交成功", "redirect:/pages/my/index");
    }
});