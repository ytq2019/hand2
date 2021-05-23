var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e;
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
}, _base = require("base64"), _md = require("md5"), _md2 = _interopRequireDefault(_md), _dialog = require("../../../components/dialog/dialog"), _dialog2 = _interopRequireDefault(_dialog);

function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

var util = {};

function getQuery(e) {
    var t = [];
    if (-1 != e.indexOf("?")) for (var n = e.split("?")[1].split("&"), r = 0; r < n.length; r++) n[r].split("=")[0] && unescape(n[r].split("=")[1]) && (t[r] = {
        name: n[r].split("=")[0],
        value: unescape(n[r].split("=")[1])
    });
    return t;
}

function getUrlParam(e, t) {
    t = new RegExp("(^|&)" + t + "=([^&]*)(&|$)"), t = e.split("?")[1].match(t);
    return null != t ? unescape(t[2]) : null;
}

function getSign(e, t, n) {
    var r = require("underscore.js"), a = require("md5.js"), o = require("../../../siteinfo.js"), i = "", s = getUrlParam(e, "sign");
    if (s || t && t.sign) return !1;
    if (e && (i = getQuery(e)), t) {
        var u, c = [];
        for (u in t) u && t[u] && (c = c.concat({
            name: u,
            value: t[u]
        }));
        i = i.concat(c);
    }
    i = r.sortBy(i, "name"), i = r.uniq(i, !0, "name");
    for (var g = "", l = 0; l < i.length; l++) i[l] && i[l].name && i[l].value && (g += i[l].name + "=" + i[l].value, 
    l < i.length - 1 && (g += "&"));
    return a(g + (n = n || o.token));
}

function getCurrentPageUrl(e) {
    var t = getCurrentPages(), n = t[t.length - 1], t = "/" + n.route;
    if (!0 === e && Object.keys(n.options).length) {
        var r, a = [];
        for (r in n.options) r && a.push(r + "=" + n.options[r]);
        a.length && (t += "?" + a.join("&"));
    }
    return t;
}

util.base64Encode = function(e) {
    return (0, _base.base64_encode)(e);
}, util.base64Decode = function(e) {
    return (0, _base.base64_decode)(e);
}, util.md5 = function(e) {
    return (0, _md2.default)(e);
}, util.url = function(e, t) {
    var n = require("../../../siteinfo.js"), r = n.siteroot + "?i=" + n.uniacid + "&t=" + n.multiid + "&v=" + n.version + "&from=wxapp&";
    if (e && ((e = e.split("/"))[0] && (r += "c=" + e[0] + "&"), e[1] && (r += "a=" + e[1] + "&"), 
    e[2] && (r += "do=" + e[2] + "&")), t && "object" === (void 0 === t ? "undefined" : _typeof(t))) for (var a in t) a && t.hasOwnProperty(a) && t[a] && (r += a + "=" + t[a] + "&");
    return r;
}, util.getSign = function(e, t, n) {
    return getSign(e, t, n);
}, util.request = function(r) {
    require("underscore.js");
    var e = require("md5.js"), a = getApp();
    (r = r || {}).cachetime = r.cachetime || 0, r.showLoading = void 0 === r.showLoading || r.showLoading;
    var t = wx.getStorageSync("userInfo"), n = getCurrentPages(), n = n.length ? n[n.length - 1] : null, t = t ? t.sessionid : n && "timeline" != n.options.share ? a.random() : "", o = r.url;
    -1 == o.indexOf("http://") && -1 == o.indexOf("https://") && (o = util.url(o)), 
    getUrlParam(o, "state") || r.data && r.data.state || !t || (o = o + "&state=we7sid-" + t), 
    r.data && r.data.m || n && n.__route__ && (o = o + "&m=" + n.__route__.split("/")[0]);
    n = getSign(o, r.data);
    if (n && (o = o + "&sign=" + n), !o) return !1;
    if (wx.showNavigationBarLoading(), r.showLoading && util.showLoading(), r.cachetime) {
        var i = e(o), e = wx.getStorageSync(i), s = Date.parse(new Date());
        if (e && e.data) {
            if (e.expire > s) return r.complete && "function" == typeof r.complete && r.complete(e), 
            r.success && "function" == typeof r.success && r.success(e), console.log("cache:" + o), 
            wx.hideLoading(), wx.hideNavigationBarLoading(), !0;
            wx.removeStorageSync(i);
        }
    }
    wx.request({
        url: o,
        data: r.data || {},
        header: r.header || {
            "content-type": "application/x-www-form-urlencoded"
        },
        method: r.method || "GET",
        success: function(e) {
            var t, n;
            wx.hideNavigationBarLoading(), wx.hideLoading(), e.data.errno || void 0 === e.data.errno ? "41009" == e.data.errno ? (wx.setStorageSync("userInfo", ""), 
            util.getUserInfo(function() {
                util.request(r);
            })) : "4" == e.data.errno ? (t = getCurrentPageUrl(!0), console.info("login redirect", t), 
            wx.navigateTo({
                url: "/pages/login/index?redirect=" + encodeURIComponent(t)
            })) : "27" == e.data.errno ? wx.redirectTo({
                url: "/pages/404/index"
            }) : r.fail && "function" == typeof r.fail ? void 0 !== e.data.errmsg ? r.fail(e) : "auth/session/userinfo" == r.url && "请先登录" == e.data.message ? a.util.message("小程序登录接口升级，请升级系统版本到2.7.4+以上", n, "error") : a.util.message(e.data.message, n, "error") : e.data.message && (n = null != e.data.data && e.data.data.redirect ? e.data.data.redirect : "", 
            a.util.message(e.data.message, n, "error")) : (r.success && "function" == typeof r.success && r.success(e), 
            r.cachetime && (e = {
                data: e.data,
                expire: s + 1e3 * r.cachetime
            }, wx.setStorageSync(i, e)));
        },
        fail: function(e) {
            wx.hideNavigationBarLoading(), wx.hideLoading();
            var t = require("md5.js")(o), t = wx.getStorageSync(t);
            if (t && t.data) return r.success && "function" == typeof r.success && r.success(t), 
            console.log("failreadcache:" + o), !0;
            r.fail && "function" == typeof r.fail && r.fail(e);
        },
        complete: function(e) {
            r.complete && "function" == typeof r.complete && r.complete(e);
        }
    });
}, util.getWe7User = function(t, e) {
    var n = wx.getStorageSync("userInfo") || {};
    util.request({
        url: "auth/session/openid",
        data: {
            code: e || ""
        },
        cachetime: 0,
        showLoading: !1,
        success: function(e) {
            e.data.errno || (n.sessionid = e.data.data.sessionid, n.memberInfo = e.data.data.userinfo, 
            wx.setStorageSync("userInfo", n)), "function" == typeof t && t(n);
        }
    });
}, util.upadteUser = function(e, t) {
    var n = wx.getStorageSync("userInfo");
    if (!e) return "function" == typeof t && t(n);
    n.wxInfo = e.userInfo, util.request({
        url: "auth/session/userinfo",
        data: {
            userInfo: JSON.stringify(e.userInfo)
        },
        method: "POST",
        header: {
            "content-type": "application/x-www-form-urlencoded"
        },
        cachetime: 0,
        success: function(e) {
            e.data.errno || (n.memberInfo = e.data.data, wx.setStorageSync("userInfo", n)), 
            "function" == typeof t && t(n);
        },
        fail: function(e) {
            console.error(e);
        }
    });
}, util.checkSession = function(t) {
    util.request({
        url: "auth/session/check",
        method: "POST",
        cachetime: 0,
        showLoading: !1,
        success: function(e) {
            e.data.errno ? "function" == typeof t.fail && t.fail() : "function" == typeof t.success && t.success();
        },
        fail: function() {
            "function" == typeof t.fail && t.fail();
        }
    });
}, util.getUserInfo = function(n, r) {
    function e() {
        console.log("start login"), wx.login({
            success: function(e) {
                console.log("wx.login success", r, e), util.getWe7User(function(t) {
                    r ? util.upadteUser(r, function(e) {
                        "function" == typeof n && n(e);
                    }) : void 0 === t.sessionid && wx.canIUse("getUserProfile") ? (console.info("canIUse getUserProfile"), 
                    wx.showModal({
                        title: "获取用户信息",
                        content: "请允许授权以便为您提供服务",
                        success: function(e) {
                            e.confirm && wx.getUserProfile({
                                lang: "zh_CN",
                                desc: "用于登录",
                                success: function(e) {
                                    console.log(e), util.upadteUser(e, function(e) {
                                        "function" == typeof n && n(e);
                                    });
                                },
                                fail: function(e) {
                                    console.error(e), "function" == typeof n && n(t);
                                }
                            });
                        }
                    })) : "function" == typeof n && n(t);
                }, e.code);
            },
            fail: function(e) {
                console.error("wx.login fail", e), wx.showModal({
                    title: "获取信息失败",
                    content: "请允许授权以便为您提供服务",
                    success: function(e) {
                        e.confirm && util.getUserInfo();
                    }
                });
            }
        });
    }
    var t = wx.getStorageSync("userInfo") || {};
    t.sessionid ? util.checkSession({
        success: function() {
            r ? util.upadteUser(r, function(e) {
                "function" == typeof n && n(e);
            }) : "function" == typeof n && n(t);
        },
        fail: function() {
            t.sessionid = "", console.log("relogin"), wx.removeStorageSync("userInfo"), e();
        }
    }) : e();
}, util.navigateBack = function(t) {
    var e, n = t.delta || 1;
    t.data && ((e = (e = getCurrentPages())[e.length - (n + 1)]).pageForResult ? e.pageForResult(t.data) : e.setData(t.data)), 
    wx.navigateBack({
        delta: n,
        success: function(e) {
            "function" == typeof t.success && t.success(e);
        },
        fail: function(e) {
            "function" == typeof t.fail && t.fail(e);
        },
        complete: function() {
            "function" == typeof t.complete && t.complete();
        }
    });
}, util.footer = function(e) {
    var t, e = e, n = getApp().tabBar;
    for (t in n.list) n.list[t].pageUrl = n.list[t].pagePath.replace(/(\?|#)[^"]*/g, "");
    e.setData({
        tabBar: n,
        "tabBar.thisurl": e.__route__
    });
}, util.message = function(e, t, n) {
    if (!e) return !0;
    var r, a, o;
    "object" == (void 0 === e ? "undefined" : _typeof(e)) && (t = e.redirect, n = e.type, 
    e = e.title), t && (r = t.substring(0, 9), o = a = "", "navigate:" == r ? (o = "navigateTo", 
    a = t.substring(9)) : "redirect:" == r ? (o = "redirectTo", a = t.substring(9)) : (a = t, 
    o = "redirectTo")), "success" == (n = n || "success") ? wx.showToast({
        title: e,
        icon: "success",
        duration: 2e3,
        mask: !!a,
        complete: function() {
            a && setTimeout(function() {
                wx[o]({
                    url: a
                });
            }, 1800);
        }
    }) : "error" == n && wx.showModal({
        title: "系统信息",
        content: e,
        showCancel: !1,
        complete: function() {
            "back" != t ? a && wx[o]({
                url: a
            }) : 1 < getCurrentPages().length ? wx.navigateBack() : wx.redirectTo({
                url: "/pages/home/index"
            });
        }
    });
}, util.user = util.getUserInfo, util.showLoading = function() {
    wx.getStorageSync("isShowLoading") && (wx.hideLoading(), wx.setStorageSync("isShowLoading", !1)), 
    wx.showLoading({
        title: "加载中",
        complete: function() {
            wx.setStorageSync("isShowLoading", !0);
        },
        fail: function() {
            wx.setStorageSync("isShowLoading", !1);
        }
    });
}, util.showImage = function(e) {
    e = e ? e.currentTarget.dataset.preview : "";
    if (!e) return !1;
    wx.previewImage({
        urls: [ e ]
    });
}, util.parseContent = function(e) {
    if (!e) return e;
    var t = e.match(new RegExp([ "\ud83c[\udf00-\udfff]", "\ud83d[\udc00-\ude4f]", "\ud83d[\ude80-\udeff]" ].join("|"), "g"));
    if (t) for (var n in t) e = e.replace(t[n], "[U+" + t[n].codePointAt(0).toString(16).toUpperCase() + "]");
    return e;
}, util.date = {
    isLeapYear: function(e) {
        return 0 == e.getYear() % 4 && (e.getYear() % 100 != 0 || e.getYear() % 400 == 0);
    },
    dateToStr: function(e, t) {
        e = arguments[0] || "yyyy-MM-dd HH:mm:ss", t = arguments[1] || new Date();
        return e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = e.replace(/yyyy|YYYY/, t.getFullYear())).replace(/yy|YY/, 9 < t.getYear() % 100 ? (t.getYear() % 100).toString() : "0" + t.getYear() % 100)).replace(/MM/, 9 <= t.getMonth() ? t.getMonth() + 1 : "0" + (t.getMonth() + 1))).replace(/M/g, t.getMonth())).replace(/w|W/g, [ "日", "一", "二", "三", "四", "五", "六" ][t.getDay()])).replace(/dd|DD/, 9 < t.getDate() ? t.getDate().toString() : "0" + t.getDate())).replace(/d|D/g, t.getDate())).replace(/hh|HH/, 9 < t.getHours() ? t.getHours().toString() : "0" + t.getHours())).replace(/h|H/g, t.getHours())).replace(/mm/, 9 < t.getMinutes() ? t.getMinutes().toString() : "0" + t.getMinutes())).replace(/m/g, t.getMinutes())).replace(/ss|SS/, 9 < t.getSeconds() ? t.getSeconds().toString() : "0" + t.getSeconds())).replace(/s|S/g, t.getSeconds());
    },
    dateAdd: function(e, t, n) {
        switch (n = arguments[2] || new Date(), e) {
          case "s":
            return new Date(n.getTime() + 1e3 * t);

          case "n":
            return new Date(n.getTime() + 6e4 * t);

          case "h":
            return new Date(n.getTime() + 36e5 * t);

          case "d":
            return new Date(n.getTime() + 864e5 * t);

          case "w":
            return new Date(n.getTime() + 6048e5 * t);

          case "m":
            return new Date(n.getFullYear(), n.getMonth() + t, n.getDate(), n.getHours(), n.getMinutes(), n.getSeconds());

          case "y":
            return new Date(n.getFullYear() + t, n.getMonth(), n.getDate(), n.getHours(), n.getMinutes(), n.getSeconds());
        }
    },
    dateDiff: function(e, t, n) {
        switch (e) {
          case "s":
            return parseInt((n - t) / 1e3);

          case "n":
            return parseInt((n - t) / 6e4);

          case "h":
            return parseInt((n - t) / 36e5);

          case "d":
            return parseInt((n - t) / 864e5);

          case "w":
            return parseInt((n - t) / 6048e5);

          case "m":
            return n.getMonth() + 1 + 12 * (n.getFullYear() - t.getFullYear()) - (t.getMonth() + 1);

          case "y":
            return n.getFullYear() - t.getFullYear();
        }
    },
    strFormatToDate: function(e, t) {
        var n = 0, r = -1, a = t.length;
        -1 < (r = e.indexOf("yyyy")) && r < a && (n = t.substr(r, 4));
        var o = 0;
        -1 < (r = e.indexOf("MM")) && r < a && (o = parseInt(t.substr(r, 2)) - 1);
        var i = 0;
        -1 < (r = e.indexOf("dd")) && r < a && (i = parseInt(t.substr(r, 2)));
        var s = 0;
        (-1 < (r = e.indexOf("HH")) || 1 < (r = e.indexOf("hh"))) && r < a && (s = parseInt(t.substr(r, 2)));
        var u = 0;
        -1 < (r = e.indexOf("mm")) && r < a && (u = t.substr(r, 2));
        var c = 0;
        return -1 < (r = e.indexOf("ss")) && r < a && (c = t.substr(r, 2)), new Date(n, o, i, s, u, c);
    },
    dateToLong: function(e) {
        return e.getTime();
    },
    longToDate: function(e) {
        return new Date(e);
    },
    isDate: function(e, t) {
        null == t && (t = "yyyyMMdd");
        var n = t.indexOf("yyyy");
        if (-1 == n) return !1;
        var r = e.substring(n, n + 4), n = t.indexOf("MM");
        if (-1 == n) return !1;
        n = e.substring(n, n + 2), t = t.indexOf("dd");
        if (-1 == t) return !1;
        t = e.substring(t, t + 2);
        return !(!isNumber(r) || "2100" < r || r < "1900") && (!(!isNumber(n) || "12" < n || n < "01") && !(t > getMaxDay(r, n) || t < "01"));
    },
    getMaxDay: function(e, t) {
        return 4 == t || 6 == t || 9 == t || 11 == t ? "30" : 2 == t ? e % 4 == 0 && e % 100 != 0 || e % 400 == 0 ? "29" : "28" : "31";
    },
    isNumber: function(e) {
        return /^\d+$/g.test(e);
    },
    toArray: function(e) {
        e = arguments[0] || new Date();
        var t = Array();
        return t[0] = e.getFullYear(), t[1] = e.getMonth(), t[2] = e.getDate(), t[3] = e.getHours(), 
        t[4] = e.getMinutes(), t[5] = e.getSeconds(), t;
    },
    datePart: function(e, t) {
        t = arguments[1] || new Date();
        var n = "";
        switch (e) {
          case "y":
            n = t.getFullYear();
            break;

          case "M":
            n = t.getMonth() + 1;
            break;

          case "d":
            n = t.getDate();
            break;

          case "w":
            n = [ "日", "一", "二", "三", "四", "五", "六" ][t.getDay()];
            break;

          case "ww":
            n = t.WeekNumOfYear();
            break;

          case "h":
            n = t.getHours();
            break;

          case "m":
            n = t.getMinutes();
            break;

          case "s":
            n = t.getSeconds();
        }
        return n;
    },
    maxDayOfDate: function(e) {
        (e = arguments[0] || new Date()).setDate(1), e.setMonth(e.getMonth() + 1);
        e = e.getTime() - 864e5;
        return new Date(e).getDate();
    }
}, util.Dialog = _dialog2.default, module.exports = util;