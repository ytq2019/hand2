var app = getApp();

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        AssetsUrl: app.globalData.AssetsUrl,
        LogoUrl: app.globalData.LogoUrl,
        Loading: !0,
        Page: 1,
        Paging: !1,
        keyword: "",
        categoryId: 0,
        settingData: null,
        categoryData: [],
        itemList: [],
        categoryCur: 0,
        scrollLeft: 0,
        pageTitle: "定位中...",
        emptyMsg: "",
        location: null,
        poisList: [],
        showPoisModal: !1,
        locationStorageTimeout: 3e5,
        categoryFixed: !1,
        showDisplayorderList: !1,
        DisplayorderCur: ""
    },
    toPage: function(t) {
        app.superman.toPage(t);
    },
    goTop: function(t) {
        app.superman.goTop(t);
    },
    copy: function(t) {
        app.superman.copy(t);
    },
    onLoad: function(t) {
        console.log("onLoad", t);
        this.setData({
            AppName: wx.getStorageSync("AppName"),
            userInfo: wx.getStorageSync("userInfo"),
            ThemeStyle: app.getThemeStyle(),
            isFromFootnav: t.from && "footnav" == t.from
        }), this.getSettingData(), app.viewCount();
    },
    getLocation: function() {
        var a = this, t = wx.getStorageSync("PoisLocation");
        if (t && t.expiretime && t.expiretime > new Date().getTime()) return console.log("location cache ok"), 
        a.setData({
            Loading: !1,
            location: t.location,
            pageTitle: t.title,
            poisList: wx.getStorageSync("PoisList")
        }), void a.getCategoryData();
        app.getLocation(function() {
            var t, e = wx.getStorageSync("LocationInfo");
            if (e) {
                if (!e.pois && "中国" == e.nation) return wx.removeStorageSync("LocationInfo"), void a.getLocation();
                e.pois.length ? (a.setData({
                    poisList: e.pois,
                    location: e.location,
                    pageTitle: e.pois.length ? e.pois[0].title : a.data.pageTitle
                }), (t = new Date()).setTime(t.getTime() + a.data.locationStorageTimeout), e.pois[0].expiretime = t.getTime(), 
                wx.setStorageSync("PoisLocation", e.pois[0]), wx.setStorageSync("PoisList", e.pois), 
                console.log("getLocation: init", e)) : a.setData({
                    location: e.location,
                    pageTitle: e.address_component.street
                }), a.getCategoryData();
            }
        }, function() {
            a.setData({
                Loading: !1,
                emptyMsg: "未开启定位，无法获取数据。"
            });
        });
    },
    changeLocation: function(t) {
        var e = this;
        if (!wx.getStorageSync("LocationInfo")) return e.getLocation();
        e.setData({
            showPoisModal: !e.data.showPoisModal
        });
    },
    switchLocation: function(t) {
        var e = this, a = t.currentTarget.dataset.index, t = e.data.poisList[a];
        t.title != e.data.pageTitle && (e.setData({
            poisCur: a,
            pageTitle: t.title,
            location: t.location,
            showPoisModal: !1,
            Page: 1,
            Paging: !1,
            itemList: []
        }), wx.showLoading(), (a = new Date()).setTime(a.getTime() + e.data.locationStorageTimeout), 
        t.expiretime = a.getTime(), wx.setStorageSync("PoisLocation", t), e.getItemList());
    },
    refreshLocation: function(t) {
        wx.removeStorageSync("PoisLocation"), this.setData({
            showPoisModal: !1
        }), this.getLocation();
    },
    hidePoisModal: function(t) {
        this.setData({
            showPoisModal: !1
        });
    },
    inputKeyword: function(t) {
        this.setData({
            keyword: t.detail.value
        });
    },
    submitSearch: function() {
        this.setData({
            Page: 1,
            Paging: !1,
            itemList: []
        }), this.getItemList();
    },
    selectCategory: function(t) {
        var e = this, t = t.currentTarget.dataset.index;
        t != e.data.categoryCur && (e.setData({
            categoryCur: t,
            scrollLeft: 60 * (t - 1),
            Page: 1,
            Paging: !1,
            itemList: []
        }), e.getItemList());
    },
    join: function(t) {
        var e = this;
        wx.getStorageSync("userInfo") ? app.util.request({
            url: "entry/wxapp/service",
            data: {
                m: "superman_hand2",
                act: "is",
                op: "join"
            },
            showLoading: !0,
            success: function(t) {
                console.log(t);
                t = t.data.data.service_id ? "/pages/service/admin" : "/pages/service/add";
                wx.navigateTo({
                    url: t
                });
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        }) : app.util.getUserInfo(function() {
            e.join(t);
        });
    },
    getSettingData: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/service",
            data: {
                m: "superman_hand2",
                act: "setting"
            },
            showLoading: !0,
            success: function(t) {
                console.log(t);
                t = t.data.data;
                t.share && 0 == t.share.open && wx.hideShareMenu({
                    success: function(t) {
                        console.log(t);
                    },
                    fail: function(t) {
                        console.error(t);
                    }
                }), e.setData({
                    settingData: t,
                    DisplayorderCur: "" != t.default_order ? t.default_order : ""
                }), t.map_key && wx.setStorageSync("QQMAP_KEY", t.map_key), e.getLocation();
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    getCategoryData: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/service",
            data: {
                m: "superman_hand2",
                act: "category",
                op: "list"
            },
            showLoading: !1,
            success: function(t) {
                console.log(t);
                t = t.data.data;
                e.setData({
                    categoryData: t.list,
                    Page: 1,
                    Paging: !1,
                    itemList: []
                }), e.getItemList();
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    getItemList: function() {
        var e = this, t = e.data.categoryData[e.data.categoryCur], a = e.data.location;
        app.util.request({
            url: "entry/wxapp/service",
            data: {
                m: "superman_hand2",
                act: "lists",
                page: e.data.Page,
                keyword: e.data.keyword,
                cid: 1 != t.system ? t.id : "",
                lng: a ? a.lng : "",
                lat: a ? a.lat : "",
                sort: e.data.DisplayorderCur
            },
            showLoading: !0,
            success: function(t) {
                console.log(t);
                var a = t.data.data, t = e.data.itemList;
                a && (a.forEach(function(t, e) {
                    void 0 === a[e].show_desc && (a[e].show_desc = !1);
                }), t = t.concat(a)), e.setData({
                    Loading: !1,
                    itemList: t,
                    Gone: !a.length || a.length < 20,
                    emptyMsg: 1 != e.data.Page || a.length ? "" : e.data.settingData.no_data
                });
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    onPullDownRefresh: function() {
        this.setData({
            Page: 1,
            Paging: !1,
            itemList: []
        }), this.onLoad(), wx.stopPullDownRefresh();
    },
    onReachBottom: function(t) {
        this.data.Gone || (this.setData({
            Page: this.data.Page + 1,
            Paging: !0
        }), this.getItemList());
    },
    onPageScroll: function(t) {
        this.data.itemList.length < 5 || this.setData({
            categoryFixed: 50 <= t.scrollTop,
            showGoTop: 500 <= t.scrollTop
        });
    },
    showDisclaimerDialog: function(t) {
        var e = this;
        wx.getStorageSync("userInfo") ? t.currentTarget.dataset.isTimeout ? e.setData({
            showDisclaimerDialog: !0,
            clickServiceId: t.currentTarget.dataset.serviceId
        }) : e.getServicePhone(t.currentTarget.dataset.serviceId) : app.util.getUserInfo(function() {
            e.showDisclaimerDialog(t);
        });
    },
    hideDisclaimerDialog: function(t) {
        this.setData({
            showDisclaimerDialog: !1
        });
    },
    acceptDisclaimer: function(t) {
        var e = this;
        e.hideDisclaimerDialog(t), e.data.settingData.credit <= 0 ? e.getServicePhone(e.data.clickServiceId) : wx.showModal({
            title: "提示",
            content: "确认支付" + e.data.settingData.credit + e.data.settingData.credit_info.title + "吗？",
            success: function(t) {
                t.confirm && e.getServicePhone(e.data.clickServiceId);
            }
        });
    },
    getServicePhone: function(o) {
        var e = this;
        app.util.request({
            method: "POST",
            url: "entry/wxapp/service",
            data: {
                m: "superman_hand2",
                act: "get",
                op: "phone",
                service_id: o
            },
            showLoading: !0,
            success: function(t) {
                console.log(t);
                var t = t.data.data, a = e.data.itemList;
                a.forEach(function(t, e) {
                    if (t.id == o) return a[e].is_timeout = !1;
                }), e.setData({
                    itemList: a
                }), wx.makePhoneCall({
                    phoneNumber: t.phone
                });
            },
            fail: function(t) {
                console.error(t), 20 != t.data.errno ? app.util.message(t.data.errmsg, "", "error") : e.setData({
                    showCreditTipsDialog: !0
                });
            }
        });
    },
    hideCreditTipsDialog: function(t) {
        this.setData({
            showCreditTipsDialog: !1
        });
    },
    showDesc: function(t) {
        var e = t.currentTarget.dataset.index, t = this.data.itemList;
        t[e].show_desc = !t[e].show_desc, this.setData({
            itemList: t
        });
    },
    showDisplayorderList: function(t) {
        this.setData({
            showDisplayorderList: !this.data.showDisplayorderList
        });
    },
    switchDisplayorder: function(t) {
        this.setData({
            showDisplayorderList: !1,
            DisplayorderCur: t.currentTarget.dataset.value,
            Page: 1,
            Paging: !1,
            itemList: []
        }), this.getItemList();
    },
    onShareAppMessage: function() {
        var t = {
            title: this.data.settingData.share.title || this.data.AppName,
            path: "/pages/home/index?redirect=" + encodeURIComponent("/pages/service/list"),
            imageUrl: this.data.settingData.share.imgUrl || ""
        };
        return console.log("onShareAppMessage", t), t;
    },
    onShareTimeline: function() {
        var t = {
            title: this.data.settingData.share.title || this.data.AppName,
            imageUrl: this.data.settingData.share.imgUrl || "",
            query: "share=timeline"
        };
        return console.log("onShareTimeline", t), t;
    }
});