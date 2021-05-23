var app = getApp();

Page({
    data: {
        Loading: !0,
        Page: 1,
        Paging: !1,
        ItemList: [],
        itemTypeCur: 1,
        showGoTop: !1
    },
    goTop: function(t) {
        app.superman.goTop(t);
    },
    onLoad: function(t) {
        "undefined" !== t.uid ? (this.setData({
            AppName: wx.getStorageSync("AppName"),
            uid: t.uid,
            AssetsUrl: app.globalData.AssetsUrl,
            SoldImg: wx.getStorageSync("SoldImg") || app.globalData.AssetsUrl + "/yz.png",
            LoadingImg: wx.getStorageSync("LoadingImg"),
            ThemeStyle: app.getThemeStyle(),
            showHomeEntry: getCurrentPages().length <= 1
        }), this.getIndexData(), app.viewCount()) : app.util.message("非法请求", "redirect:/pages/home/index", "error");
    },
    tabItemType: function(t) {
        this.setData({
            itemTypeCur: t.currentTarget.dataset.type,
            ItemList: [],
            Page: 1,
            Gone: !1
        }), this.getItemList();
    },
    getIndexData: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/member",
            data: {
                m: "superman_hand2",
                act: "setting",
                uid: e.data.uid
            },
            showLoading: !0,
            success: function(t) {
                console.log(t);
                t = t.data.data;
                e.setData({
                    Member: t.member,
                    Setting: t.setting,
                    Phone: t.member.phone
                }), e.getItemList();
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    getItemList: function() {
        var i = this;
        app.util.request({
            url: "entry/wxapp/member",
            data: {
                m: "superman_hand2",
                act: "post",
                op: "list",
                page: i.data.Page,
                uid: i.data.uid,
                type: i.data.itemTypeCur
            },
            success: function(t) {
                for (var e = t.data.data.list, a = 0; a < e.length; a++) e[a]._price = app.formatPrice(e[a], i.data.Setting.currency_info.symbol);
                i.setData({
                    Loading: !1,
                    ItemList: e.length ? i.data.ItemList.concat(e) : i.data.ItemList,
                    Gone: !(e.length && 5 <= e.length)
                });
            },
            fail: function(t) {
                app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    previewImage: function() {
        var t = [ this.data.Member.avatar ];
        wx.previewImage({
            current: this.data.Member.avatar,
            urls: t
        });
    },
    onPullDownRefresh: function() {
        this.setData({
            ItemList: [],
            Page: 1,
            Gone: !1
        }), this.getIndexData(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        var t = this;
        t.data.Gone || (t.setData({
            Page: t.data.Page + 1,
            Paging: !0
        }), t.getItemList());
    },
    onPageScroll: function(t) {
        this.setData({
            showGoTop: 500 <= t.scrollTop
        });
    },
    onShareAppMessage: function() {
        return {
            title: this.data.AppName,
            path: "/pages/home/index?redirect=" + encodeURIComponent("/pages/my_list/index?uid=" + this.data.uid)
        };
    },
    onShareTimeline: function() {
        return {
            title: this.data.AppName,
            query: "uid=" + this.data.uid + "&share=timeline"
        };
    },
    callPhone: function (e) {
        var a = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },
    copyWechatNo: function (e) {
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
});