var app = getApp(), rewardedVideoAd = null;

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        AssetsUrl: app.globalData.AssetsUrl,
        Loading: !0,
        Page: 1,
        SortCur: "new",
        ItemList: [],
        categoryCur: null,
        scrollLeft: 0,
        categoryList: []
    },
    toPage: function(e) {
        app.superman.toPage(e);
    },
    goTop: function(e) {
        app.superman.goTop(e);
    },
    copy: function(e) {
        app.superman.copy(e);
    },
    onLoad: function(e) {
        console.log("onLoad", e);
        e = this;
        e.setData({
            userInfo: wx.getStorageSync("userInfo"),
            ThemeStyle: app.getThemeStyle()
        }), e.getCategoryData(), e.getIndexData(), e.getMyCredit(), e.getSettingData(), 
        app.viewCount();
    },
    onPageScroll: function(e) {
        this.setData({
            showGoTop: 500 <= e.scrollTop
        });
    },
    getCategoryData: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/category",
            data: {
                m: "superman_hand2",
                act: "credit",
                op: "lists"
            },
            showLoading: !0,
            success: function(e) {
                console.log(e);
                e = e.data.data;
                t.setData({
                    categoryList: e.list
                });
            },
            fail: function(e) {
                console.error(e), app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    getIndexData: function(i) {
        var s = this;
        app.util.request({
            url: "entry/wxapp/index",
            data: {
                m: "superman_hand2",
                act: "item_list",
                is_credit: 1,
                sort: s.data.SortCur,
                page: s.data.Page,
                credit_cid: s.getCreditCid()
            },
            showLoading: !0,
            success: function(e) {
                console.log(e);
                for (var t = e.data.data, e = void 0 !== t.item_list && !t.item_list.length, a = t.item_list || [], o = 0; o < a.length; o++) {
                    var r = app.formatPrice(a[o], t.currency_info.symbol);
                    a[o]._price = r, 0 == a[o].buy_type && 0 < a[o].price && (n = r.split("."), a[o]._price_integer = parseInt(n[0].substr(1)), 
                    a[o]._price_decimal = void 0 !== n[1] ? n[1] : "00");
                    var n = a[o].province;
                    n && "省" == n.substr(n.length - 1, 1) && (a[o].province = n.substr(0, n.length - 1));
                    n = a[o].city;
                    n && "市" == n.substr(n.length - 1, 1) && (a[o].city = n.substr(0, n.length - 1));
                }
                s.setData({
                    Loading: !1,
                    ItemList: void 0 !== i ? s.data.ItemList.concat(a) : a,
                    Gone: e,
                    currencyInfo: t.currency_info
                });
            },
            fail: function(e) {
                console.log(e), app.util.message(res.data.errmsg, "", "error");
            }
        });
    },
    getCreditCid: function() {
        var e = this;
        if (null === e.data.categoryCur) return -1;
        e = e.data.categoryList[e.data.categoryCur];
        return 1 == e.system ? -1 : e.id;
    },
    getMyCredit: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/my",
            data: {
                m: "superman_hand2",
                act: "credit"
            },
            showLoading: !1,
            success: function(e) {
                console.log(e);
                e = e.data.data;
                t.setData({
                    CreditInfo: e.credit_info,
                    WxadInfo: e.wxad_info
                }), t.data.CreditInfo.open ? t.data.userInfo && wx.createRewardedVideoAd && e.wxad_info.id && null === rewardedVideoAd && ((rewardedVideoAd = wx.createRewardedVideoAd({
                    adUnitId: e.wxad_info.id
                })).onLoad(function() {
                    console.log("rewardedVideoAd: onLoad event emit");
                }), rewardedVideoAd.onError(function(e) {
                    console.log("rewardedVideoAd: onError event emit", e);
                }), rewardedVideoAd.onClose(function(e) {
                    console.log("rewardedVideoA: onClose event emit", e), e && e.isEnded ? app.util.request({
                        method: "POST",
                        url: "entry/wxapp/my",
                        data: {
                            m: "superman_hand2",
                            act: "reward_video_ended",
                            look_id: t.data.videoInfo.look_id,
                            r: t.data.videoInfo.r,
                            t: t.data.videoInfo.t
                        },
                        showLoading: !0,
                        success: function(e) {
                            console.log(e);
                            e = e.data.data;
                            console.log("rewardedVideoAd: " + t.data.CreditInfo.title + "+" + e.credit_value), 
                            app.toast(t.data.CreditInfo.title + "+" + e.credit_value), setTimeout(function() {
                                t.getMyCredit();
                            }, 2e3);
                        },
                        fail: function(e) {
                            console.error(e), app.util.message(e.data.errmsg, "", "error");
                        }
                    }) : app.util.message("未看完视频，没有获得" + t.data.CreditInfo.title, "", "error");
                })) : app.util.message("未开启" + t.data.CreditInfo.title, "redirect:/pages/home/index", "error");
            },
            fail: function(e) {
                console.error(e), app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    getSettingData: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/exchange",
            data: {
                m: "superman_hand2",
                act: "setting"
            },
            showLoading: !0,
            success: function(e) {
                console.log(e);
                e = e.data.data;
                e.setting.share && 0 == e.setting.share.open && wx.hideShareMenu({
                    success: function(e) {
                        console.log(e);
                    },
                    fail: function(e) {
                        console.error(e);
                    }
                }), t.setData({
                    settingData: e.setting
                });
            },
            fail: function(e) {
                console.error(e), app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    onPullDownRefresh: function() {
        this.setData({
            Page: 1,
            ItemList: []
        }), this.getIndexData(), wx.stopPullDownRefresh();
    },
    onReachBottom: function(e) {
        this.data.Gone || (this.setData({
            Page: this.data.Page + 1,
            Paging: !0
        }), this.getIndexData(!0));
    },
    switchSort: function(e) {
        e = e.currentTarget.dataset.sort;
        e != this.data.SortCur && (this.setData({
            Page: 1,
            ItemList: [],
            SortCur: e
        }), this.getIndexData());
    },
    showVideoAd: function(e) {
        var t = this;
        app.util.request({
            url: "entry/wxapp/my",
            data: {
                m: "superman_hand2",
                act: "reward_video_apply"
            },
            showLoading: !0,
            success: function(e) {
                console.log(e);
                e = e.data.data;
                t.setData({
                    videoInfo: e.video_info
                }), rewardedVideoAd.show().catch(function() {
                    rewardedVideoAd.load().then(function() {
                        return rewardedVideoAd.show();
                    }).catch(function(e) {
                        console.log("激励视频 广告显示失败");
                    });
                });
            },
            fail: function(e) {
                console.error(e), app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    onShareAppMessage: function(e) {
        var t = {
            title: this.data.settingData.share.title || this.data.CreditInfo.title + "专区",
            path: "/pages/home/index?redirect=" + encodeURIComponent("/pages/exchange/index"),
            imageUrl: this.data.settingData.share.imgUrl || ""
        };
        return console.log("onShareAppMessage", t), t;
    },
    onShareTimeline: function() {
        var e = {
            title: this.data.settingData.share.title || this.data.CreditInfo.title + "专区",
            imageUrl: this.data.settingData.share.imgUrl || "",
            query: "share=timeline"
        };
        return console.log("onShareTimeline", e), e;
    },
    selectCategory: function(e) {
        this.setData({
            Page: 1,
            Paging: !1,
            Gone: !1,
            ItemList: [],
            categoryCur: e.currentTarget.dataset.index,
            scrollLeft: 60 * (e.currentTarget.dataset.index - 1)
        }), this.getIndexData();
    }
});