var app = getApp();

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        AssetsUrl: app.globalData.AssetsUrl,
        version: app.data.version,
        siteInfo: app.siteInfo,
        waveGif: "https://tva3.sinaimg.cn/large/8d406c5egy1gamn31scsdg20f002skhn.gif",
        Loading: !0,
        credit_on: !1,
        bindPhone: !1,
        showWxad: !0
    },
    onLoad: function(a) {
        console.log("onLoad", a);
        this.setData({
            userInfo: wx.getStorageSync("userInfo"),
            ThemeStyle: app.getThemeStyle()
        }), this.getIndexData(), app.viewCount();
    },
    getIndexData: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/my",
            data: {
                m: "superman_hand2"
            },
            showLoading: !0,
            success: function(a) {
                console.log(a), t.loadPageData(a.data.data);
            },
            fail: function(a) {
                app.util.message(a.data.errmsg, "", "error");
            }
        });
    },
    loadPageData: function(a) {
        var t = this;
        void 0 !== a.member && "微信用户" == a.member.nickname && t.data.userInfo && t.data.userInfo.wxInfo && (a.member.nickname = t.data.userInfo.wxInfo.nickName, 
        a.member.avatar = t.data.userInfo.wxInfo.avatarUrl), t.setData({
            Loading: !1,
            Member: void 0 !== a.member ? a.member : {},
            PraiseTotal: void 0 !== a.praise_total ? a.praise_total : 0,
            FavorTotal: void 0 !== a.favor_total ? a.favor_total : 0,
            SellTotal: void 0 !== a.sell_total ? a.sell_total : 0,
            Balance: void 0 !== a.balance ? app.superman.toDecimal(a.balance) : 0,
            Wxapps: void 0 !== a.wxapps ? a.wxapps : [],
            Recycle: void 0 !== a.recycle ? a.recycle : {},
            Shop: void 0 !== a.shop ? a.shop : {},
            closePostNotice: 0 == a.post_notice,
            Help: a.help,
            CreditInfo: a.credit_info,
            Audit: a.audit,
            PostInfo: a.post_info,
            WxadInfo: a.wxad_info,
            SignInfo: a.sign_info,
            PluginNotice: a.plugin_notice,
            Buying: a.buying,
            Copyright: a.copyright,
            isFeedback: a.feedback,
            bindPhone: a.bind_phone
        });
    },
    onPullDownRefresh: function() {
        this.setData({
            showWxad: !0
        }), this.getIndexData(), wx.stopPullDownRefresh();
    },
    toLogin: function(a) {
        var t = this;
        wx.getStorageSync("userInfo") ? wx.navigateTo({
            url: a.currentTarget.dataset.url
        }) : app.util.getUserInfo(function() {
            t.toLogin(a);
        });
    },
    toPage: function(a) {
        app.superman.toPage(a);
    },
    WxadError: function(a) {
        console.error("WxadError", a), this.setData({
            showWxad: !1
        });
    },
    toSign: function(a) {
        var o = this;
        wx.getStorageSync("userInfo") ? app.util.request({
            method: "POST",
            url: "entry/wxapp/my",
            data: {
                m: "superman_hand2",
                act: "sign_submit"
            },
            showLoading: !0,
            success: function(a) {
                console.log(a);
                a = a.data.data;
                o.setData({
                    signCreditValue: a.credit_value,
                    signDays: a.days,
                    showSignModal: !0,
                    "SignInfo.is_sign": !0
                });
            },
            fail: function(a) {
                var t;
                console.error(a), 31 == a.data.errno ? (t = a.data.data, o.setData({
                    signCreditValue: t.credit_value,
                    signDays: t.days,
                    showSignModal: !0,
                    "SignInfo.is_sign": !0
                })) : app.util.message(a.data.errmsg, "", "error");
            }
        }) : app.util.getUserInfo(function() {
            o.toSign(a);
        });
    },
    showSignModal: function(a) {
        this.setData({
            showSignModal: !0
        });
    },
    hideSignModal: function(a) {
        this.setData({
            showSignModal: !1
        });
    },
    confirmSignModal: function(a) {
        this.setData({
            showSignModal: !1
        }), this.getIndexData();
    },
    getUserProfile: function(a) {
        var t = this;
        wx.getUserProfile({
            desc: "更新用户信息",
            success: function(a) {
                app.util.getUserInfo(function() {
                    t.onLoad();
                }, a);
            },
            fail: function(a) {
                console.error(a), app.util.message("未获取用户信息，无法执行", "", "error");
            }
        });
    }
});