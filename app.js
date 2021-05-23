var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e;
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};

App({
    data: {
        version: "6.13.3",
        releaseTime: "2021-05-20"
    },
    globalData: {
        iphoneX: !1,
        StatusBar: null,
        Custom: null,
        CustomBar: null,
        canOpenSocket: !1,
        isOpenSocket: !1,
        AssetsUrl: "",
        LogoUrl: "",
        SystemInfo: null,
        Platform: null,
        IsAndroid: !1,
        IsIOS: !1,
        IsDevtools: !1,
        expressList: [ {
            name: "顺丰速运",
            code: "SF"
        }, {
            name: "百世快递",
            code: "HTKY"
        }, {
            name: "中通快递",
            code: "ZTO"
        }, {
            name: "申通快递",
            code: "STO"
        }, {
            name: "圆通速递",
            code: "YTO"
        }, {
            name: "韵达速递",
            code: "YD"
        }, {
            name: "邮政快递",
            code: "YZPY"
        }, {
            name: "EMS",
            code: "EMS"
        }, {
            name: "天天快递",
            code: "HHTT"
        }, {
            name: "京东快递",
            code: "JD"
        }, {
            name: "优速快递",
            code: "UC"
        }, {
            name: "德邦快递",
            code: "DBL"
        }, {
            name: "宅急送",
            code: "ZJS"
        }, {
            name: "TNT快递",
            code: "TNT"
        }, {
            name: "UPS",
            code: "UPS"
        }, {
            name: "DHL",
            code: "DHL"
        }, {
            name: "其他",
            code: "OTHER"
        } ]
    },
    siteInfo: require("siteinfo.js"),
    util: require("we7/resource/js/util.js"),
    superman: require("libs/superman.js"),
    chatroom: require("libs/chatroom.js"),
    onLaunch: function() {
        console.log("onLaunch start");
        var t, o = this;
        o.globalData.AssetsUrl = o.getDomain() + "addons/superman_hand2/assets", o.globalData.PluginTideAssetsUrl = o.getDomain() + "addons/superman_hand2_plugin_tide/assets", 
        o.globalData.LogoUrl = wx.getStorageSync("Logo") || o.globalData.AssetsUrl + "/../icon.jpg", 
        console.log("userInfo", wx.getStorageSync("userInfo")), wx.getSystemInfo({
            success: function(e) {
                console.info("getSystemInfo", e), o.globalData.SystemInfo = e, o.globalData.Platform = e.platform, 
                o.globalData.IsAndroid = "android" == e.platform, o.globalData.IsIOS = "ios" == e.platform, 
                o.globalData.IsDevtools = "devtools" == e.platform, o.globalData.StatusBar = e.statusBarHeight;
                var t = wx.getMenuButtonBoundingClientRect();
                t ? (o.globalData.Custom = t, o.globalData.CustomBar = t.bottom + t.top - e.statusBarHeight, 
                o.globalData.CustomBarRightOffset = e.screenWidth - t.right) : o.globalData.CustomBar = e.statusBarHeight + 50, 
                (/iphone\sx/i.test(e.model) || /iphone/i.test(e.model) && /unknown/.test(e.model) || /iphone\s11/i.test(e.model)) && (o.globalData.iphoneX = !0);
            }
        }), wx.canIUse("getUpdateManager") && (t = wx.getUpdateManager()).onCheckForUpdate(function(e) {
            e.hasUpdate && (t.onUpdateReady(function() {
                wx.showModal({
                    title: "更新提示",
                    content: "新版本已准备就绪，是否需要重新启动小程序？",
                    success: function(e) {
                        e.confirm && t.applyUpdate();
                    }
                });
            }), t.onUpdateFailed(function() {
                wx.showModal({
                    title: "已有新版本上线",
                    content: "小程序自动更新失败，请删除该小程序后重新搜索打开哟~~~"
                });
            }));
        }), o.globalData.IsDevtools || o.chatroom.init();
    },
    viewCount: function() {
        this.util.request({
            url: "entry/wxapp/stat",
            data: {
                m: "superman_hand2"
            },
            success: function() {
                console.info("viewCount ok");
            }
        });
    },
    updateShare: function(t, e) {
        this.util.request({
            method: "POST",
            url: "entry/wxapp/item",
            data: {
                m: "superman_hand2",
                act: "share",
                share_uid: t,
                item_id: e
            },
            showLoading: !1,
            complete: function() {
                wx.setStorageSync("ShareUid", 0);
            },
            success: function(e) {
                console.log(e, "share_uid: " + t);
            },
            fail: function(e) {
                console.error(e);
            }
        });
    },
    getDomain: function() {
        return this.siteInfo.siteroot.split("app/index.php")[0];
    },
    formatPrice: function(e, t) {
        return e.isCredit ? 0 < e.credit ? e.credit + e.credit_title : "面议" : 0 < e.price ? t + this.superman.toDecimal(e.price) : "面议";
    },
    getExpressName: function(e) {
        for (var t = this.globalData.expressList, o = 0; o < t.length; o++) if (t[o].code == e) return t[o].name;
        return console.error("getExpressName fail", e, t), "";
    },
    getLocation: function(n, a) {
        var s = this, r = wx.getStorageSync("LocationInfo");
        wx.getLocation({
            type: "gcj02",
            success: function(e) {
                if (console.info("wx.getLocation", e), r && r.location.lat == e.latitude && r.location.lng == e.longitude && "function" == typeof n) return n();
                var t = require("/libs/qqmap-wx-jssdk.min.js"), o = wx.getStorageSync("QQMAP_KEY");
                o ? new t({
                    key: o
                }).reverseGeocoder({
                    location: e.latitude + "," + e.longitude,
                    get_poi: 1,
                    poi_options: "page_size=20;address_format=short;category=房产小区,住宅区,产业园区,商务楼宇",
                    success: function(e) {
                        console.log("qqmap.reverseGeocoder", e);
                        var t = e.result, e = {
                            current: "location",
                            location: {
                                lat: t.location.lat,
                                lng: t.location.lng
                            },
                            address: t.address,
                            pois: t.pois
                        };
                        if ("中国" == t.address_component.nation ? e.address_component = {
                            nation: t.address_component.nation,
                            province: t.address_component.province,
                            city: t.address_component.city,
                            district: t.address_component.district,
                            street: t.address_component.street,
                            street_number: t.address_component.street_number
                        } : (e.address = t.address_component.nation + t.address_component.ad_level_1 + t.address_component.locality, 
                        e.address_component = {
                            nation: t.address_component.nation,
                            province: t.address_component.ad_level_1,
                            city: t.address_component.locality,
                            district: "",
                            street: t.address_component.street,
                            street_number: ""
                        }), void 0 !== t.address_reference && (e.address_component.town = {
                            location: {
                                lat: t.address_reference.town.location.lat,
                                lng: t.address_reference.town.location.lng
                            },
                            title: t.address_reference.town.title
                        }), wx.setStorageSync("LocationInfo", e), "function" == typeof n) return n();
                    },
                    fail: function(e) {
                        if (console.warn("qqmap.reverseGeocoder", e), "function" == typeof a) return a();
                        s.util.message(e.message, "", "error");
                    }
                }) : s.toast("未设置腾讯地图密钥");
            },
            fail: function(e) {
                console.warn("wx.getLocation", e), wx.getSetting({
                    success: function(e) {
                        if (console.info("wx.getSetting", e), e.authSetting["scope.userLocation"]) {
                            if (s.util.message("请在手机系统设置中打开定位服务，然后刷新本页面", "", "error"), "function" == typeof n) return n();
                        } else wx.showModal({
                            title: "系统提示",
                            content: "未获得定位权限，无法自动获取地理位置",
                            confirmText: "去授权",
                            success: function(e) {
                                if (e.confirm) wx.openSetting({
                                    success: function() {
                                        s.getLocation(n);
                                    }
                                }); else if ("function" == typeof a) return a();
                            }
                        });
                    }
                });
            }
        });
    },
    getThemeStyle: function() {
        var e = wx.getStorageSync("ThemeStyle");
        return e || {
            color: "orange",
            value: "#FA6400",
            gradual: "orange",
            home_top_style: !1,
            rgb: [ 250, 100, 0 ]
        };
    },
    toast: function(e) {
        var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "none";
        wx.showToast({
            title: e,
            icon: t
        });
    },
    getUploadUrl: function(e, t) {
        -1 == e.indexOf("http://") && -1 == e.indexOf("https://") && (e = this.util.url(e));
        var o = wx.getStorageSync("userInfo");
        if (o) {
            e += "&state=we7sid-" + o.sessionid;
            var n = this.util.getSign(e);
            if (n && (e += "&sign=" + n), t) for (var a in t) e += "&" + a + "=" + t[a];
            return e;
        }
        n = getCurrentPages(), n = n[n.length - 1];
        wx.navigateTo({
            url: "/pages/login/index?redirect=" + ("string" == typeof n ? encodeURIComponent(n) : "")
        });
    },
    uploadFile: function(t) {
        wx.showLoading({
            title: "上传中"
        }), wx.uploadFile({
            url: t.url,
            filePath: t.filePath,
            name: t.name,
            success: function(e) {
                wx.hideLoading(), console.log("wx.uploadFile", e);
                e = JSON.parse(e.data);
                41009 != e.errno ? _typeof(t.success) && t.success(e) : (e = (e = getCurrentPages())[e.length - 1], 
                wx.navigateTo({
                    url: "/pages/login/index?redirect=" + ("string" == typeof e ? encodeURIComponent(e) : "")
                }));
            },
            fail: function(e) {
                wx.hideLoading(), console.error("wx.uploadFile", e, t), _typeof(t.fail) && t.fail(e);
            }
        });
    },
    random: function(e) {
        e = e || 32;
        for (var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678", o = t.length, n = "", a = 0; a < e; a++) n += t.charAt(Math.floor(Math.random() * o));
        return n;
    }
});