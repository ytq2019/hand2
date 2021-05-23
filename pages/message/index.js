var app = getApp();

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        AssetsUrl: app.globalData.AssetsUrl,
        Loading: !0,
        MessageList: [],
        Page: 1,
        showTips: !1
    },
    onLoad: function(t) {
        console.log("onLoad", t);
        this.setData({
            userInfo: wx.getStorageSync("userInfo"),
            ThemeStyle: app.getThemeStyle()
        }), app.viewCount();
    },
    onShow: function() {
        console.log("onShow");
        var a = this;
        app.util.request({
            url: "entry/wxapp/message_count",
            data: {
                m: "superman_hand2",
                act: "display"
            },
            showLoading: !0,
            success: function(t) {
                console.log(t);
                t = t.data.data;
                a.setData({
                    SystemMessage: t.system_message,
                    OrderMessage: t.order_message
                });
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        }), a.setData({
            MessageList: []
        }), a.getIndexData();
    },
    getIndexData: function() {
        var a = this;
        app.util.request({
            method: "GET",
            url: "entry/wxapp/chatroom",
            data: {
                m: "superman_hand2",
                act: "list",
                page: a.data.Page
            },
            showLoading: !0,
            success: function(t) {
                console.log(t), a.loadPageData(t.data.data);
            },
            fail: function(t) {
                var a = "";
                29 == t.data.errno && (a = "/pages/home/index"), app.util.message(t.data.errmsg, a, "error");
            }
        });
    },
    loadPageData: function(t) {
        var a = this.data.MessageList;
        void 0 !== t.message_list && (a = a.concat(t.message_list)), this.setData({
            Loading: !1,
            MessageList: a,
            Gone: void 0 !== t.message_list && !t.message_list.length,
            closePostNotice: 0 == t.post_notice,
            SystemMessage: t.system_message,
            OrderMessage: t.order_message,
            showTips: !t.subscribe && t.pushmsg_open
        });
    },
    onPullDownRefresh: function() {
        this.setData({
            Page: 1,
            MessageList: [],
            Loading: !0
        }), this.getIndexData(), wx.stopPullDownRefresh();
    },
    openChat: function(t) {
        var a = t.currentTarget.dataset.uid, t = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/message/chat?fromuid=" + a + "&itemid=" + t
        });
    },
    onReachBottom: function() {
        var t = this;
        t.data.Gone || (t.setData({
            Page: t.data.Page + 1,
            Paging: !0
        }), t.getIndexData());
    },
    showSubscribe: function(t) {
        this.setData({
            showSubscribeModal: !0
        });
    },
    hideSubscribe: function(t) {
        this.setData({
            showSubscribeModal: !1
        });
    },
    hideTips: function(t) {
        this.setData({
            showTips: !1
        });
    },
    touchStart: function(t) {
        this.setData({
            ListTouchStart: t.touches[0].pageX
        });
    },
    touchMove: function(t) {
        this.setData({
            ListTouchDirection: 0 < t.touches[0].pageX - this.data.ListTouchStart ? "right" : "left"
        });
    },
    touchEnd: function(t) {
        "left" == this.data.ListTouchDirection ? this.setData({
            modalName: t.currentTarget.dataset.target
        }) : this.setData({
            modalName: null
        }), this.setData({
            ListTouchDirection: null
        });
    },
    toDelete: function(a) {
        var e = this;
        wx.showModal({
            title: "系统提示",
            content: "确定要删除吗？",
            success: function(t) {
                t.confirm && app.util.request({
                    method: "POST",
                    url: "entry/wxapp/chatroom",
                    data: {
                        m: "superman_hand2",
                        act: "delete",
                        id: a.currentTarget.dataset.id
                    },
                    showLoading: !0,
                    success: function(t) {
                        console.log(t), e.setData({
                            Page: 1,
                            MessageList: []
                        }), e.getIndexData();
                    },
                    fail: function(t) {
                        console.error(t), app.util.message(t.data.errmsg, "", "error");
                    }
                });
            }
        });
    }
});