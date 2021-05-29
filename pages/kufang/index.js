var app = getApp();

Page({
    data: {
        curIndex: 0,
        nav: ["推荐库房", "最新入驻"],
        shopList: [],
        rangeList: [],
        is_modal_Hidden: !0,
        page: 1,
        page_near: 1,
        lat: 0,
        lon: 0,
        aid: 0,
        store_id: 0,
        operation: [],
        showModalStatus: 0,
        tabBar: app.globalData.tabBar,
        selectstatus: "",
        dropdown: !1,
        adflashimg: []
    },
    onLoad: function (t) {
        var i = this;

        i.setData({
            userInfo: wx.getStorageSync("userInfo"),
            AppName: wx.getStorageSync("AppName"),
            ThemeStyle: app.getThemeStyle(),
            itemType: t.type,
            pageTitle: "查库房",
            SoldImg: wx.getStorageSync("SoldImg") || app.globalData.AssetsUrl + "/yz.png"
        })

        i.setData({
            options: t
        }), wx.setNavigationBarTitle({
            title: i.data.navTile
        });
        app.util.request({
            url: "entry/wxapp/area",
            data: {
                m: "superman_hand2",
                act: "getArea"
            },
            cachetime: "30",
            showLoading: !1,
            success: function (t) {
                for (var a = t.data.data, e = a.length, o = e % 5 == 0 ? e / 5 : Math.floor(e / 5 + 1), n = [], s = 0; s < o; s++) {
                    var r = a.slice(5 * s, 5 * s + 5);
                    n.push(r);
                }
                i.setData({
                    operation: n
                });
            }
        });
        i.shopdata();
    },
    onShow: function () {
        wx.hideHomeButton();
        var t = this, a = t.data.curIndex;
        var e = t.data.options;
        e.d_id && app.distribution.distribution_parsent(app, e.d_id);
    },
    gotoadinfo: function (t) {
        var a = t.currentTarget.dataset.tid, e = t.currentTarget.dataset.id;
        app.func.gotourl(app, a, e);
    },
    hidden: function (t) {
        this.setData({
            hidden: !0
        });
    },
    shopdata: function () {
        var a = this, t = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/Shop",
            data: {
                m: "superman_hand2",
                act: "getShop",
                openid: t
            },
            success: function (t) {
                if (t.data.data.length > 0) {
                    a.setData({
                        shopList: t.data.data,
                        page_near: a.data.page + 1
                    })
                } else {
                    wx.showToast({
                        title: "已经没有内容了哦！！！",
                        icon: "none"
                    })
                }
            }
        });
    },
    navTap: function (t) {
        var a, e, o = parseInt(t.currentTarget.dataset.index), n = this, s = wx.getStorageSync("openid"),
            c = n.data.curIndex;
        var typeid = c
        if (c == 0) {
            typeid = 1;
            n.setData({
                curIndex: 1
            })
        } else {
            typeid = 0;
            n.setData({
                curIndex: 0
            })
        }
        app.util.request({
            url: "entry/wxapp/Shop",
            cachetime: "30",
            data: {
                m: "superman_hand2",
                act: "getShop",
                typeid: typeid,
                aid: n.data.aid,
            },
            success: function (t) {
                console.log(t)
                if (t.data.data.length > 0) {
                    n.setData({
                        shopList: t.data.data,
                        page: 1,
                        page_near: 1
                    })
                } else {
                    wx.showToast({
                        title: "已经没有内容了哦！！！",
                        icon: "none"
                    })
                }
            }
        })
    },
    onHide: function () {
        this.setData({
            page: 1,
            page_near: 1
        });
    },
    onPullDownRefresh: function () {
        console.log("下拉刷新");
        this.shopdata();
        this.setData({
            curIndex: 0,
            selectstatus: "",
            searchCont: "",
            aid: 0,
        });
        wx.stopPullDownRefresh();
    },
    onReachBottom: function () {
        console.log("触发触底事件");
        var e = this, o = e.data.curIndex, t = wx.getStorageSync("openid"), a = e.data.aid, n = e.data.shopList,
            s = e.data.lat, r = e.data.lon;
        if (typeof (e.searchCont) == "undefined" || e.searchCont === '') {
            e.searchCont = ""
        }
        var bname = e.searchCont;
        app.util.request({
            url: "entry/wxapp/Shop",
            cachetime: "0",
            data: {
                m: "superman_hand2",
                act: "getShop",
                openid: t,
                typeid: o,
                lat: s,
                lon: r,
                page: e.data.page + 1,
                aid: a,
            },
            success: function (t) {
                if (t.data.data.length > 0) {
                    var a = t.data.data;
                    n = n.concat(a)
                    e.setData({
                        shopList: n,
                        page: e.data.page + 1
                    });
                } else {
                    wx.showToast({
                        title: "已经没有内容了哦！！！",
                        icon: "none"
                    })
                }
            }, fail: function (t) {
                wx.showToast({
                    title: "已经没有内容了哦！！！",
                    icon: "none"
                })
            }
        });
    },
    toMap: function(t) {
        var  f = t.currentTarget.dataset.address ,e = parseFloat(t.currentTarget.dataset.lat), t = parseFloat(t.currentTarget.dataset.lng);
        wx.openLocation({
            name: f,
            latitude: e,
            longitude: t,
            scale: 24
        });
    },
    dialogue: function (e) {
        var a = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },
    copyshipnum: function (t) {
        t = t.currentTarget.dataset.wechat;
        wx.setClipboardData({
            data: t
        }), wx.showModal({
            title: "系统提示",
            content: "已经复制卖家微信到剪贴板，请去微信添加好友与其联系吧",
            showCancel: !1
        });
    },
    toClassify: function (t) {
        var a = this, e = a.data.curIndex, o = wx.getStorageSync("openid"), n = t.currentTarget.dataset.id,
            s = a.data.lat, r = a.data.lon;
        a.setData({
            searchCont: "",
            aid: n,
        });
        app.util.request({
            url: "entry/wxapp/Shop",
            cachetime: "0",
            data: {
                m: "superman_hand2",
                act: "getShop",
                openid: o,
                typeid: e,
                lat: s,
                lon: r,
                aid: n
            },
            success: function (t) {
                console.log("获取店铺数据")
                a.setData({
                    shopList: t.data.data,
                    page_near: 1,
                    page: 1,
                })
            }
        });
    },
    toPage: function (t) {
        app.superman.toPage(t);
    },

});
