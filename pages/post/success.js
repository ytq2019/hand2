var app = getApp();

Page({
    data: {
        appInfo: app.globalData.appInfo,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        AssetsUrl: app.globalData.AssetsUrl,
        Loading: !0,
        FreeShip: !1,
        showWxad: !0
    },
    onLoad: function(e) {
        console.log("onLoad", e);
        var a, r = wx.getStorageSync("PostSuccessData-" + e.id), i = !1;
        r && (r.thumb = JSON.parse(app.util.base64Decode(r.thumb)), r.album = JSON.parse(app.util.base64Decode(r.album)), 
        i = -1 != r.trade_type.indexOf("free_ship"), r.price = r.price ? parseFloat(r.price).toFixed(2) : 0, 
        r.origin_price = "" != r.origin_price ? parseFloat(r.origin_price).toFixed(2) : 0, 
        r.wholesale_single_price = r.wholesale_single_price ? parseFloat(r.wholesale_single_price).toFixed(2) : 0, 
        r.wholesale_empty_price = r.wholesale_empty_price ? parseFloat(r.wholesale_empty_price).toFixed(2) : 0, 
        r._price = app.formatPrice(r, r.currencyInfo.symbol), 0 == r.buy_type && (0 < r.price && (a = r.price.split("."), 
        r._price_integer = parseInt(a[0]), r._price_decimal = void 0 !== a[1] ? a[1] : "00"), 
        0 < r.origin_price && (a = r.origin_price.split("."), r._origin_price_integer = parseInt(a[0]), 
        r._origin_price_decimal = void 0 !== a[1] ? a[1] : "00"))), this.setData({
            ThemeStyle: app.getThemeStyle(),
            ItemRefresh: wx.getStorageSync("ItemRefresh"),
            ItemId: e.id,
            Type: e.type,
            Item: r,
            FreeShip: i,
            WxadInfo: {
                id: e.wxad_id,
                type: e.wxad_type
            }
        }), this.getIndexData(), app.viewCount();
    },
    toPage: function(e) {
        app.superman.toPage(e);
    },
    getIndexData: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/my",
            data: {
                m: "superman_hand2",
                act: "subscribe"
            },
            showLoading: !0,
            success: function(e) {
                console.log(e);
                e = e.data.data;
                a.setData({
                    Loading: !1,
                    isSubscribe: e.is_subscribe,
                    subscribeUrl: e.subscribe_url ? "/pages/webview/index?url=" + encodeURIComponent(e.subscribe_url) : ""
                });
            },
            fail: function(e) {
                console.error(e), app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    WxadError: function(e) {
        console.error("WxadError", e), this.setData({
            showWxad: !1
        });
    }
});