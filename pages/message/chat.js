var app = getApp(), WxEmoji = require("../../libs/WxEmojiView.js");

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        Loading: !0,
        InputBottom: 0,
        Messages: [],
        InputMessage: "",
        Page: 1
    },
    onLoad: function(e) {
        console.log(e);
        var a = this;
        a.setData({
            userInfo: wx.getStorageSync("userInfo"),
            ThemeStyle: app.getThemeStyle()
        }), void 0 !== e.fromuid ? void 0 !== e.itemid ? (a.setData({
            FromUid: e.fromuid,
            ItemId: e.itemid,
            AssetsUrl: app.globalData.AssetsUrl
        }), WxEmoji.bindThis(a), a.getIndexData(!0), app.chatroom.setReceiveMessage(a.receiveMessage), 
        app.viewCount()) : app.util.message("非法请求", "redirect:/pages/home/index", "error") : app.util.message("用户不存在", "redirect:/pages/home/index", "error");
    },
    toPage: function(e) {
        app.superman.toPage(e);
    },
    getIndexData: function(a) {
        var t = this;
        app.util.request({
            method: "GET",
            url: "entry/wxapp/chatroom",
            data: {
                m: "superman_hand2",
                act: "chat",
                from_uid: t.data.FromUid,
                item_id: t.data.ItemId,
                page: t.data.Page
            },
            showLoading: !0,
            success: function(e) {
                console.log(e), t.loadPageData(e.data.data, a);
            },
            fail: function(e) {
                29 == e.data.errno || 22 == e.data.errno ? app.util.message(e.data.errmsg, "redirect:/pages/home/index", "error") : 30 == e.data.errno ? app.util.message(e.data.errmsg, "back", "error") : app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    loadPageData: function(e, a) {
        var t = this, s = t.data.Messages;
        void 0 !== e.messages && (e.messages.forEach(function(e) {
            e.message = WxEmoji.explain(e.message);
        }), a ? s = s.concat(e.messages) : e.messages.forEach(function(e) {
            s.unshift(e);
        }));
        var o = void 0 !== e.item_post ? e.item_post : {};
        o._price = app.formatPrice(o, e.currency_info.symbol), t.setData({
            Loading: !1,
            Paging: !1,
            FromMember: void 0 !== e.from_member ? e.from_member : {},
            ToMember: void 0 !== e.to_member ? e.to_member : {},
            ItemPost: o,
            Messages: t.formatTime(s),
            currencyInfo: e.currency_info
        }), a ? t.pageScrollToBottom() : t.setData({
            Gone: void 0 !== e.messages && !e.messages.length
        });
    },
    focusInput: function(e) {
        e = e.detail.height;
        this.data.showWxEmojiView && (e += 150), this.setData({
            InputBottom: e
        });
    },
    blurInput: function(e) {
        this.setData({
            InputBottom: 0,
            showWxEmojiView: !1
        });
    },
    messageInput: function(e) {
        this.setData({
            InputMessage: e.detail.value
        });
    },
    onPullDownRefresh: function() {
        var e = this;
        e.data.Gone || (e.setData({
            Page: e.data.Page + 1,
            Paging: !0
        }), e.getIndexData(!1)), wx.stopPullDownRefresh();
    },
    sendMessage: function(e) {
        var t, a, s, o = this;
        "off" != o.data.ChatServer ? o.Sending || ("" != o.data.InputMessage ? 4096 < o.data.InputMessage.length ? app.util.message("消息超过发送限制，请分开发送", "", "error") : o.data.userInfo.memberInfo.uid != o.data.ItemPost.uid ? (o.data.showWxEmojiView && o.setData({
            showWxEmojiView: !1,
            InputBottom: o.data.InputBottom - 150
        }), o.Sending = !0, s = new Date(), t = {
            type: "say",
            uniacid: app.siteInfo.uniacid,
            from_uid: parseInt(o.data.ToMember.uid),
            to_uid: parseInt(o.data.FromMember.uid),
            item_id: o.data.ItemId,
            message: o.data.InputMessage,
            timestamp: s.getTime(),
            createtime: app.util.date.dateToStr("yyyy-MM-dd HH:mm:ss", s),
            status: "sending"
        }, a = {
            success: function(e) {
                console.log(e), o.data.Messages.forEach(function(e, a) {
                    e.timestamp == t.timestamp && (o.data.Messages[a].status = "complete");
                }), o.setData({
                    Messages: o.formatTime(o.data.Messages),
                    InputMessage: ""
                });
            },
            fail: function() {},
            complete: function() {
                o.Sending = !1;
            }
        }, (s = Object.assign({}, t)).message = WxEmoji.explain(s.message), o.setData({
            Messages: o.formatTime(o.data.Messages.concat([ s ]))
        }), o.pageScrollToBottom(), app.chatroom.send_message(t, a)) : app.util.message("不能给自己发消息", "", "error") : app.util.message("不能发送空消息", "", "error")) : app.util.message("聊天服务器已关闭", "", "error");
    },
    receiveMessage: function(e) {
        var a = this;
        console.log("receiveMessage", e), e.from_uid != e.to_uid && (e.message = WxEmoji.explain(e.message), 
        a.setData({
            Messages: a.formatTime(a.data.Messages.concat([ e ]))
        }), a.pageScrollToBottom());
    },
    pageScrollToBottom: function() {
        "/pages/message/chat" == app.superman.getCurrentPageUrl() && wx.createSelectorQuery().select(".container").boundingClientRect(function(e) {
            wx.pageScrollTo({
                scrollTop: e.height
            });
        }).exec();
    },
    showDetail: function(e) {
        e = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/detail/index?id=" + e
        });
    },
    showEmoji: function() {
        var e = this;
        e.data.showWxEmojiView ? e.setData({
            showWxEmojiView: !1,
            InputBottom: e.data.InputBottom - 150
        }) : e.setData({
            showWxEmojiView: !0,
            InputBottom: e.data.InputBottom + 150
        });
    },
    wxPreEmojiTap: function(e) {
        this.setData({
            InputMessage: this.data.InputMessage + e.currentTarget.dataset.emoji
        });
    },
    formatTime: function(e, o) {
        if (e) return o = o || "createtime", e.forEach(function(e) {
            var a, t, s;
            e.__formatTime || ("say" != e.type || e.status || (e[o] = app.util.date.dateToStr("yyyy-MM-dd HH:mm:ss", app.util.date.longToDate(1e3 * e[o]))), 
            a = new Date(), t = app.util.date.strFormatToDate("yyyy-MM-dd HH:mm:ss", e[o]), 
            s = app.util.date.dateDiff("s", t, a), app.util.date.dateDiff("n", t, a), app.util.date.dateDiff("h", t, a), 
            app.util.date.dateDiff("d", t, a), e[o] = s < 300 ? "刚刚" : 300 < s && s < 600 ? "5分钟前" : app.util.date.dateToStr("yyyy-MM-dd HH:mm:ss", t), 
            e.__formatTime = !0);
        }), e;
    }
});