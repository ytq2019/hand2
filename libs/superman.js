var _util = require("../we7/resource/js/util"), _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

var superman = {
    getCurrentPage: function() {
        var e = getCurrentPages();
        return e[e.length - 1].route.split("/")[1];
    },
    getCurrentPageUrl: function(e) {
        var t = getCurrentPages(), n = t[t.length - 1], t = "/" + n.route;
        if (!0 === e && Object.keys(n.options).length) {
            var r, a = [];
            for (r in n.options) r && a.push(r + "=" + n.options[r]);
            a.length && (t += "?" + a.join("&"));
        }
        return t;
    }
};

superman.addChineseUnit = function(e, t) {
    function a(e) {
        for (var t = -1; 1 <= e; ) t++, e /= 10;
        return t;
    }
    function n(e, t, n, r) {
        if (3 < (e = a(e))) {
            e = e % 8;
            return 5 <= e && (e = 4), Math.round(t / Math.pow(10, e + n - r)) / Math.pow(10, r) + "万";
        }
        return Math.round(t / Math.pow(10, n - r)) / Math.pow(10, r);
    }
    t = null == t ? 2 : t;
    var r = Math.floor(e), o = a(r), i = [];
    if (3 < o) {
        var u = Math.floor(o / 8);
        if (1 <= u) {
            o = Math.round(r / Math.pow(10, 8 * u));
            i.push(n(o, e, 8 * u, t));
            for (var s = 0; s < u; s++) i.push("亿");
            return i.join("");
        }
        return n(r, e, 0, t);
    }
    return e;
}, superman.toDecimal = function(e) {
    if (isNaN(parseFloat(e))) return !1;
    var t = (Math.round(100 * e) / 100).toString(), n = t.indexOf(".");
    for (n < 0 && (n = t.length, t += "."); t.length <= n + 2; ) t += "0";
    return t;
}, superman.checkAuthorize = function(t, n) {
    var r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "用户未授权", a = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : "拒绝授权将不能更便捷体验小程序完整功能，点击确定开启授权";
    wx.getSetting({
        success: function(e) {
            console.log(e.authSetting[t]), e.authSetting[t] || wx.showModal({
                title: r,
                content: a,
                success: function(e) {
                    console.log(e), e.confirm ? wx.openSetting({
                        success: function(e) {
                            "function" == typeof n && n({});
                        }
                    }) : "function" == typeof n && n({
                        refuseAuthorize: !0
                    });
                }
            });
        }
    });
}, superman.callPhone = function(e) {
    void 0 !== e.currentTarget.dataset.phone && wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.phone
    });
}, superman.base64 = function(e) {
    var r = e.url, a = e.type;
    return new Promise(function(t, n) {
        wx.getFileSystemManager().readFile({
            filePath: r,
            encoding: "base64",
            success: function(e) {
                t("data:image/" + a.toLocaleLowerCase() + ";base64," + e.data);
            },
            fail: function(e) {
                return n(e.errMsg);
            }
        });
    });
}, superman.goTop = function(e) {
    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 500;
    wx.pageScrollTo({
        scrollTop: 0,
        duration: t
    });
}, superman.goBack = function() {
    1 < getCurrentPages().length ? wx.navigateBack({
        delta: 1
    }) : wx.navigateTo({
        url: "/pages/home/index"
    });
}, superman.toPage = function(t) {
    var n = t.target.dataset.url || t.currentTarget.dataset.url, e = "redirect" == t.currentTarget.dataset.redirectType ? "redirectTo" : "navigateTo", r = t.currentTarget.dataset.appid, a = wx.getStorageSync("userInfo");
    console.log("toPage", e, "url:" + n, "appid:" + r, a), !t.currentTarget.dataset.needAvatar || a.memberInfo.avatar || void 0 !== a.wxInfo ? n != this.getCurrentPageUrl(!0) && (r ? wx.navigateToMiniProgram({
        appId: r,
        path: n,
        success: function(e) {
            console.info("navigateToMiniProgram success", r, n, e);
        },
        fail: function(e) {
            console.info("navigateToMiniProgram fail", r, n, e);
        }
    }) : n && (n.match(/(http|https):\/\/([\w.]+\/?)\S*/gi) ? wx[e]({
        url: "/pages/webview/index?url=" + encodeURIComponent(n)
    }) : wx[e]({
        url: n
    }))) : wx.getUserProfile({
        desc: "更新用户信息",
        success: function(e) {
            getApp().util.getUserInfo(function() {
                superman.toPage(t);
            }, e);
        },
        fail: function(e) {
            console.error(e), getApp().util.message("未获取用户信息，无法执行", "", "error");
        }
    });
}, superman.toMap = function(e) {
    wx.openLocation({
        latitude: parseFloat(e.currentTarget.dataset.lat),
        longitude: parseFloat(e.currentTarget.dataset.lng),
        scale: 24
    });
}, superman.getDateDiff = function(e) {
    var t = new Date().getTime() - e;
    if (t < 0) return "";
    var n = t / 2592e6, r = t / 6048e5, a = t / 864e5, e = t / 36e5, t = t / 6e4;
    return 1 <= n ? parseInt(n) + "个月前" : 1 <= r ? parseInt(r) + "周前" : 1 <= a ? parseInt(a) + "天前" : 1 <= e ? parseInt(e) + "小时前" : 1 <= t ? parseInt(t) + "分钟前" : "刚刚";
}, superman.formatRichText = function(e) {
    e = e.replace(/<img[^>]*>/gi, function(e, t) {
        return e = (e = (e = e.replace(/style="[^"]+"/gi, "").replace(/style='[^']+'/gi, "")).replace(/width="[^"]+"/gi, "").replace(/width='[^']+'/gi, "")).replace(/height="[^"]+"/gi, "").replace(/height='[^']+'/gi, "");
    });
    return e = (e = (e = e.replace(/style="[^"]+"/gi, function(e, t) {
        return e = e.replace(/width:[^;]+;/gi, "max-width:100%;").replace(/width:[^;]+;/gi, "max-width:100%;");
    })).replace(/width="[^"]+"/gi, function(e, t) {
        return e = e.replace(/width="[^"]+"/gi, 'width="100%"');
    })).replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"');
}, superman.deleteMedia = function(r, a) {
    return new Promise(function(t, n) {
        wx.showModal({
            title: "提示",
            content: "确定删除吗？",
            success: function(e) {
                e.confirm && _util2.default.request({
                    method: "POST",
                    url: "entry/wxapp/upload",
                    data: {
                        m: "superman_hand2",
                        act: "delete",
                        path: a[r].path
                    },
                    showLoading: !0,
                    success: function(e) {
                        t(e);
                    },
                    fail: function(e) {
                        n(e);
                    }
                });
            }
        });
    });
}, superman.requestPromise = function(r) {
    return new Promise(function(t, n) {
        var e = {
            success: function(e) {
                t(e.data);
            },
            fail: function(e) {
                n(e);
            }
        };
        _util2.default.request(Object.assign(r, e));
    });
}, module.exports = superman;