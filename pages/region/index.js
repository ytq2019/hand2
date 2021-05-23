var app = getApp(), Fuse = require("../../libs/fuse"), qqmap_wx_jssdk = require("../../libs/qqmap-wx-jssdk.min.js");

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        list: {},
        listCur: "",
        listCurID: "",
        boxTop: 0,
        movableY: 0,
        hidden: !0,
        showCityModal: !1,
        historyCityLength: 10,
        Loading: !0
    },
    onLoad: function(t) {
        this.setData({
            ThemeStyle: app.getThemeStyle()
        }), wx.showLoading(), wx.setStorageSync("RegionSelected", !1), this.initList(), 
        app.viewCount();
    },
    initList: function() {
        var r = this, l = wx.getStorageSync("CityList");
        if (l) return l.history = wx.getStorageSync("HistoryCityList") || [], r.setData({
            list: l,
            Loading: !1
        }), void wx.hideLoading();
        l = {
            history: wx.getStorageSync("HistoryCityList") || []
        };
        for (var t = 0; t < 26; t++) {
            var e = String.fromCharCode(65 + t);
            l[e] = [];
        }
        var i = wx.getStorageSync("QQMAP_KEY");
        i ? new qqmap_wx_jssdk({
            key: i
        }).getCityList({
            success: function(t) {
                console.log(t);
                for (var e, i = 0; i < t.result[1].length; i++) {
                    var n, a, s, o = t.result[1][i];
                    void 0 !== o.pinyin && (n = o.pinyin[0][0].toUpperCase(), a = r.getProvince(o.id, t.result[0]), 
                    s = r.getAllDistrict(o.id, t.result[2]), l[n].push({
                        id: o.id,
                        name: ("澳门半岛" == o.name ? a : o).name,
                        fullname: ("澳门半岛" == o.fullname ? a : o).fullname,
                        location: o.location,
                        province: a,
                        district: s,
                        pinyin: o.pinyin,
                        py_str: o.pinyin.join("")
                    }));
                }
                for (e in l) l[e].length || delete l[e];
                console.log(l), wx.setStorageSync("CityList", l), r.setData({
                    list: l,
                    Loading: !1
                }), wx.hideLoading();
            },
            fail: function(t) {
                console.error(t);
            }
        }) : app.toast("未设置腾讯地图密钥");
    },
    searchCity: function(t) {
        var e, i = this, t = t.detail.value, n = [];
        for (e in i.data.list) for (var a = 0; a < i.data.list[e].length; a++) {
            var s = i.data.list[e][a];
            n.push(s);
        }
        t = new Fuse(n, {
            threshold: 0,
            keys: [ "py_str", "fullname" ]
        }).search(t);
        console.log(t), t.length ? (t = t.splice(0, 10), i.setData({
            searchResult: t
        })) : i.setData({
            searchResult: []
        });
    },
    getProvince: function(t, e) {
        for (var i = t.substr(0, 2) + "0000", n = null, a = 0; a < e.length; a++) if (e[a].id == i) {
            delete (n = e[a]).cidx;
            break;
        }
        return n;
    },
    getAllCity: function(t, e) {
        for (var i, n = t.substr(0, 2), a = [], s = 0; s < e.length; s++) e[s].id.substr(0, 2) == n && (delete (i = e[s]).cidx, 
        a.push(i));
        return a;
    },
    getAllDistrict: function(t, e) {
        for (var i = t.substr(0, 4), n = [], a = 0; a < e.length; a++) e[a].id.substr(0, 4) == i && n.push(e[a]);
        return n;
    },
    getCurrentCity: function(t, e) {
        var i, n = {};
        for (i in e) {
            var a, s = e[i];
            for (a in s) if (s[a].id == t) {
                n = s[a];
                break;
            }
        }
        return n;
    },
    selectCity: function(t) {
        var e = t.currentTarget.dataset.cityId, t = t.currentTarget.dataset.districtId;
        console.log("cityId: " + e), console.log("districtId: " + t), this.setRegion(e, t), 
        this.setData({
            showCityModal: !1
        });
    },
    setRegion: function(t, e) {
        var i = this.getCurrentCity(t, this.data.list), t = wx.getStorageSync("LocationInfo");
        t.current = "region", t.region = {
            province: {
                id: i.province.id,
                name: i.province.name,
                fullname: i.province.fullname,
                location: i.province.location
            },
            city: {
                id: i.id,
                name: i.name,
                fullname: i.fullname,
                location: i.location
            }
        }, wx.setStorageSync("LocationInfo", t), wx.setStorageSync("RegionSelected", !0), 
        this.setHistory(t.region), wx.navigateBack();
    },
    setHistory: function(t) {
        var e = wx.getStorageSync("HistoryCityList") || [];
        if (e.length >= this.data.historyCityLength && e.pop(), e.length) for (var i = 0; i < e.length; i++) e[i].city.id == t.city.id && e.splice(i, 1);
        e.unshift(t), wx.setStorageSync("HistoryCityList", e);
    },
    onReady: function() {
        var e = this;
        setTimeout(function() {
            wx.createSelectorQuery().select(".indexBar-box").boundingClientRect(function(t) {
                e.setData({
                    boxTop: t.top
                });
            }).exec(), wx.createSelectorQuery().select(".indexes").boundingClientRect(function(t) {
                e.setData({
                    barTop: t.top
                });
            }).exec();
        }, 1e3);
    },
    getCur: function(t) {
        this.setData({
            hidden: !1,
            listCur: t.target.id
        });
    },
    setCur: function(t) {
        this.setData({
            hidden: !0
        });
    },
    tMove: function(t) {
        var e = t.touches[0].clientY, t = this.data.boxTop;
        t < e && (e = parseInt((e - t) / 20), t = Object.keys(this.data.list), this.data.listCur = t[e], 
        this.setData({
            listCur: t[e]
        }));
    },
    tStart: function(t) {
        this.setData({
            hidden: !1
        });
    },
    tEnd: function() {
        this.setData({
            hidden: !0,
            listCurID: this.data.listCur
        });
    }
});