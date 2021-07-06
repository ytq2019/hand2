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
        tabBar: app.globalData.tabBar,
        selectstatus: "",
        dropdown: !1,
        isVip: 0,
        Title: "查库房",
        keyword: ""
    },
    onLoad: function (t) {
        this.loadBaseInfo();
        this.getArea();
        var t = this;
        if (!wx.getStorageSync("userInfo")) {
            app.util.getUserInfo(function () {
                t.onLoad();
            });
        } else {
            t.setData({
                ThemeStyle: app.getThemeStyle(),
                userInfo: wx.getStorageSync("userInfo"),
                AppName: wx.getStorageSync("AppName"),
                SoldImg: wx.getStorageSync("SoldImg") || app.globalData.AssetsUrl + "/yz.png"
            }, function () {
                // t.getVip();
                // t.shopdata();
                t.getVipAndShopData();
            });
        }

    },
    onShow: function () {
        this.getVip();
    },
    onShareAppMessage: function (e) {
        var t = {
            title: this.data.shareInfo.title,
            imageUrl: this.data.shareInfo.imgUrl
        };
        return console.log("onShareAppMessage", t), t;
    },
    loadBaseInfo: function () {
        var n = this, e = n.data.locationInfo;
        app.util.request({
            url: "entry/wxapp/index",
            data: {
                m: "superman_hand2",
                act: "display",
                lat: e && e.location.lat || "",
                lng: e && e.location.lng || ""
            },
            cacheTime: 1500,
            showLoading: !1,
            success: function (e) {
                console.log(e);
                var t = e.data.data, a = t.plugin || {};
                // n.towerSwiper(t.slide_list);
                var o, e = (e = n.data.listStyleCur) || (1 == t.list_type ? "single" : "double");
                n.setData({
                    Logo: "" != t.logo ? t.logo : n.data.AssetsUrl + "/../icon.jpg",
                    ThemeStyle: t.theme_style || app.getThemeStyle(),
                    ShowCategory: t.show_category,
                    CategoryList: t.category_list || [],
                    ShowLocation: t.show_location,
                    PostTime: t.post_time,
                    SoldImg: t.sold_img || n.data.SoldImg,
                    ServiceInfo: t.service_info || {},
                    CubeInfo: t.cube_info || {},
                    IndexBanner: t.index_banner || {},
                    Plugin: a,
                    FloatBtn: t.float_btn || {},
                    Audit: t.audit || {},
                    NewMessage: t.new_message,
                    ShowPageView: t.show_page_view,
                    listStyleCur: e,
                    LoadingImg: t.loading_img || n.data.AssetsUrl + "/loading.gif",
                    WxadInfo: t.wxad_info,
                    noticeList: t.notice_list,
                    searchPlaceholder: t.search_placeholder,
                    imagePopup: t.image_popup || "",
                    homeShowCredit: 1 == t.home_show_credit,
                    shareInfo: t.share_info,
                    currencyInfo: t.currency_info,
                    doubleStyleRight: t.double_style_right,
                    showSinglePrice: t.show_single_price,
                    showSingleDesc: t.show_single_desc
                }), n.data.CategoryId && n.data.CategoryList && (o = 0, n.data.CategoryList.forEach(function (e, t) {
                    if (e.id == n.data.CategoryId) return o = 60 * (t - 1), !1;
                }), n.setData({
                    CategoryIdCur: n.data.CategoryId,
                    CategoryScrollLeft: o,
                    Page: 1,
                    Paging: !1,
                    ItemList: [],
                    Gone: !1
                }), n.loadItemInfo()), n.data.ThemeStyle.home_top_style || wx.setNavigationBarColor({
                    backgroundColor: "#ffffff",
                    frontColor: "#000000"
                }), app.globalData.LogoUrl = n.data.Logo, wx.setStorageSync("Logo", n.data.Logo),
                    wx.setStorageSync("ThemeStyle", n.data.ThemeStyle), wx.setStorageSync("Plugin", n.data.Plugin),
                    wx.setStorageSync("Audit", n.data.Audit), wx.setStorageSync("AppName", n.data.Title),
                    wx.setStorageSync("SoldImg", n.data.SoldImg), wx.setStorageSync("LoadingImg", n.data.LoadingImg),
                t.map_key && wx.setStorageSync("QQMAP_KEY", t.map_key);
            },
            fail: function (e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    getArea: function () {
        var i = this;
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
    },
    shopdata: function () {
        var a = this, t = wx.getStorageSync("openid");
        if (typeof (a.keyword) == "undefined" || a.keyword === '') {
            a.keyword = ""
        }
        app.util.request({
            url: "entry/wxapp/Shop",
            data: {
                m: "superman_hand2",
                act: "getShop",
                openid: t,
                title: a.keyword
            },
            success: function (t) {
                t.data.data.map(item => {
                    item.phone = a.desensitization(item.phone, 2, 7);
                    item.address = a.desensitization(item.address, 2, 7);
                    item.wechat = a.desensitization(item.wechat, 2, 5);
                });
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
                    t.data.data.map(item => {
                        item.phone = n.desensitization(item.phone, 2, 7);
                        item.address = n.desensitization(item.address, 2, 7);
                        item.wechat = n.desensitization(item.wechat, 2, 7);
                    });
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
    onPullDownRefresh: function () {
        console.log("下拉刷新");
        this.getVip();
        this.shopdata();
        this.setData({
            curIndex: 0,
            selectstatus: "",
            keyword: "",
            aid: 0,
        });
        wx.stopPullDownRefresh();
    },
    onReachBottom: function () {
        console.log("触发触底事件");
        this.getVip();
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
                    a.map(item => {
                        item.phone = e.desensitization(item.phone, 2, 7);
                        item.address = e.desensitization(item.address, 2, 7);
                        item.wechat = e.desensitization(item.wechat, 2, 7);
                    });

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
    max: function (e) {
        if (0 === this.data.isVip) {
            wx.showModal({
                title: "提示",
                content: "您还未购买临期宝VIP会员，终身会员仅需￥99元",
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: "/pages/member/index"
                        });
                    }
                }
            });
            return;
        }
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
        if (0 === this.data.isVip) {
            wx.showModal({
                title: "提示",
                content: "您还未购买临期宝VIP会员，终身会员仅需￥99元",
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: "/pages/member/index"
                        });
                    }
                }
            });
            return;
        }
        var a = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },
    copyshipnum: function (t) {
        if (0 === this.data.isVip) {
            wx.showModal({
                title: "提示",
                content: "您还未购买临期宝VIP会员，终身会员仅需￥99元",
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: "/pages/member/index"
                        });
                    }
                }
            });
            return;
        }
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
                console.log("获取店铺数据");
                t.data.data.map(item => {
                    item.phone = a.desensitization(item.phone, 2, 7);
                    item.address = a.desensitization(item.address, 2, 7);
                    item.wechat = a.desensitization(item.wechat, 2, 7);
                });
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
    getVip: function () {
        var a = this;
        var e = a.data.userInfo.memberInfo.uid;
        console.log(e), app.util.request({
            url: "entry/wxapp/demo",
            showLoading: !1,
            data: {
                m: "superman_hand2",
                act: "isVip2",
                uid: e
            },
            success: function (e) {
                console.log("获取vip数据啦");
                console.log(e);
                a.setData({
                    isVip: e.data.data.vip_type,
                });
            }
        });
    },
    getVipAndShopData: function () {
        var a = this;
        var e = a.data.userInfo.memberInfo.uid;
        console.log(e), app.util.request({
            url: "entry/wxapp/demo",
            showLoading: !1,
            data: {
                m: "superman_hand2",
                act: "isVip2",
                uid: e
            },
            success: function (e) {
                console.log("获取vip数据啦");
                console.log(e);
                a.setData({
                    isVip: e.data.data.vip_type,
                },function () {
                    var t = wx.getStorageSync("openid");
                    if (typeof (a.keyword) == "undefined" || a.keyword === '') {
                        a.keyword = ""
                    }
                    app.util.request({
                        url: "entry/wxapp/Shop",
                        data: {
                            m: "superman_hand2",
                            act: "getShop",
                            openid: t,
                            title: a.keyword
                        },
                        success: function (t) {
                            t.data.data.map(item => {
                                item.phone = a.desensitization(item.phone, 2, 7);
                                item.address = a.desensitization(item.address, 2, 7);
                                item.wechat = a.desensitization(item.wechat, 2, 5);
                            });
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




                });
            }
        });
    },
    desensitization: function (str, beginLen, endLen) {
        if (this.data.isVip === 0) {
            var firstStr = str.substr(0, beginLen);
            var lastStr = str.substr(endLen);
            let tempStr = firstStr + "****" + lastStr;
            return tempStr;
        }
        return str;
    },
    submitSearch: function () {
        this.setData({
            page: 1,
            shopList: [],
            page_near: 2,
        }, this.shopdata());

    },
    inputKeyword: function (t) {
        this.setData({
            keyword: t.detail.value
        });
    }

});
