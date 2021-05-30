var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
    return typeof e;
} : function (e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};

function _defineProperty(e, t, a) {
    return t in e ? Object.defineProperty(e, t, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = a, e;
}

var app = getApp(), qqmap_wx_jssdk = require("../../libs/qqmap-wx-jssdk.min.js");

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        SystemInfo: app.globalData.SystemInfo,
        AssetsUrl: app.globalData.AssetsUrl,
        siteInfo: app.siteInfo,
        Loading: !0,
        City: "全国",
        showRegionList: !1,
        showFilterFixed: !1,
        showFilterModal: !1,
        sortCur: "new",
        listStyleCur: "",
        CategoryIdCur: 0,
        CategoryScrollLeft: 0,
        CategoryList: [],
        FilterAreaList: [{
            title: "同城",
            value: "local_city"
        }, {
            title: "<500KM",
            value: 500
        }, {
            title: "<1000KM",
            value: 1e3
        }],
        FilterTimeList: [{
            title: "1天内",
            value: 1
        }, {
            title: "7天内",
            value: 7
        }, {
            title: "14天内",
            value: 14
        }, {
            title: "30天内",
            value: 30
        }],
        FilterTradeTypeList: [{
            title: "快递",
            value: 1
        }, {
            title: "自取",
            value: 2
        }, {
            title: "物流到付",
            value: 3
        }],
        FilterAreaCur: null,
        FilterTimeCur: null,
        FilterTradeTypeSelected: {
            0: !0,
            1: !0,
            2: !0
        },
        Keyword: "",
        PriceStart: 0,
        PriceEnd: 0,
        TradeType: [],
        SwiperCur: 0,
        SwiperList: [],
        ItemList: [],
        Page: 1,
        Paging: !1,
        showGoTop: !1,
        Audit: {
            open: !1
        },
        SoldImg: wx.getStorageSync("SoldImg") || app.globalData.AssetsUrl + "/yz.png",
        showWxad: !0,
        noticeList: [],
        searchPlaceholder: "",
        showIndexBannerSubscribeModal: !1,
        showNewMessageTips: !1
    },
    onLoad: function (e) {
        console.log("onLoad", e);
        var t = this;
        if (app.globalData.CustomBar <= 0) wx.reLaunch({
            url: "/pages/home/index"
        }); else {
            if (t.setData({
                options: e
            }), void 0 !== _typeof(e.redirect)) {
                var a = decodeURIComponent(e.redirect);
                if (-1 != a.indexOf("/pages/")) return void (void 0 !== _typeof(e.type) && "redirect" == e.type ? wx.redirectTo({
                    url: a
                }) : wx.navigateTo({
                    url: a
                }));
            }
            if (void 0 !== e.scene) {
                var o = decodeURIComponent(e.scene);
                if (console.log("scene", o), -1 != o.indexOf("itemid=")) return void wx.navigateTo({
                    url: "/pages/detail/index?id=" + o.replace("itemid=", "")
                });
                if (-1 != o.indexOf("share:")) {
                    o = o.replace("share:", "");
                    var a = parseInt(o), n = parseInt(o.replace(a + ":", ""));
                    return t.data.userInfo && t.data.userInfo.memberInfo.uid != a && wx.setStorageSync("ShareUid", a),
                        void wx.navigateTo({
                            url: "/pages/detail/index?id=" + n
                        });
                }
                if (-1 != o.indexOf("score:")) {
                    o = o.replace("score:", "");
                    n = parseInt(o);
                    return void wx.navigateTo({
                        url: "/pages/service/scoring?id=" + n
                    });
                }
                -1 != o.indexOf("livecode:") && (o = o.replace("livecode:", ""), o = parseInt(o),
                    app.util.request({
                        method: "POST",
                        url: "entry/wxapp/promote",
                        data: {
                            m: "superman_hand2",
                            act: "livecode",
                            livecode_id: o
                        },
                        showLoading: !1,
                        success: function (e) {
                            console.log(e);
                        },
                        fail: function (e) {
                            console.error(e);
                        }
                    }));
            }
            void 0 !== e.cid && t.setData({
                CategoryId: e.cid,
                CategoryScrollLeft: 0,
                Page: 1,
                Paging: !1,
                ItemList: [],
                Gone: !1
            });
            e = wx.getStorageSync("LocationInfo");
            console.log("locationInfo", e), t.setData({
                listStyleCur: wx.getStorageSync("ListStyle"),
                LoadingImg: wx.getStorageSync("LoadingImg"),
                locationInfo: e,
                containerPaddingBottom: t.getContainerPaddingBottom(t.data.showOfficialAccount),
                City: t.getCurrentCity(e)
            });
        }
    },
    onShow: function () {
        console.log("onShow");
        var e, t = this;
        wx.getStorageSync("userInfo") ? (t.setData({
            Page: 1
        }), wx.getStorageSync("RegionSelected") ? (wx.removeStorageSync("RegionSelected"),
            e = wx.getStorageSync("LocationInfo"), t.setData({
            locationInfo: e,
            City: t.getCurrentCity(e),
            Page: 1,
            Paging: !1,
            ItemList: []
        })) : void 0 !== t.data.options.scene || t.data.options.redirect, t.getIndexData(),
            t.getMessageCount(), app.viewCount(), app.chatroom.setReceiveMessage(t.receiveMessage)) : app.util.getUserInfo(function () {
            t.onShow();
        });
    },
    receiveMessage: function (e) {
        var t = this;
        console.log("receiveMessage", e), t.getMessageCount(function () {
            t.setData({
                showNewMessageTips: !0
            }), setTimeout(function () {
                t.setData({
                    showNewMessageTips: !1
                });
            }, 5e3);
        });
    },
    getMessageCount: function (t) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/message_count",
            data: {
                m: "superman_hand2",
                act: "display"
            },
            showLoading: !1,
            success: function (e) {
                console.log(e);
                e = e.data.data;
                a.setData({
                    NewMessage: e.all_message
                }), "function" == typeof t ? t() : 0 < a.data.NewMessage && setTimeout(function () {
                    a.setData({
                        showNewMessageTips: !0
                    }), setTimeout(function () {
                        a.setData({
                            showNewMessageTips: !1
                        });
                    }, 5e3);
                }, 13e3);
            },
            fail: function (e) {
                console.error(e), app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    getCurrentCity: function (e) {
        var t = this.data.City;
        if (!e) return t;
        switch (e.current) {
            case "nation":
                t = "全国";
                break;

            case "location":
                t = e.address_component.city;
                break;

            case "region":
                t = e.region.city.fullname;
        }
        return t;
    },
    getContainerPaddingBottom: function (e) {
        var t = 100;
        return e && (t += 84), t;
    },
    getLocation: function (a) {
        var o = this;
        wx.getLocation({
            type: "gcj02",
            success: function (e) {
                var t;
                console.info("wx.getLocation", e), o.data.locationInfo && o.data.locationInfo.location.lat == e.latitude && o.data.locationInfo.location.lng == e.longitude ? o.getIndexData() : (t = wx.getStorageSync("QQMAP_KEY")) ? new qqmap_wx_jssdk({
                    key: t
                }).reverseGeocoder({
                    location: e.latitude + "," + e.longitude,
                    success: function (e) {
                        console.log("qqmap.reverseGeocoder", e);
                        var t = e.result, e = {
                            current: "location",
                            location: {
                                lat: t.location.lat,
                                lng: t.location.lng
                            },
                            address: t.address
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
                        }), wx.setStorageSync("LocationInfo", e), o.setData({
                            locationInfo: e,
                            City: e && e.address_component.city || o.data.City
                        }), "function" == typeof a) return a();
                        o.getIndexData();
                    },
                    fail: function (e) {
                        console.warn("qqmap.reverseGeocoder", e), o.getIndexData();
                    }
                }) : app.toast("未设置腾讯地图密钥");
            },
            fail: function (e) {
                console.warn("wx.getLocation", e), wx.getSetting({
                    success: function (e) {
                        console.info("wx.getSetting", e), e.authSetting["scope.userLocation"] ? (app.util.message("请在手机系统设置中打开定位服务，然后下拉刷新本页面", "", "error"),
                            o.getIndexData()) : wx.showModal({
                            title: "系统提示",
                            content: "系统需要获取定位以便为您展示附近的信息",
                            confirmText: "去授权",
                            success: function (e) {
                                e.confirm ? wx.openSetting({
                                    success: function () {
                                        o.getLocation(a);
                                    }
                                }) : o.getIndexData();
                            }
                        });
                    }
                });
            }
        });
    },
    getIndexData: function (e) {
        var t = this;
        // t.loadBaseInfo(), t.data.CategoryId || setTimeout(function() {
        //     t.loadItemInfo(e);
        // }, 500);
        t.loadBaseInfo(), t.data.CategoryId || t.loadItemInfo(e);
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
                n.towerSwiper(t.slide_list);
                var o, e = (e = n.data.listStyleCur) || (1 == t.list_type ? "single" : "double");
                n.setData({
                    Title: "" != t.title ? t.title : "超人二手市场",
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
    loadItemInfo: function (e) {
        var s = this, t = s.data.locationInfo, a = "";
        null !== s.data.FilterAreaCur && (a = s.data.FilterAreaList[s.data.FilterAreaCur].value);
        var o = s.getCurrentCity(t);
        "全国" == o && (o = ""), console.log("area_value", a), s.data.ShowLocation || "local_city" == a || (o = "");
        o = {
            m: "superman_hand2",
            act: "item_list",
            page: s.data.Page,
            keyword: s.data.Keyword,
            sort: s.data.sortCur,
            cid: s.data.CategoryIdCur,
            price_start: s.data.PriceStart,
            price_end: s.data.PriceEnd,
            area: a,
            post_time: null !== s.data.FilterTimeCur ? s.data.FilterTimeList[s.data.FilterTimeCur].value : "",
            trade_type: s.data.TradeType.join(","),
            lat: t && t.location.lat || "",
            lng: t && t.location.lng || "",
            city: o,
            list_style: s.data.listStyleCur
        };
        s.data.homeShowCredit || (o.is_credit = 0), app.util.request({
            url: "entry/wxapp/index",
            data: o,
            showLoading: !1,
            success: function (e) {
                console.log(e);
                for (var t = e.data.data, a = void 0 !== t.item_list && !t.item_list.length, o = t.item_list || [], n = 0; n < o.length; n++) {
                    var i = app.formatPrice(o[n], t.currency_info.symbol);
                    o[n]._price = i, 0 == o[n].buy_type && 0 < o[n].price && (r = i.split("."), o[n]._price_integer = parseInt(r[0].substr(1)),
                        o[n]._price_decimal = void 0 !== r[1] ? r[1] : "00");
                    var r = o[n].province;
                    r && "省" == r.substr(r.length - 1, 1) && (o[n].province = r.substr(0, r.length - 1));
                    r = o[n].city;
                    r && "市" == r.substr(r.length - 1, 1) && (o[n].city = r.substr(0, r.length - 1));
                }
                s.data.Audit.open && (o.splice(1, o.length - 1), a = !0), s.setData((_defineProperty(e = {
                    Loading: !1
                }, "ItemList[" + (s.data.Page - 1) + "]", o), _defineProperty(e, "Gone", a), _defineProperty(e, "currencyInfo", t.currency_info),
                    e));
            },
            fail: function (e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    onPullDownRefresh: function () {
        this.setData({
            Page: 1,
            Paging: !1,
            ItemList: [],
            Gone: !1,
            showWxad: !0
        }), this.getIndexData(), wx.stopPullDownRefresh();
    },
    onPageScroll: function (e) {
        var t, a = this;
        a.data.ItemList.length && a.data.ItemList[0].length <= 4 ? a.setData({
            showFilterFixed: !1,
            showGoTop: !1
        }) : (t = a.data.CubeInfo.open && "" == a.data.Keyword ? a.data.ShowCategory ? 278 : 230 : 100,
        a.data.noticeList && a.data.noticeList.length && (t += 40), a.data.Plugin.tide && a.data.Plugin.tide.enable && 1 == a.data.Plugin.tide.config.switch && (t += 70));
        if (e.scrollTop >= t && a.data.showFilterFixed === false) {
            a.setData({
                showFilterFixed: true,
                showGoTop: true
            })
        }
        if (e.scrollTop < t && a.data.showFilterFixed === true) {
            a.setData({
                showFilterFixed: false,
                showGoTop: false
            })
        }

    },
    onReachBottom: function () {
        this.data.Gone || (this.setData({
            Page: this.data.Page + 1,
            Paging: !0
        }), this.getIndexData(!0));
    },
    selectRegion: function (e) {
        var t = this;
        if (!t.data.locationInfo) return t.setData({
            Page: 1,
            Paging: !1,
            ItemList: []
        }), void t.getLocation();
        t.setData({
            showRegionList: !t.data.showRegionList
        });
    },
    selectLocationRegion: function (e) {
        var t = wx.getStorageSync("LocationInfo");
        t.current = "location", this.setData({
            locationInfo: t,
            showRegionList: !1,
            City: this.getCurrentCity(t),
            Page: 1,
            Paging: !1
        }), wx.setStorageSync("LocationInfo", t), this.loadItemInfo();
    },
    changeRegion: function (e) {
        this.setData({
            showRegionList: !1
        }), wx.navigateTo({
            url: "/pages/region/index"
        });
    },
    selectNation: function (e) {
        var t = wx.getStorageSync("LocationInfo");
        t.current = "nation", this.setData({
            locationInfo: t,
            showRegionList: !1,
            City: this.getCurrentCity(t),
            Page: 1,
            Paging: !1
        }), wx.setStorageSync("LocationInfo", t), this.loadItemInfo();
    },
    doSearch: function (e) {
        this.setData({
            Keyword: e.detail.value,
            Page: 1,
            Paging: !1,
            ItemList: []
        }), this.loadItemInfo();
    },
    tabSelectCategory: function (e) {
        this.data.CategoryIdCur != e.currentTarget.dataset.id && (this.setData({
            CategoryId: 0,
            CategoryIdCur: e.currentTarget.dataset.id,
            CategoryScrollLeft: 60 * (e.currentTarget.dataset.index - 1),
            Page: 1,
            Paging: !1,
            ItemList: [],
            Gone: !1
        }), this.loadItemInfo());
    },
    switchSort: function (e) {
        var t = this, a = e.currentTarget.dataset.value;
        "location" != a || t.data.locationInfo ? (t.setData({
            sortCur: a,
            Page: 1,
            Paging: !1,
            ItemList: [],
            Gone: !1
        }), t.loadItemInfo()) : t.getLocation(function () {
            t.switchSort(e);
        });
    },
    switchListStyle: function (e) {
        var t = "double" == this.data.listStyleCur ? "single" : "double";
        this.setData({
            listStyleCur: t
        }), wx.setStorageSync("ListStyle", t), this.setData({
            Page: 1,
            Paging: !1,
            ItemList: [],
            Gone: !1
        }), this.loadItemInfo();
    },
    showFilterModal: function (e) {
        this.setData({
            showFilterModal: !0
        });
    },
    hideFilterModal: function (e) {
        "self" == e.target.dataset.from && this.setData({
            showFilterModal: !1
        });
    },
    resetFilterModal: function (e) {
        this.setData({
            FilterAreaCur: null,
            FilterTimeCur: null,
            FilterTradeTypeSelected: {
                0: !0,
                1: !0,
                2: !0
            }
        });
    },
    submitFilterModal: function (e) {
        var t = this, a = [];
        t.data.FilterTradeTypeSelected[0] && a.push(t.data.FilterTradeTypeList[0].value),
        t.data.FilterTradeTypeSelected[1] && a.push(t.data.FilterTradeTypeList[1].value),
        t.data.FilterTradeTypeSelected[2] && a.push(t.data.FilterTradeTypeList[2].value),
            a.length ? (t.setData({
                showFilterModal: !1,
                PriceStart: e.detail.value.price_start,
                PriceEnd: e.detail.value.price_end,
                TradeType: a,
                Page: 1,
                Paging: !1,
                ItemList: [],
                Gone: !1
            }), t.loadItemInfo()) : app.util.message("取件方式至少选择一个", "", "error");
    },
    switchFilterArea: function (e) {
        this.data.locationInfo ? this.setData({
            FilterAreaCur: e.currentTarget.dataset.index
        }) : this.getLocation();
    },
    switchFilterTime: function (e) {
        this.setData({
            FilterTimeCur: e.currentTarget.dataset.index
        });
    },
    switchFilterFetch: function (e) {
        e = e.currentTarget.dataset.index;
        this.data.FilterTradeTypeSelected[e] = !this.data.FilterTradeTypeSelected[e], this.setData({
            FilterTradeTypeSelected: this.data.FilterTradeTypeSelected
        });
    },
    cardSwiper: function (e) {
        this.setData({
            SwiperCur: e.detail.current
        });
    },
    towerSwiper: function (e) {
        if (e.length) {
            for (var t = 0; t < e.length; t++) e[t].zIndex = parseInt(e.length / 2) + 1 - Math.abs(t - parseInt(e.length / 2)),
                e[t].mLeft = t - parseInt(e.length / 2);
            this.setData({
                SwiperList: e
            });
        }
    },
    towerStart: function (e) {
        this.setData({
            towerStart: e.touches[0].pageX
        });
    },
    towerMove: function (e) {
        this.setData({
            direction: 0 < e.touches[0].pageX - this.data.towerStart ? "right" : "left"
        });
    },
    towerEnd: function (e) {
        var t = this.data.direction, a = this.data.SwiperList;
        if ("right" == t) {
            for (var o = a[0].mLeft, n = a[0].zIndex, i = 1; i < a.length; i++) a[i - 1].mLeft = a[i].mLeft,
                a[i - 1].zIndex = a[i].zIndex;
            a[a.length - 1].mLeft = o, a[a.length - 1].zIndex = n, this.setData({
                SwiperList: a
            });
        } else {
            for (var o = a[a.length - 1].mLeft, n = a[a.length - 1].zIndex, r = a.length - 1; 0 < r; r--) a[r].mLeft = a[r - 1].mLeft,
                a[r].zIndex = a[r - 1].zIndex;
            a[0].mLeft = o, a[0].zIndex = n, this.setData({
                SwiperList: a
            });
        }
    },
    goTop: function (e) {
        app.superman.goTop(e);
    },
    toPage: function (e) {
        app.superman.toPage(e);
    },
    clickCubeAd: function (e) {
        var t = this;
        app.util.request({
            method: "POST",
            url: "entry/wxapp/index",
            data: {
                m: "superman_hand2",
                act: "click_cube_ad",
                id: e.currentTarget.dataset.id
            },
            showLoading: !0,
            complete: function () {
                t.toPage(e);
            },
            fail: function (e) {
                console.error(e);
            }
        });
    },
    clickBanner: function (e) {
        this.data.IndexBanner.subscribe ? this.downloadIndexBannerSubscribeImage() : this.toPage(e);
    },
    hideIndexBannerSubscribeModal: function () {
        this.setData({
            showIndexBannerSubscribeModal: !1
        });
    },
    downloadIndexBannerSubscribeImage: function (e) {
        var t = this;
        t.setData({
            disabled: !0
        }), wx.downloadFile({
            url: t.data.IndexBanner.subscribe,
            complete: function () {
                t.setData({
                    disabled: !1
                });
            },
            success: function (e) {
                200 === e.statusCode ? (t.setData({
                    showIndexBannerSubscribeModal: !0
                }), t.saveIndexBannerSubscribeImage(e.tempFilePath)) : app.util.message(e.errMsg, "", "error");
            },
            fail: function (e) {
                console.error(e);
            }
        });
    },
    saveIndexBannerSubscribeImage: function (t) {
        var a = this;
        wx.saveImageToPhotosAlbum({
            filePath: t,
            success: function (e) {
                app.util.message("保存成功，请打开微信扫一扫保存的图片，关注我们", "", "error");
            },
            fail: function (e) {
                console.error(e), app.superman.checkAuthorize("scope.saveImageToPhotosAlbum", function (e) {
                    console.log(e), e.confirm && a.saveIndexBannerSubscribeImage(t);
                }, "提示", "很抱歉，您没有授权小程序保存图片的权限。请再次尝试保存操作，选择允许。");
            }
        });
    },
    toDetail: function (e) {
        e = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/detail/index?id=" + e
        });
    },
    cancelSearch: function (e) {
        this.setData({
            Keyword: ""
        }), this.setData({
            Page: 1,
            Paging: !1,
            ItemList: [],
            Gone: !1
        }), this.loadItemInfo();
    },
    onShareAppMessage: function (e) {
        var t = {
            title: this.data.shareInfo.title,
            imageUrl: this.data.shareInfo.imgUrl
        };
        return console.log("onShareAppMessage", t), t;
    },
    onShareTimeline: function () {
        var e = {
            title: this.data.shareInfo.title,
            imageUrl: this.data.shareInfo.imgUrl,
            query: "share=timeline"
        };
        return console.log("onShareTimeline", e), e;
    },
    WxadError: function (e) {
        console.error("WxadError", e), this.setData({
            showWxad: !1
        });
    },
    clickNotice: function (e) {
        var t = e.detail.url;
        t ? wx.navigateTo({
            url: t
        }) : app.util.Dialog.confirm({
            title: "公告",
            message: e.detail.title,
            showCancelButton: !1,
            confirmButtonText: "好的，知道了",
            confirmButtonColor: "bg-gradual-" + this.data.ThemeStyle.gradual,
            asyncClose: !0
        }).then(function () {
            app.util.Dialog.close();
        }).catch(function () {
            app.util.Dialog.close();
        });
    }
});