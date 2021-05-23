var app = getApp(), chooseLocation = requirePlugin("chooseLocation");

Page({
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        AssetsUrl: app.globalData.AssetsUrl,
        isAgree: !0,
        video: [],
        video_thumb: "",
        album: [],
        thumb: [],
        submitLoading: !1,
        item_id: 0,
        TradeTypeCur: [],
        SellRegion: "city",
        showFreeShip: !1,
        showBottomPopup: !1,
        form_field: [],
        chooseLocation: {
            address: "",
            lat: "",
            lng: "",
            province: "",
            city: ""
        },
        MapKey: "",
        WxadInfo: {
            id: "",
            type: ""
        },
        descMaxLength: 500,
        descCurLength: 0,
        cateIndex: null
    },
    onLoad: function(e) {
        console.log("onLoad", e);
        var a = this, t = wx.getStorageSync("userInfo");
        if (!t) {
            var o = "/pages/post/index";
            return a.data.item_id && (o += "?id=" + a.data.item_id), void wx.redirectTo({
                url: "/pages/login/index?redirect=" + encodeURIComponent(o)
            });
        }
        app.getLocation(function() {
            var e, t = wx.getStorageSync("LocationInfo");
            t && (e = {
                address: t.address,
                lat: t.location.lat,
                lng: t.location.lng,
                province: t.address_component.province,
                city: t.address_component.city
            }, a.setData({
                locationInfo: t,
                chooseLocation: e
            }), console.log("chooseLocation: init", t, e));
        }), a.setData({
            Audit: wx.getStorageSync("Audit"),
            PostInfo: wx.getStorageSync("PostInfo"),
            userInfo: t,
            ThemeStyle: app.getThemeStyle(),
            item_id: e.id || 0
        }), a.checkLogin(), a.getBasicInfo(), app.viewCount();
    },
    onShow: function() {
        var e, t = chooseLocation.getLocation();
        t && (e = {
            address: t.address,
            lat: t.latitude,
            lng: t.longitude,
            province: t.province,
            city: t.city
        }, this.setData({
            chooseLocation: e
        }), console.log("chooseLocation", t, e)), this.data.needMobile && wx.showModal({
            title: "系统提示",
            content: "发布物品前需先绑定手机号",
            showCancel: !1,
            success: function() {
                wx.redirectTo({
                    url: "/pages/bind_phone/index?redirect=" + encodeURIComponent("/pages/post/index")
                });
            }
        });
    },
    checkLogin: function() {
        var e = this;
        wx.getStorageSync("userInfo") || app.util.getUserInfo(function() {
            e.checkLogin();
        });
    },
    getBasicInfo: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/post",
            data: {
                m: "superman_hand2",
                act: "display"
            },
            showLoading: !0,
            success: function(e) {
                console.log(e);
                e = e.data.data;
                if (e.need_mobile) return t.setData({
                    needMobile: !0
                }), void wx.showModal({
                    title: "系统提示",
                    content: "发布前需绑定手机号",
                    showCancel: !1,
                    success: function() {
                        wx.redirectTo({
                            url: "/pages/bind_phone/index?redirect=" + encodeURIComponent("/pages/post/index")
                        });
                    }
                });
                t.setData({
                    needMobile: !1
                }), t.setData({
                    recycleOpen: !(!e.recycle || !e.recycle.open),
                    MapKey: e.map_key,
                    ItemRefresh: !!e.item_refresh,
                    WxadInfo: e.wxad_info,
                    currencyInfo: e.currency_info,
                    postTitlePlaceholder: e.post_title_placeholder,
                    postDescPlaceholder: e.post_desc_placeholder
                }), wx.setStorageSync("ItemRefresh", t.data.ItemRefresh), t.getMoreInfo();
            },
            fail: function(e) {
                console.error(e), 22 != e.data.errno && 34 != e.data.errno || app.util.message(e.data.errmsg, "redirect:/pages/home/index", "error"), 
                app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    getMoreInfo: function() {
        var r = this;
        app.util.request({
            url: "entry/wxapp/item",
            data: {
                act: "get",
                m: "superman_hand2"
            },
            success: function(e) {
                var t = e.data.data;
                if (!r.data.item_id) {
                    var a = t.add_fields || [];
                    if (a) for (var o = 0; o < a.length; o++) if ("radio" == a[o].type || "checkbox" == a[o].type) {
                        for (var i = a[o].extra.option, n = [], s = 0; s < i.length; s++) n[s] = new Object(), 
                        n[s].value = i[s], n[s].checked = !1;
                        a[o].extra.option = n;
                    } else "single_select" == a[o].type && (a[o].extra.value = "");
                    r.setData({
                        form_field: a
                    }), console.log("fields", a);
                }
                e = t.shop;
                r.setData({
                    video_switch: t.video_switch,
                    category: t.category,
                    rule: "" != t.rule ? app.superman.formatRichText(t.rule) : "",
                    rule_title: t.rule_title,
                    notice: "" != t.notice ? app.superman.formatRichText(t.notice) : "",
                    notice_title: t.notice_title,
                    auditType: t.audit_type,
                    notice_switch: 1 == t.post_notice,
                    showTrade: 0 == t.show_trade,
                    set_top: 1 == t.set_top,
                    post_pay: t.post_pay,
                    post_money: t.post_money,
                    blackListLimit: t.blacklist_limit,
                    CreditInfo: t.credit_info,
                    shop: e,
                    completed: !r.data.item_id,
                    ShowLocation: t.show_location,
                    helpSell: t.help_sell
                }), r.data.item_id && r.getEditData(r.data.item_id);
            },
            fail: function(e) {
                console.error(e), r.setData({
                    completed: !0
                }), app.util.message(res.data.errmsg, "", "error");
            }
        });
    },
    showPopup: function() {
        this.setData({
            showBottomPopup: !0
        });
    },
    toggleBottomPopup: function() {
        this.setData({
            showBottomPopup: !this.data.showBottomPopup
        });
    },
    getEditData: function(e) {
        var u = this;
        app.util.request({
            url: "entry/wxapp/item",
            cachetime: "0",
            data: {
                act: "edit",
                id: e,
                m: "superman_hand2"
            },
            success: function(e) {
                var t = e.data.data;
                if (2 == t.status) return app.util.message("物品已转让,", "", "error"), void wx.redirectTo({
                    url: "/pages/home/index"
                });
                for (var a = u.data.category, o = 0; o < a.length; o++) if (a[o].id == t.cid) {
                    u.setData({
                        cateIndex: o
                    });
                    break;
                }
                var i = t.video || [], n = t.add_fields || [];
                if (n) for (var s = 0; s < n.length; s++) if ("radio" == n[s].type || "checkbox" == n[s].type) {
                    for (var r = n[s].value, d = n[s].extra.option, c = [], l = 0; l < d.length; l++) {
                        c[l] = new Object(), c[l].value = d[l], c[l].checked = !1;
                        for (var p = 0; p < r.length; p++) if (c[l].value == r[p]) {
                            c[l].checked = !0;
                            break;
                        }
                    }
                    n[s].extra.option = c;
                }
                e = [];
                1 == t.trade_type1 && e.push(1), 1 == t.trade_type2 && e.push(2), 1 == t.trade_type3 && e.push(3), 
                1 == t.free_ship && e.push("free_ship"), u.setData({
                    detail: t,
                    album: t.album,
                    thumb: t.thumb,
                    video: i,
                    price: 0 == t.buy_type ? t.price : t.credit,
                    original_price: 0 == t.buy_type ? t.original_price : 0,
                    open_wechat: !0,
                    form_field: n,
                    TradeType1: 1 == t.trade_type1,
                    TradeType2: 1 == t.trade_type2,
                    TradeType3: 1 == t.trade_type3,
                    TradeTypeCur: e,
                    FreeShip: 1 == t.free_ship,
                    showFreeShip: 1 == t.trade_type1 || 1 == t.free_ship,
                    finish: !0,
                    completed: !0
                });
            },
            fail: function(e) {
                console.error(e), app.util.message(res.data.errmsg, "", "error");
            }
        });
    },
    selectCategory: function(e) {
        this.setData({
            cateIndex: e.currentTarget.dataset.index
        });
    },
    bindAgreeChange: function(e) {
        this.setData({
            isAgree: !!e.detail.value.length
        });
    },
    chooseMedia: function(e) {
        var t = this;
        wx.chooseMedia({
            count: 1,
            mediaType: [ "video" ],
            maxDuration: 30,
            success: function(e) {
                console.log("chooseMedia", e), t.uploadVideo(e.tempFiles[0].tempFilePath), t.uploadVideoThumb(e.tempFiles[0].thumbTempFilePath);
            }
        });
    },
    uploadVideo: function(e) {
        var a = this, t = app.util.url("entry/wxapp/item", {
            act: "upload",
            m: "superman_hand2"
        });
        wx.showLoading({
            title: "上传中"
        }), wx.uploadFile({
            url: t,
            filePath: e,
            name: "videoData",
            fail: function(e) {
                app.toast(e.errMsg);
            },
            complete: function() {
                wx.hideLoading();
            },
            success: function(e) {
                var t = JSON.parse(e.data);
                console.log("uploadVideo", t), 0 == t.errno ? ((e = a.data.video).push(t.data), 
                a.setData({
                    video: e
                })) : app.toast(t.errmsg);
            }
        });
    },
    uploadVideoThumb: function(e) {
        var t = this, a = app.util.url("entry/wxapp/item", {
            act: "upload",
            m: "superman_hand2"
        });
        wx.showLoading({
            title: "上传中"
        }), wx.uploadFile({
            url: a,
            filePath: e,
            name: "videoThumb",
            complete: function() {
                wx.hideLoading();
            },
            success: function(e) {
                e = JSON.parse(e.data);
                console.log("uploadVideoThumb", e), 0 == e.errno ? t.setData({
                    video_thumb: e.data.video_thumb
                }) : app.toast(e.errmsg);
            },
            fail: function(e) {
                app.toast(e.errMsg);
            }
        });
    },
    deleteVideo: function(e) {
        var t = this, a = e.currentTarget.dataset.index;
        wx.showModal({
            title: "提示",
            content: "确定要删除该视频吗？",
            success: function(e) {
                e.confirm && t.data.video && ((e = t.data.video).splice(a, 1), t.setData({
                    video: e
                }));
            }
        });
    },
    chooseImage: function(e) {
        var t = this;
        wx.chooseImage({
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(e) {
                t.uploadImg(e.tempFilePaths, 0, e.tempFilePaths.length);
            }
        });
    },
    uploadImg: function(o, i, n) {
        var s = this;
        wx.showLoading({
            title: "上传中"
        }), wx.uploadFile({
            url: app.getUploadUrl("entry/wxapp/item", {
                m: "superman_hand2",
                act: "upload"
            }),
            filePath: o[i],
            name: "imgData",
            complete: function() {
                wx.hideLoading();
            },
            success: function(e) {
                console.log("wx.uploadFile", e), i++;
                var t = JSON.parse(e.data);
                if (console.log("uploadImg-" + i, t), 0 == t.errno) {
                    var e = s.data.album, a = s.data.thumb;
                    e.push(t.data.orignal), a.push(t.data.thumb), s.setData({
                        album: e,
                        thumb: a
                    });
                } else {
                    if (41009 == t.errno) {
                        a = "/pages/post/index";
                        return s.data.item_id && (a += "?id=" + s.data.item_id), void wx.navigateTo({
                            url: "/pages/login/index?redirect=" + encodeURIComponent(a)
                        });
                    }
                    app.toast(t.errmsg);
                }
                i == n || s.uploadImg(o, i, n);
            },
            fail: function(e) {
                console.error("wx.uploadFile", e);
            }
        });
    },
    deleteImg: function(e) {
        var a = this, o = e.currentTarget.dataset.index;
        wx.showModal({
            title: "提示",
            content: "确定要删除该图片吗？",
            success: function(e) {
                var t;
                e.confirm && a.data.album && (t = a.data.album, (e = a.data.thumb) && 0 < e.length && e.splice(o, 1), 
                t.splice(o, 1), a.setData({
                    album: t,
                    thumb: e
                }));
            }
        });
    },
    setInput: function(e) {
        var t = this.data.form_field, a = e.currentTarget.dataset.index, e = e.detail.value;
        t[a].value = e, this.setData({
            form_field: t
        });
    },
    radioChange: function(e) {
        for (var t = this.data.form_field, a = t[e.currentTarget.dataset.index].extra.option, o = 0; o < a.length; o++) a[o].value == e.detail.value ? a[o].checked = !0 : a[o].checked = !1;
        this.setData({
            form_field: t
        });
    },
    checkboxChange: function(e) {
        for (var t = this.data.form_field[e.currentTarget.dataset.index].extra.option, a = e.detail.value, o = 0; o < t.length; o++) {
            t[o].checked = !1;
            for (var i = 0; i < a.length; i++) if (t[o].value == a[i]) {
                t[o].checked = !0;
                break;
            }
        }
        this.setData({
            form_field: fieldss
        });
    },
    bindPickChange: function(e) {
        var t = this.data.form_field, a = e.currentTarget.dataset.index, e = e.detail.value;
        t[a].value = e, this.setData({
            form_field: t
        });
    },
    formSubmit: function(e) {
        console.log("formSubmit", e);
        var t = this;
        if (t.data.submitLoading) return !1;
        t.setData({
            submitLoading: !0
        });
        var a = e.detail.value, o = t.data.cateIndex, i = t.data.category, n = t.data.album, s = t.data.thumb, r = t.data.video, n = n && app.util.base64Encode(JSON.stringify(n)), s = s && app.util.base64Encode(JSON.stringify(s)), r = r && app.util.base64Encode(JSON.stringify(r)), d = "";
        if (t.data.item_id && (d = t.data.item_id), !a.title) return app.toast(t.data.postTitlePlaceholder), 
        void t.setData({
            submitLoading: !1
        });
        if (1 == t.data.video_switch) {
            if (!t.data.album.length && !t.data.video.length) return app.toast("请上传图片" + (1 == t.data.video_switch ? "或视频" : "")), 
            void t.setData({
                submitLoading: !1
            });
        } else if (!t.data.album.length) return app.toast("请上传图片"), void t.setData({
            submitLoading: !1
        });
        if (null === o) return app.toast("请选择分类"), void t.setData({
            submitLoading: !1
        });
        e = [ 3 ];
        if (0 < a.wholesale_empty_price && e.push(1), 0 < a.wholesale_single_price && 0 < a.wholesale_number && e.push(2), 
        t.data.helpSell.switch && (console.log(a), parseFloat(a.commission) > parseFloat(a.price))) return app.toast("帮卖佣金不能高于售价"), 
        void t.setData({
            submitLoading: !1
        });
        if (!t.data.TradeTypeCur.length) return app.toast("请选择发货方式"), void t.setData({
            submitLoading: !1
        });
        var c = t.data.form_field, l = [];
        if (c && 0 < c.length) {
            for (var p = 0; p < c.length; p++) {
                var u = c[p].title;
                if (1 == c[p].required && "" == a[u]) return "text" == c[p].type || "textarea" == c[p].type ? app.toast("请输入" + u) : app.toast("请选择" + u), 
                void t.setData({
                    submitLoading: !1
                });
                u = encodeURIComponent(a[u]);
                l.push(u);
            }
            l = app.util.base64Encode(JSON.stringify(l));
        }
        return t.data.isAgree ? t.data.chooseLocation.address ? (t.setData({
            requestData: {
                m: "superman_hand2",
                act: "post",
                id: d,
                title: a.title,
                description: "undefined" != a.description ? a.description : "",
                album: n,
                thumb: s,
                video: r,
                video_thumb: t.data.video_thumb,
                cid: i[o].id,
                price: a.price,
                commission: a.commission,
                credit: 0,
                wechatpay: 1,
                buy_type: 0,
                lat: t.data.chooseLocation.lat,
                lng: t.data.chooseLocation.lng,
                address: t.data.chooseLocation.address,
                province: t.data.chooseLocation.province,
                city: t.data.chooseLocation.city,
                add_field: l,
                stock: a.stock || 1,
                trade_type: t.data.TradeTypeCur,
                sell_type: e,
                origin_price: a.origin_price || "",
                wholesale_number: a.wholesale_number || "",
                wholesale_single_price: a.wholesale_single_price || "",
                wholesale_empty_price: a.wholesale_empty_price || "",
                sell_region: t.data.SellRegion,
                currencyInfo: t.data.currencyInfo
            }
        }), void t.postPay()) : (app.toast("请选择发货地"), void t.setData({
            submitLoading: !1
        })) : (app.toast("请阅读并同意《" + rule_title + "》"), void t.setData({
            submitLoading: !1
        }));
    },
    postPay: function() {
        var t = this;
        1 == t.data.post_pay && 0 < t.data.post_money ? wx.showModal({
            title: "系统提示",
            content: "发布此物品需要支付" + t.data.post_money + t.data.currencyInfo.title,
            success: function(e) {
                e.confirm ? app.util.request({
                    url: "entry/wxapp/item",
                    cachetime: "0",
                    data: {
                        act: "post_pay",
                        title: t.data.requestData.title,
                        money: t.data.post_money,
                        m: "superman_hand2"
                    },
                    success: function(e) {
                        e = e.data.data;
                        wx.requestPayment({
                            timeStamp: e.timeStamp,
                            nonceStr: e.nonceStr,
                            package: e.package,
                            signType: e.signType,
                            paySign: e.paySign,
                            success: function() {
                                t.postData();
                            }
                        });
                    },
                    fail: function(e) {
                        console.error(e), app.util.message(e.data.errmsg, "", "error");
                    }
                }) : e.cancel && t.setData({
                    submitLoading: !1
                });
            }
        }) : t.postData();
    },
    postData: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/item",
            method: "POST",
            data: t.data.requestData,
            fail: function(e) {
                console.error(e), t.setData({
                    submitLoading: !1
                }), app.util.message(e.data.errmsg, "", "error");
            },
            success: function(e) {
                t.setData({
                    submitLoading: !1
                });
                e = e.data.data.itemid;
                wx.setStorageSync("PostSuccessData-" + e, t.data.requestData), wx.redirectTo({
                    url: "/pages/post/success?id=" + e + "&type=1&wxad_id=" + t.data.WxadInfo.id + "&wxad_type=" + t.data.WxadInfo.type
                });
            }
        });
    },
    changeTradeType: function(e) {
        e = e.detail.value;
        this.setData({
            TradeTypeCur: e,
            showFreeShip: -1 != e.indexOf("1")
        });
    },
    changeSellRegion: function(e) {
        this.setData({
            SellRegion: e.currentTarget.dataset.region
        });
    },
    selectAddress: function(e) {
        var t, a = this, o = a.data.MapKey, i = wx.getStorageSync("AppName") || "超人二手市场", n = a.data.locationInfo;
        n ? "中国" == a.data.locationInfo.address_component.nation && (o ? (t = JSON.stringify({
            latitude: n ? n.location.lat : 39.89631551,
            longitude: n ? n.location.lng : 116.323459711
        }), wx.navigateTo({
            url: "plugin://chooseLocation/index?key=" + o + "&referer=" + i + "&location=" + t + "&category=房产小区,商务楼宇,教育学校"
        })) : app.toast("未设置腾讯地图密钥")) : app.getLocation(function() {
            (n = wx.getStorageSync("LocationInfo")) && (a.setData({
                locationInfo: n,
                chooseLocation: {
                    address: n.address,
                    lat: n.location.lat,
                    lng: n.location.lng,
                    province: n.address_component.province,
                    city: n.address_component.city
                }
            }), console.log("selectAddress: init", n));
        });
    },
    inputDesc: function(e) {
        this.setData({
            descCurLength: e.detail.value.length
        });
    },
    showHelpMsg: function(e) {
        app.util.message(e.currentTarget.dataset.msg, "", "error");
    }
});