var app = getApp();

Page({
    data: {
        Title: "查库房",
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
                a.setData({
                    shopList: t.data.data,
                    page_near: a.data.page + 1
                })

            }
        });
    },
    navTap: function (t) {
        var a, e, o = parseInt(t.currentTarget.dataset.index), n = this, s = wx.getStorageSync("openid"),
            r = n.data.store_id;
        n.data.selectstatus;
        app.util.request({
            url: "entry/wxapp/Shop",
            cachetime: "30",
            data: {
                m: "superman_hand2",
                act: "getShop"
            },
            success: function (t) {
                if (console.log("获取店铺数据"), console.log(t.data), 2 == t.data) {
                    n.setData({
                        goodsList: []
                    });
                } else {
                    t.data.map(item => {
                        item.phone = n.desensitization(item.phone, 3, 7);
                        item.address = n.desensitization(item.address, 3, 7);
                        item.wechat = n.desensitization(item.wechat, 1, 5);
                    });
                    n.setData({
                        goodsList: t.data,
                        page: 1
                    });
                }
            }
        })
        n.setData({
            curIndex: o,
            selectstatus: "",
            searchCont: "",
        });
    },
    toShop: function (t) {
        var a = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "../index/shop/shop?id=" + a
        });
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
            cate_id: 0,
            curIndex: 0,
            selectstatus: "",
            searchCont: ""
        });
        wx.stopPullDownRefresh();
    },
    onReachBottom: function () {
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
                bname: bname,
            },
            success: function (t) {
                console.log("获取店铺数据");
                if (0 !== t.data.errno) {
                    wx.showToast({
                        title: "已经没有内容了哦！！！",
                        icon: "none"
                    })
                } else {
                    var a = t.data.data;
                    n = n.concat(a)
                    e.setData({
                        shopList: n,
                        page: e.data.page + 1
                    });

                }
            }
        });
    },
    max: function (e) {
        var a = e.currentTarget.dataset.address, t = Number(e.currentTarget.dataset.longitude),
            i = Number(e.currentTarget.dataset.latitude);
        if (0 == t && 0 == i) return wx.showToast({
            title: "该地址有问题，可能无法显示~",
            icon: "none",
            duration: 1e3
        }), !1;
        wx.openLocation({
            name: a,
            latitude: i,
            longitude: t,
            scale: 18,
            address: a
        });
    },
    dialogue: function (e) {
        var a = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },
    copyshipnum: function (e) {
        var a = e.currentTarget.dataset.wechat;
        wx.setClipboardData({
            data: a,
            success: function (e) {
                wx.showToast({
                    title: "复制成功！",
                    icon: "none",
                    duration: 2e3
                });
            }
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

});